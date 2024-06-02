import {AfterViewInit, Component, inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Question} from "../../../models/question.model";
import {QuestionAPIService} from "../../../services/API/questionAPI.service";
import {Subject, switchMap, takeUntil} from "rxjs";
import {SelectedItemsService} from "../../../services/selectedItems.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.scss'
})
export class QuestionListComponent implements OnInit, OnDestroy, AfterViewInit {
  private questionAPIService = inject(QuestionAPIService);
  private selectedItemsService = inject(SelectedItemsService);
  private route = inject(ActivatedRoute);

  private unsubscribe$ = new Subject<void>();
  idSelectedQuestion!: number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['label'];
  dataSource: MatTableDataSource<Question> = new MatTableDataSource<Question>();
  @Input() isSearching!: boolean;
  searchInput: string = '';
  pageSize = 10;
  pageSizeOptions = [3, 5, 10];

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

    // Recover the appropriate list of questions (unarchived/archived) based on @isArchivedListSelected from Questions component
    this.selectedItemsService.isArchivedQuestionsListSelected.pipe(
      switchMap(isArchivedListSelected =>
        this.questionAPIService.getItems(isArchivedListSelected).pipe(
          takeUntil(this.unsubscribe$)
        )
      )
    ).subscribe(questions => {
      this.dataSource.data = questions;
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

  onSelectQuestion(id: number) {
    this.selectedItemsService.idQuestionSelected.next(id);
  }

  /**
   * Scroll to the selected question in the table
   * @private
   */
  private scrollToSelectedQuestion() {
    if (this.idSelectedQuestion !== null && this.paginator) {
      const index = this.dataSource.data.findIndex(q => q.id === this.idSelectedQuestion);
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
