import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {SelectedItemsService} from "../../../services/selectedItems.service";
import {Router} from "@angular/router";
import {QuestionnaireAPIService} from "../../../services/API/questionnaireAPI.service";
import {Questionnaire} from "../../../models/questionnaire.model";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-questionnaire-start',
  templateUrl: './questionnaire-start.component.html',
  styleUrl: './questionnaire-start.component.scss'
})
export class QuestionnaireStartComponent implements OnInit, OnDestroy {
  private questionnaireAPIService = inject(QuestionnaireAPIService);
  private selectedItemsService = inject(SelectedItemsService);
  private router = inject(Router);

  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.questionnaireAPIService.getItems(false)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (questionnaires: Questionnaire[]) => {
          // Once there is at least one questionnaire in the array, mark it as selected and redirect user to these questionnaire's details
          if (questionnaires.length > 0) {
            this.selectedItemsService.idQuestionnaireSelected.next(questionnaires[0].id);
            this.router.navigate(['/questionnaires', questionnaires[0].id]);
          }
        });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
