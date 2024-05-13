import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, switchMap, takeUntil} from "rxjs";
import {QuestionnairesComponent} from "../questionnaires.component";
import {QuestionnaireAPIService} from "../../../services/API/questionnaireAPI.service";
import {Questionnaire} from "../../../models/questionnaire.model";
import {SelectedItemsService} from "../../../services/selectedItems.service";

@Component({
  selector: 'app-questionnaire-list',
  templateUrl: './questionnaire-list.component.html',
  styleUrl: './questionnaire-list.component.scss'
})
export class QuestionnaireListComponent implements OnInit, OnDestroy {
  questionnaires: Questionnaire[] = [];
  @Input() searchText: string = '';
  @Input() selectedFilterProperty = '';
  private unsubscribe$ = new Subject<void>();

  constructor(public questionnaireAPIService: QuestionnaireAPIService,
              public questionnairesComponent: QuestionnairesComponent,
              private selectedItemsService: SelectedItemsService) {
  }

  ngOnInit() {
    // Recover the appropriate list of questionnaires (unarchived/archived) based on @isArchivedListSelected from Questionnaires component
    this.selectedItemsService.isArchivedQuestionnairesListSelected.pipe(
      switchMap(isArchivedListSelected =>
        this.questionnaireAPIService.getItems(isArchivedListSelected).pipe(
          takeUntil(this.unsubscribe$)
        )
      )
    ).subscribe(questionnaires => {
      this.questionnaires = questionnaires;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Inform Questionnaire-item component which questionnaire is selected by user
   * @param id
   */
  onSelectQuestionnaire(id: number) {
    this.selectedItemsService.idQuestionnaireSelected.next(id);
  }

}
