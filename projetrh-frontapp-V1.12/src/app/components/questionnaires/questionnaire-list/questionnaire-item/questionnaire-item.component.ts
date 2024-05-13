import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Questionnaire} from "../../../../models/questionnaire.model";
import {QuestionnaireListComponent} from "../questionnaire-list.component";
import {SelectedItemsService} from "../../../../services/selectedItems.service";

@Component({
  selector: 'app-questionnaire-item',
  templateUrl: './questionnaire-item.component.html',
  styleUrl: './questionnaire-item.component.scss'
})
export class QuestionnaireItemComponent implements OnInit, OnDestroy {
  @Input() questionnaire!: Questionnaire;
  idSelectedQuestionnaire!: number;
  private unsubscribe$ = new Subject<void>();

  constructor(private selectedItemsService: SelectedItemsService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    // Recover the id of the selected questionnaire.
    // Works in all case, excepted if the user land on "/questionnaires/id" using a link.
    // Cause of the Questionnaire-start component who hasn't been initialized (and it's him who initialize selectedItemsService.idQuestionnaireSelected).
    this.selectedItemsService.idQuestionnaireSelected
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(id => {
        this.idSelectedQuestionnaire = id;
      })

    // Method to initialize @idSelectedQuestionnaire if user land on "/questionnaires/id" by directly entering the link in the browser.
    // Also used if user land on "/questionnaires/id" this way and refresh.
    this.route.firstChild?.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(params => {
        const id = +params['id'];
        // Can be null in the case user was redirected from "/questionnaire" by the Questionnaire-start component
        if (id >= 0) {
          this.idSelectedQuestionnaire = id;
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
