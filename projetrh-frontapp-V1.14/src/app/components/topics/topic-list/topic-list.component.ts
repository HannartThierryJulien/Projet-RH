import {AfterViewInit, Component, inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject, switchMap, takeUntil} from "rxjs";
import {TopicAPIService} from "../../../services/API/topicAPI.service";
import {Topic} from "../../../models/topic.model";
import {SelectedItemsService} from "../../../services/selectedItems.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrl: './topic-list.component.scss'
})
export class TopicListComponent implements OnInit, OnDestroy, AfterViewInit {
  public topicAPIService = inject(TopicAPIService);
  private selectedItemsService = inject(SelectedItemsService);
  private route = inject(ActivatedRoute);

  private unsubscribe$ = new Subject<void>();
  idSelectedTopic!: number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['label'];
  dataSource: MatTableDataSource<Topic> = new MatTableDataSource<Topic>();
  @Input() isSearching!: boolean;
  searchInput: string = '';
  pageSize = 10;
  pageSizeOptions = [3, 5, 10];

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
      this.scrollToSelectedTopic();
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

  /**
   * Scroll to the selected Topic in the table
   *
   * @private
   */
  private scrollToSelectedTopic() {
    if (this.idSelectedTopic !== null && this.paginator) {
      const index = this.dataSource.data.findIndex(q => q.id === this.idSelectedTopic);
      if (index >= 0) {
        this.paginator.pageIndex = Math.floor(index / this.paginator.pageSize);
        // Update paginator
        this.dataSource.paginator = this.paginator;
      }
    }
  }

  /**
   * Apply filter to table's data based on user input.
   * @param event
   */
  applyFilter(event: Event) {
    // Extract filter value from input event
    const filterValue = (event.target as HTMLInputElement).value;
    // Apply filter to data source
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // If pagination is enabled and data source has a paginator
    if (this.dataSource.paginator) {
      // Reset to the first page after filtering
      this.dataSource.paginator.firstPage();
    }
  }

}
