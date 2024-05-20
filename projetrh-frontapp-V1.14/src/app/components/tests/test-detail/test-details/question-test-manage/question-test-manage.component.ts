import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TestAssignationComponent} from "../../test-assignation/test-assignation.component";
import {Test} from "../../../../../models/test.model";
import {finalize, forkJoin, of, Subject, takeUntil, tap} from "rxjs";
import {QuestionTestAPIService} from "../../../../../services/API/question-testAPI.service";
import {QuestionnaireAPIService} from "../../../../../services/API/questionnaireAPI.service";
import {Questionnaire} from "../../../../../models/questionnaire.model";
import {MatTableDataSource} from "@angular/material/table";
import {QuestionAPIService} from "../../../../../services/API/questionAPI.service";
import {Question} from "../../../../../models/question.model";
import {QuestionTest} from "../../../../../models/question-test.model";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-question-test-manage',
  templateUrl: './question-test-manage.component.html',
  styleUrl: './question-test-manage.component.scss'
})
export class QuestionTestManageComponent implements OnInit, OnDestroy, AfterViewInit {
  private unsubscribe$ = new Subject<void>();
  questionnaires: Questionnaire[] = [];
  questionnairesTabledisplayedColumns: string[] = ['label', 'actions'];
  questionnairesTableSource = new MatTableDataSource<Questionnaire>();
  questionnairesTablePageSize = 7;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  questionsTabledisplayedColumns: string[] = ['label', 'actions'];
  questionsTableSource = new MatTableDataSource<Question>();

  addedQuestionTests: QuestionTest[] = [];
  addedQuestions: Question[] = [];
  addedQuestionsToRemove: Question[] = [];
  questionsToAdd: Question[] = [];

  constructor(public dialogRef: MatDialogRef<TestAssignationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Test,
              private questionnaireAPIService: QuestionnaireAPIService,
              private questionTestAPIService: QuestionTestAPIService,
              private questionAPIService: QuestionAPIService) {
  }

  ngOnInit() {
    this.questionnaireAPIService.getItems(false)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(questionnaires => {
        this.questionnaires = questionnaires;
        this.questionnairesTableSource.data = questionnaires;
      });

    this.questionTestAPIService.getAllQuestionTestByTestId(this.data.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(addedQuestionTests => {
        this.addedQuestionTests = addedQuestionTests;

        addedQuestionTests.forEach(questionTest => {
          this.addedQuestions.push(questionTest.question);
        });
        this.questionsTableSource.data = this.addedQuestions;
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit() {
    this.questionnairesTableSource.paginator = this.paginator;
  }

  /**
   * Close the MatDialog of the question-test-manage component
   */
  onClose(updatedQuestionTestsArray?: QuestionTest[]): void {
    this.dialogRef.close(updatedQuestionTestsArray);
  }

  onAddQuestionsFromQuestionnaire(idQuestionnaire: number) {
    this.questionAPIService.getQuestionsByArchivedAndQuestionnaireId(false, idQuestionnaire)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(questions => {

        questions.forEach(question => {
          if (!this.isQuestionPresentInArray(question.id, this.questionsToAdd) && !this.isQuestionPresentInArray(question.id, this.addedQuestions)) {
            this.questionsToAdd.push(question);
          }
        });

        this.updateQuestionsTable();
      });
  }

  onRemoveQuestion(questionId: number) {
    if (this.isQuestionPresentInArray(questionId, this.addedQuestions)) {
      const removedQuestionIndex = this.addedQuestions.findIndex(q => q.id === questionId);
      const removedQuestion = this.addedQuestions.splice(removedQuestionIndex, 1)[0];
      this.addedQuestionsToRemove.push(removedQuestion);
    } else if (this.isQuestionPresentInArray(questionId, this.questionsToAdd)) {
      const removedQuestionIndex = this.questionsToAdd.findIndex(q => q.id === questionId);
      this.questionsToAdd.splice(removedQuestionIndex, 1);
    }

    this.updateQuestionsTable();
  }

  private updateQuestionsTable() {
    this.questionsTableSource.data = [...this.addedQuestions, ...this.questionsToAdd];
  }

  private isQuestionPresentInArray(questionId: number, questions: Question[]): boolean {
    return questions.some(q => q.id === questionId);
  }

  onUpdateLinkedQuestions() {
    let updatedQuestionTests: QuestionTest[] = [];

    // Utiliser forkJoin pour attendre que toutes les opérations avec l'API soient terminées
    forkJoin([
      ...this.addedQuestionsToRemove.map(q => {
        const questionTestToRemove = this.addedQuestionTests.find(questionTest => questionTest.question === q);
        if (questionTestToRemove) {
          return this.questionTestAPIService.deleteItem(questionTestToRemove.id, false)
            .pipe(tap(() => {
              // Suppression réussie, retirer questionTestToRemove de addedQuestionTests
              this.addedQuestionTests = this.addedQuestionTests.filter(qt => qt !== questionTestToRemove);
            }));
        } else {
          return of(null); // Retourner un observable vide si aucun élément à supprimer n'est trouvé
        }
      }),
      ...this.questionsToAdd.map(q => {
        let questionTestToAdd = new QuestionTest(0, q, this.data);
        return this.questionTestAPIService.addItem(questionTestToAdd, false)
          .pipe(tap(addedQuestionTest => {
            updatedQuestionTests.push(addedQuestionTest);
          }));
      })
    ])
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        // Toutes les opérations avec l'API sont terminées, ajouter les éléments restants à updatedQuestionTests et appeler onClose
        updatedQuestionTests.push(...this.addedQuestionTests);
        this.onClose(updatedQuestionTests);
      });
  }

}
