import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Question} from "../../../models/question.model";
import {QuestionAPIService} from "../../../services/API/questionAPI.service";
import {Subject, switchMap, takeUntil} from "rxjs";
import {SelectedItemsService} from "../../../services/selectedItems.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.scss'
})
export class QuestionListComponent implements OnInit, OnDestroy, AfterViewInit {
  private unsubscribe$ = new Subject<void>();
  idSelectedQuestion!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['label'];
  dataSource: MatTableDataSource<Question> = new MatTableDataSource<Question>();
  @Input() isSearching!: boolean;
  searchInput: string = '';
  pageSize = 10;
  pageSizeOptions = [3, 5, 10];

  constructor(public questionAPIService: QuestionAPIService,
              private selectedItemsService: SelectedItemsService,
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

  private scrollToSelectedQuestion() {
    if (this.idSelectedQuestion !== null && this.paginator) {
      const index = this.dataSource.data.findIndex(q => q.id === this.idSelectedQuestion);
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
