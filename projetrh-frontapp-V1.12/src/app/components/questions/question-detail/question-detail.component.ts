import {Component, OnDestroy, OnInit} from '@angular/core';
import {AnswerAPIService} from "../../../services/API/answerAPI.service";
import {Observable, of, Subject, takeUntil, tap} from "rxjs";
import {Question} from "../../../models/question.model";
import {Answer} from "../../../models/answer.model";
import {QuestionAPIService} from "../../../services/API/questionAPI.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogDeleteComponent} from "../../shared/dialog-delete/dialog-delete.component";
import {QuestionEditComponent} from "../question-edit/question-edit.component";
import {QuestionsComponent} from "../questions.component";
import {SelectedItemsService} from "../../../services/selectedItems.service";

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrl: './question-detail.component.scss'
})
export class QuestionDetailComponent implements OnInit, OnDestroy {
  question$!: Observable<Question>;
  answers$!: Observable<Answer[]>;
  questionId!: number;
  private unsubscribe$ = new Subject<void>();

  constructor(private questionAPIService: QuestionAPIService,
              private answerAPIService: AnswerAPIService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private selectedItemsService: SelectedItemsService) {
  }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (params: Params) => {
          // Recover question's id in the route
          this.questionId = +params['id'];

          // Recover observable of question and check if it's needed to change the selected list of the Questions component
          this.question$ = this.questionAPIService.getItem(this.questionId).pipe(
            tap(question => {
              this.checkIfNeededToChangeSelectedList(question);
            })
          );

          // Recover observable of answers
          this.answers$ = this.answerAPIService.getAnswersByQuestionId(this.questionId);
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Delete question from database and redirect user to "/questions"
   */
  deleteQuestion() {
    this.questionAPIService.deleteItem(this.questionId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.router.navigate(['/questions']));
  }

  /**
   * First, configure MatDialog settings for DialogDelete component.
   * Second, open DialogDelete component.
   * Finally, listen for response and cancel/confirm deleting action.
   * @param enterAnimationDuration
   * @param exitAnimationDuration
   */
  openDeleteDialog(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogConfig = new MatDialogConfig();
    let dataType = 'question';
    let dataNote = ''; // Handled with json files of ngx-translate
    dialogConfig.data = {dataType, dataNote};
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    // Check if returned value by DialogDelete component is true. If it is the case, execute @deleteQuestion()
    const dialogRef = this.dialog.open(DialogDeleteComponent, dialogConfig);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        data => data ? this.deleteQuestion() : null
      );
  }

  /**
   * First, configure MatDialog settings for Question-edit component.
   * Second, open Question-edit component.
   * Finally, listen for response. If any, it's the updated question/answers, transform them in observables.
   * @param questionToEdit
   * @param linkedAnswers
   * @param enterAnimationDuration
   * @param exitAnimationDuration
   */
  openEditDialog(questionToEdit: Question, linkedAnswers: Answer[], enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {questionToEdit, linkedAnswers};
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    // If response isn't null, recover question/answers and transform them in observable type.
    let dialogRef = this.dialog.open(QuestionEditComponent, dialogConfig);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if (response) {
          this.question$ = of(response.updatedQuestion);
          this.answers$ = of(response.updatedAnswers);
        }
      });
  }

  /**
   * Check if the selected list (of SelectedItemsService) has the same value as question.archived.
   * If it's the same, don't do anything.
   * If it's not, change selected list (of Questions component) value.
   * @param question
   */
  checkIfNeededToChangeSelectedList(question: Question) {
    let subj = this.selectedItemsService.isArchivedQuestionsListSelected;
    if (subj.getValue() != question.archived) {
      subj.next(question.archived);
    }
  }

  /**
   * Check the value of question.archived, change it to the opposite and update DB
   * @param question
   */
  onChangeArchivedValue(question: Question) {
    this.questionAPIService.changeItemArchivedValue(question)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(question => this.question$ = of(question));
  }
}
