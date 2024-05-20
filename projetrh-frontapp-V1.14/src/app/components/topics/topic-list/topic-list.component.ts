import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject, switchMap, takeUntil} from "rxjs";
import {TopicAPIService} from "../../../services/API/topicAPI.service";
import {TopicsComponent} from "../topics.component";
import {Topic} from "../../../models/topic.model";
import {SelectedItemsService} from "../../../services/selectedItems.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Question} from "../../../models/question.model";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrl: './topic-list.component.scss'
})
export class TopicListComponent implements OnInit, OnDestroy, AfterViewInit {
  private unsubscribe$ = new Subject<void>();
  idSelectedTopic!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['label'];
  dataSource: MatTableDataSource<Topic> = new MatTableDataSource<Topic>();
  @Input() isSearching!: boolean;
  searchInput: string = '';
  pageSize = 10;
  pageSizeOptions = [3, 5, 10];

  constructor(public topicAPIService: TopicAPIService,
              private selectedItemsService: SelectedItemsService,
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

    // Recover the appropriate list of topics (unarchived/archived) based on @isArchivedListSelected from Topics component
    this.selectedItemsService.isArchivedTopicsListSelected.pipe(
      switchMap(isArchivedListSelected =>
        this.topicAPIService.getItems(isArchivedListSelected).pipe(
          takeUntil(this.unsubscribe$)
        )
      )
    ).subscribe(topics => {
      this.dataSource.data = topics;
      this.scrollToSelectedQuestion();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Inform Topic-item component which topic is selected by user
   * @param id
   */
  onSelectTopic(id: number) {
    this.selectedItemsService.idTopicSelected.next(id);
  }

  private scrollToSelectedQuestion() {
    if (this.idSelectedTopic !== null && this.paginator) {
      const index = this.dataSource.data.findIndex(q => q.id === this.idSelectedTopic);
      if (index >= 0) {
        this.paginator.pageIndex = Math.floor(index / this.paginator.pageSize);
        this.dataSource.paginator = this.paginator;
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
