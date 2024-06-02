import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject, switchMap, takeUntil} from "rxjs";
import {QuestionnaireAPIService} from "../../../services/API/questionnaireAPI.service";
import {Questionnaire} from "../../../models/questionnaire.model";
import {SelectedItemsService} from "../../../services/selectedItems.service";
import {ActivatedRoute} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-questionnaire-list',
  templateUrl: './questionnaire-list.component.html',
  styleUrl: './questionnaire-list.component.scss'
})
export class QuestionnaireListComponent implements OnInit, OnDestroy, AfterViewInit {
  private unsubscribe$ = new Subject<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['label'];
  dataSource: MatTableDataSource<Questionnaire> = new MatTableDataSource<Questionnaire>();
  pageSize = 10;
  pageSizeOptions = [3, 5, 10];
  @Input() isSearching!: boolean;
  searchInput: string = '';
  idSelectedQuestionnaire!: number;

  constructor(public questionnaireAPIService: QuestionnaireAPIService,
              private selectedItemsService: SelectedItemsService,
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

    // Recover the appropriate list of questionnaires (unarchived/archived) based on @isArchivedListSelected from Questionnaires component
    this.selectedItemsService.isArchivedQuestionnairesListSelected.pipe(
      switchMap(isArchivedListSelected =>
        this.questionnaireAPIService.getItems(isArchivedListSelected).pipe(
          takeUntil(this.unsubscribe$)
        )
      )
    ).subscribe(questionnaires => {
      this.dataSource.data = questionnaires;
      this.scrollToSelectedQuestionnaire();
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
   * Inform Questionnaire-item component which questionnaire is selected by user
   * @param id
   */
  onSelectQuestionnaire(id: number) {
    this.selectedItemsService.idQuestionnaireSelected.next(id);
  }

  /**
   * Scroll to the selected questionnaire in the table
   * @private
   */
  private scrollToSelectedQuestionnaire() {
    if (this.idSelectedQuestionnaire !== null && this.paginator) {
      const index = this.dataSource.data.findIndex(q => q.id === this.idSelectedQuestionnaire);
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
