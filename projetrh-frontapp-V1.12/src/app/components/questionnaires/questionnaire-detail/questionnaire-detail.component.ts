import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subject, takeUntil, tap} from "rxjs";
import {Question} from "../../../models/question.model";
import {QuestionAPIService} from "../../../services/API/questionAPI.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogDeleteComponent} from "../../shared/dialog-delete/dialog-delete.component";
import {Questionnaire} from "../../../models/questionnaire.model";
import {QuestionnaireEditComponent} from "../questionnaire-edit/questionnaire-edit.component";
import {QuestionnairesComponent} from "../questionnaires.component";
import {QuestionnaireAPIService} from "../../../services/API/questionnaireAPI.service";
import {SelectedItemsService} from "../../../services/selectedItems.service";

@Component({
  selector: 'app-questionnaire-detail',
  templateUrl: './questionnaire-detail.component.html',
  styleUrl: './questionnaire-detail.component.scss'
})
export class QuestionnaireDetailComponent implements OnInit, OnDestroy {
  questions$!: Observable<Question[]>;
  questionnaire$!: Observable<Questionnaire>;
  questionnaireId!: number;
  private unsubscribe$ = new Subject<void>();

  constructor(private questionnaireAPIService: QuestionnaireAPIService,
              private selectedItemsService: SelectedItemsService,
              private questionAPIService: QuestionAPIService,
              private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (params: Params) => {
          // Recover questionnaire's id in the route
          this.questionnaireId = +params['id'];

          // Recover observable of questionnaire and check if it's needed to change the selected list of the Questionnaires component
          this.questionnaire$ = this.questionnaireAPIService.getItem(this.questionnaireId).pipe(
            tap(questionnaire => {
              this.checkIfNeededToChangeSelectedList(questionnaire);
            })
          );

          // Recover observable of questions
          this.questions$ = this.questionAPIService.getQuestionsByArchivedAndQuestionnaireId(false, this.questionnaireId);
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Delete questionnaire from database and redirect user to "/questionnaires"
   */
  deleteQuestionnaire() {
    this.questionnaireAPIService.deleteItem(this.questionnaireId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.router.navigate(['/questionnaires']));
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
    let dataType = 'questionnaire';
    let dataNote = ''; // Handled with json files of ngx-translate
    dialogConfig.data = {dataType, dataNote};
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    // Check if returned value by DialogDelete component is true. If it is the case, execute @deleteQuestionnaire()
    const dialogRef = this.dialog.open(DialogDeleteComponent, dialogConfig);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        data => data ? this.deleteQuestionnaire() : null
      );
  }

  /**
   * First, configure MatDialog settings for Questionnaire-edit component.
   * Second, open Questionnaire-edit component.
   * Finally, listen for response. If any, it's the updated questionnaire, transform it in observables.
   * @param questionnaireToEdit
   * @param enterAnimationDuration
   * @param exitAnimationDuration
   */
  openEditDialog(questionnaireToEdit: Questionnaire, enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {questionnaireToEdit};
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    // If response isn't null, recover questionnaire and transform it in observable type.
    let dialogRef = this.dialog.open(QuestionnaireEditComponent, dialogConfig);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if (response) {
          this.questionnaire$ = of(response.updatedQuestionnaire);
        }
      });
  }

  /**
   * Check if the selected list (of Questionnaires component) has the same value as questionnaire.archived.
   * If it's the same, don't do anything.
   * If it's not, change selected list (of Questionnaires component) value.
   * @param questionnaire
   */
  checkIfNeededToChangeSelectedList(questionnaire: Questionnaire) {
    let subj = this.selectedItemsService.isArchivedQuestionnairesListSelected;
    if (subj.getValue() != questionnaire.archived) {
      subj.next(questionnaire.archived);
    }
  }

  /**
   * Check the value of questionnaire.archived, change it to the opposite and update DB
   * @param questionnaire
   */
  onChangeArchivedValue(questionnaire: Questionnaire) {
    this.questionnaireAPIService.changeItemArchivedValue(questionnaire)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(questionnaire => this.questionnaire$ = of(questionnaire));
  }
}
