import {AfterViewInit, Component, inject, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TestAssignationComponent} from "../../test-assignation/test-assignation.component";
import {Test} from "../../../../../models/test.model";
import {forkJoin, of, Subject, takeUntil, tap} from "rxjs";
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
  public dialogRef = inject(MatDialogRef<TestAssignationComponent>);
  public data: Test = inject(MAT_DIALOG_DATA);
  private questionnaireAPIService = inject(QuestionnaireAPIService);
  private questionTestAPIService = inject(QuestionTestAPIService);
  private questionAPIService = inject(QuestionAPIService);

  private unsubscribe$ = new Subject<void>();
  questionnaires: Questionnaire[] = [];
  questionnairesTableDisplayedColumns: string[] = ['label', 'actions'];
  questionnairesTableSource = new MatTableDataSource<Questionnaire>();
  questionnairesTablePageSize = 7;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  questionsTableDisplayedColumns: string[] = ['label', 'actions'];
  questionsTableSource = new MatTableDataSource<Question>();

  addedQuestionTests: QuestionTest[] = []; // Contains all the questionTest already linked to the test.
  addedQuestions: Question[] = []; // Contains all the question already linked to the test.
  addedQuestionsToRemove: Question[] = []; // Contains all the questions (already linked) that have to be removed from the test.
  questionsToAdd: Question[] = []; // Contains all the questions that have to be linked to the test.

  ngOnInit() {
    // Retrieve all unarchived questionnaires
    this.questionnaireAPIService.getItems(false)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(questionnaires => {
        this.questionnaires = questionnaires;
        this.questionnairesTableSource.data = questionnaires;
      });

    // Retrieve all linked questionTests and add them to this.addedQuestions
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

  /**
   * Import all unarchived questions from a questionnaire into the table (if not already added).
   * @param idQuestionnaire
   */
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

  /**
   * Remove a question from the table.
   * @param questionId
   */
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

  /**
   * Update table's data with the addedQuestions and questionsToAdd
   * @private
   */
  private updateQuestionsTable() {
    this.questionsTableSource.data = [...this.addedQuestions, ...this.questionsToAdd];
  }

  /**
   * Used to know if a question is already present in an array.
   * @param questionId
   * @param questions
   * @private
   */
  private isQuestionPresentInArray(questionId: number, questions: Question[]): boolean {
    return questions.some(q => q.id === questionId);
  }

  /**
   * Update the linked questionTests by removing those specified for removal and adding new ones.
   */
  onUpdateLinkedQuestions() {
    let updatedQuestionTests: QuestionTest[] = [];

    // ForkJoin used to wait for all the API operations to be completed
    forkJoin([
      // For each question to remove, find and delete its corresponding questionTest
      ...this.addedQuestionsToRemove.map(q => {
        const questionTestToRemove = this.addedQuestionTests.find(questionTest => questionTest.question === q);
        if (questionTestToRemove) {
          return this.questionTestAPIService.deleteItem(questionTestToRemove.id, false)
            .pipe(tap(() => {
              // Removal successful, remove questionTestToRemove from addedQuestionTests
              this.addedQuestionTests = this.addedQuestionTests.filter(qt => qt !== questionTestToRemove);
            }));
        } else {
          // Return an empty observable if no questionTest to delete
          return of(null);
        }
      }),
      // For each question to add, create a new questionTest and add it
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
        // When all API operations completed, merge the existing linked questionTests and the newly created ones
        updatedQuestionTests.push(...this.addedQuestionTests);
        // Close dialog and send the new linked questionTests
        this.onClose(updatedQuestionTests);
      });
  }

}
