import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Question} from "../../../../models/question.model";
import {QuestionListComponent} from "../question-list.component";
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Params, Router} from "@angular/router";
import {filter, Observable, Subject, Subscription, takeUntil} from "rxjs";
import {SelectedItemsService} from "../../../../services/selectedItems.service";

@Component({
  selector: 'app-question-item',
  templateUrl: './question-item.component.html',
  styleUrl: './question-item.component.scss'
})
export class QuestionItemComponent implements OnInit, OnDestroy {
  @Input() question!: Question;
  idSelectedQuestion!: number;
  private unsubscribe$ = new Subject<void>();

  constructor(private selectedItemsService: SelectedItemsService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    // Recover the id of the selected question.
    // Works in all case, excepted if the user land on "/questions/id" using a link.
    // Cause of the Question-start component who hasn't been initialized (and it's him who initialize selectedItemsService.idQuestionSelected).
    this.selectedItemsService.idQuestionSelected
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(id => {
        this.idSelectedQuestion = id;
      })

    // Method to initialize @idSelectedQuestion if user land on "/questions/id" by directly entering the link in the browser.
    // Also used if user land on "/questions/id" this way and refresh.
    this.route.firstChild?.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(params => {
        const id = +params['id'];
        // Can be null in the case user was redirected from "/question" by the Question-start component
        if (id >= 0) {
          this.idSelectedQuestion = id;
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
