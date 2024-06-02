import {AfterViewInit, Component, inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {Test} from "../../../../models/test.model";
import {CandidateTest} from "../../../../models/candidate-test.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TestAssignComponent} from "./test-assign/test-assign.component";
import {DialogDeleteComponent} from "../../../shared/dialog-delete/dialog-delete.component";
import {CandidateTestAPIService} from "../../../../services/API/candidate-testAPI.service";
import {MatSort, MatSortable} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {NotificationService} from "../../../../services/notification.service";
import {TimeService} from "../../../../services/time.service";
import {TranslateService} from "@ngx-translate/core";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-test-assignation',
  templateUrl: './test-assignation.component.html',
  styleUrl: './test-assignation.component.scss'
})
export class TestAssignationComponent implements OnInit, OnDestroy, AfterViewInit {
  private dialog = inject(MatDialog);
  private candidateTestAPIService = inject(CandidateTestAPIService);
  private notificationService = inject(NotificationService);
  public timeService = inject(TimeService);
  private translateService = inject(TranslateService);


  displayedColumns: string[] = ['lastname', 'firstname', 'assignedAt', 'startedAt', 'endedAt', 'duration', 'score', 'status', 'actions'];
  dataSource = new MatTableDataSource<CandidateTest>();
  private unsubscribe$ = new Subject<void>();
  @Input() candidateTestsSubject: BehaviorSubject<CandidateTest[]> = new BehaviorSubject<CandidateTest[]>([]);
  @Input() testSubject = new BehaviorSubject<Test | null>(null);
  test!: Test;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageSize = 10;
  pageSizeOptions = [5, 10, 15];
  isSearching: boolean = false;
  searchInput: string = '';
  protected readonly location = location;
  @Input() testPointsSum!: number;

  ngOnInit() {
    // Retrieve all the candidateTests
    this.candidateTestsSubject
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(candidateTests => {
        this.dataSource.data = candidateTests;
      })

    // Retrieve the test
    this.testSubject
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(test => test ? this.test = test : null);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Sort by default the table with most recent assignedAt dates
    this.sort.sort(({id: 'assignedAt', start: 'desc'}) as MatSortable);
    // Add custom filter
    this.dataSource.filterPredicate = this.createFilter();
    // Add custom sorting
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor();
  }

  /**
   * Display dialog to assign candidates to the test.
   */
  onAssignToCandidates() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.test;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.autoFocus = "dialog-small"

    // If response isn't null, recover new candidateTests and add them to the candidateTests observable.
    let dialogRef = this.dialog.open(TestAssignComponent, dialogConfig);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if (response) {
          const currentCandidateTests = this.candidateTestsSubject.getValue();
          const updatedCandidateTests = [...currentCandidateTests, ...response];
          this.candidateTestsSubject.next(updatedCandidateTests);
        }
      });
  }

  /**
   * First, configure MatDialog settings for DialogDelete component.
   * Second, open DialogDelete component.
   * Finally, listen for response and cancel/confirm deleting action.
   * @param candidateTestId
   * @param enterAnimationDuration
   * @param exitAnimationDuration
   */
  openDeleteDialog(candidateTestId: number, enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogConfig = new MatDialogConfig();
    let dataType = 'candidate-test';
    let dataNote = ''; // Handled with json files of ngx-translate
    dialogConfig.data = {dataType, dataNote};
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    // Check if returned value by DialogDelete component is true. If it is the case, execute @deleteQuestion()
    const dialogRef = this.dialog.open(DialogDeleteComponent, dialogConfig);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        data => data ? this.deleteCandidateTest(candidateTestId) : null
      );
  }

  /**
   * Delete candidateTest from database and redirect user to "/questions"
   */
  private deleteCandidateTest(candidateTestId: number) {
    this.candidateTestAPIService.deleteItem(candidateTestId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        const currentCandidateTests: any[] = this.candidateTestsSubject.getValue();
        const updatedCandidateTests = currentCandidateTests.filter(candidateTest => candidateTest.id !== candidateTestId);
        this.candidateTestsSubject.next(updatedCandidateTests);
      });
  }

  /**
   * Copy the link to take a test and inform that it has be copied.
   */
  onCopyLink() {
    this.notificationService.showInfo("Link copied !")
  }

  /**
   * Custom filter to be able to search by any attribute even if it's not direct attribute of candidateTest.
   */
  createFilter(): (data: CandidateTest, filter: string) => boolean {
    return (data: CandidateTest, filter: string): boolean => {
      const searchTerm = filter.trim().toLowerCase();

      const firstName = data.candidate.person.firstName.toLowerCase();
      const lastName = data.candidate.person.lastName.toLowerCase();
      const status = this.translateService.instant(data.status).toLowerCase();
      const assignedAt = this.formatDateString(new Date(data.assignedAt)).toLowerCase();
      const startedAt = this.formatDateString(data.startedAt ? new Date(data.startedAt) : null).toLowerCase();
      const endedAt = this.formatDateString(data.endedAt ? new Date(data.endedAt) : null).toLowerCase();
      const score = ((data.score ?? 0) / this.testPointsSum * 100).toFixed(2).toLowerCase() + '%';

      return firstName.includes(searchTerm) ||
        lastName.includes(searchTerm) ||
        assignedAt.includes(searchTerm) ||
        startedAt.includes(searchTerm) ||
        endedAt.includes(searchTerm) ||
        score.includes(searchTerm) ||
        status.includes(searchTerm);
    };
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

  /**
   * Custom sorting.
   */
  sortingDataAccessor(): (data: CandidateTest, sortHeaderId: string) => string | number {
    return (data: CandidateTest, sortHeaderId: string): string | number => {
      switch (sortHeaderId) {
        case 'firstname':
          return data.candidate.person.firstName;
        case 'lastname':
          return data.candidate.person.lastName;
        case 'assignedAt':
          return new Date(data.assignedAt).getTime();
        case 'startedAt':
          return data.startedAt !== null ? new Date(data.startedAt).getTime() : new Date(0).getTime();
        case 'endedAt':
          return data.endedAt !== null ? new Date(data.endedAt).getTime() : new Date(0).getTime();
        case 'duration':
          return this.timeService.calculateDurationInSeconds(data.startedAt, data.endedAt);
        case 'score':
          return (data.score !== null ? (data.score / this.testPointsSum * 100) : 0);
        case 'status':
          return this.translateService.instant(data.status);
        default:
          return '';
      }
    };
  }

  /**
   * Change de value of @isSearching.
   * If value true, it will display a search bar
   */
  onSearch() {
    this.isSearching = !this.isSearching;
  }

  /**
   * Format date.
   * @param date
   */
  formatDateString(date: Date | null): string {
    return date ? formatDate(date, 'dd/MM/yy HH:mm:ss', 'en-US') : '';
  }

  /**
   * Change the candidateTest's attribute "resultsShared" to make results visible for the candidate.
   * @param candidateTest
   */
  shareCandidateTestResults(candidateTest: CandidateTest) {
    candidateTest.resultsShared = !candidateTest.resultsShared;
    this.candidateTestAPIService.editItem(candidateTest, false)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

}
