import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, switchMap, takeUntil} from "rxjs";
import {TopicAPIService} from "../../../services/API/topicAPI.service";
import {TopicsComponent} from "../topics.component";
import {Topic} from "../../../models/topic.model";
import {SelectedItemsService} from "../../../services/selectedItems.service";

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrl: './topic-list.component.scss'
})
export class TopicListComponent implements OnInit, OnDestroy {
  topics: Topic[] = [];
  @Input() searchText: string = '';
  @Input() selectedFilterProperty = '';
  private unsubscribe$ = new Subject<void>();

  constructor(public topicAPIService: TopicAPIService,
              private selectedItemsService: SelectedItemsService) {
  }

  ngOnInit() {
    // Recover the appropriate list of topics (unarchived/archived) based on @isArchivedListSelected from Topics component
    this.selectedItemsService.isArchivedTopicsListSelected.pipe(
      switchMap(isArchivedListSelected =>
        this.topicAPIService.getItems(isArchivedListSelected).pipe(
          takeUntil(this.unsubscribe$)
        )
      )
    ).subscribe(topics => {
      this.topics = topics;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Inform Topic-item component which topic is selected by user
   * @param id
   */
  onSelectTopic(id: number) {
    this.selectedItemsService.idTopicSelected.next(id);
  }

}
