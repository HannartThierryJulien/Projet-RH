import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {Question} from "../../../models/question.model";
import {QuestionAPIService} from "../../../services/API/questionAPI.service";
import {QuestionsComponent} from "../questions.component";
import {Subject, switchMap, takeUntil} from "rxjs";
import {SelectedItemsService} from "../../../services/selectedItems.service";

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.scss'
})
export class QuestionListComponent implements OnInit, OnDestroy {
  questions: Question[] = [];
  @Input() searchText: string = '';
  @Input() selectedFilterProperty = '';
  private unsubscribe$ = new Subject<void>();

  constructor(public questionAPIService: QuestionAPIService,
              private selectedItemsService: SelectedItemsService) {
  }

  ngOnInit() {
    // Recover the appropriate list of questions (unarchived/archived) based on @isArchivedListSelected from SelectedItemsService
    this.selectedItemsService.isArchivedQuestionsListSelected.pipe(
      switchMap(isArchivedListSelected =>
        this.questionAPIService.getItems(isArchivedListSelected).pipe(
          takeUntil(this.unsubscribe$)
        )
      )
    ).subscribe(questions => {
      this.questions = questions;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Inform Question-item component which question is selected by user
   * @param id
   */
  onSelectQuestion(id: number) {
    this.selectedItemsService.idQuestionSelected.next(id);
  }

}
