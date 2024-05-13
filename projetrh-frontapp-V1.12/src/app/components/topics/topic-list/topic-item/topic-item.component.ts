import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Topic} from "../../../../models/topic.model";
import {SelectedItemsService} from "../../../../services/selectedItems.service";

@Component({
  selector: 'app-topic-item',
  templateUrl: './topic-item.component.html',
  styleUrl: './topic-item.component.scss'
})
export class TopicItemComponent implements OnInit, OnDestroy {
  @Input() topic!: Topic;
  idSelectedTopic!: number;
  private unsubscribe$ = new Subject<void>();

  constructor(private selectedItemsService: SelectedItemsService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    // Recover the id of the selected topic.
    // Works in all case, excepted if the user land on "/topics/id" using a link.
    // Cause of the Topic-start component who hasn't been initialized (and it's him who initialize selectedItemsService.idTopicSelected).
    this.selectedItemsService.idTopicSelected
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(id => {
        this.idSelectedTopic = id;
      })

    // Method to initialize @idSelectedTopic if user land on "/topics/id" by directly entering the link in the browser.
    // Also used if user land on "/topics/id" this way and refresh.
    this.route.firstChild?.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(params => {
        const id = +params['id'];
        // Can be null in the case user was redirected from "/topic" by the Topic-start component
        if (id >= 0) {
          this.idSelectedTopic = id;
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
