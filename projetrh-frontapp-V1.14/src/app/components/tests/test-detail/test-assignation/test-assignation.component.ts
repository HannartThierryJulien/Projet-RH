import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, concat, Observable, of, Subject, takeUntil} from "rxjs";
import {Test} from "../../../../models/test.model";
import {CandidateTest} from "../../../../models/candidate-test.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TestAssignComponent} from "./test-assign/test-assign.component";
import {DialogDeleteComponent} from "../../../shared/dialog-delete/dialog-delete.component";
import {CandidateTestAPIService} from "../../../../services/API/candidate-testAPI.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Router} from "@angular/router";
import {NotificationService} from "../../../../services/notification.service";
import {CountdownService} from "../../../../services/countdown.service";
import {TranslateService} from "@ngx-translate/core";
import {DatePipe, formatDate} from "@angular/common";

@Component({
  selector: 'app-test-assignation',
  templateUrl: './test-assignation.component.html',
  styleUrl: './test-assignation.component.scss'
})
export class TestAssignationComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['lastname', 'firstname', 'assignedAt', 'startedAt', 'endedAt', 'duration', 'score', 'status', 'actions'];
  dataSource = new MatTableDataSource<CandidateTest>();
  private unsubscribe$ = new Subject<void>();
  @Input() candidateTestsSubject: BehaviorSubject<CandidateTest[]> = new BehaviorSubject<CandidateTest[]>([]);
  @Input() testSubject= new BehaviorSubject<Test | null>(null);
  test!: Test;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageSize = 10;
  pageSizeOptions = [5, 10, 15];
  isSearching: boolean = false;
  searchInput: string = '';
  protected readonly location = location;
  @Input() testPointsSum!: number;

  constructor(private dialog: MatDialog,
              private candidateTestAPIService: CandidateTestAPIService,
              private notificationService: NotificationService,
              public countdownService: CountdownService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.candidateTestsSubject
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(candidateTests => {
        this.dataSource.data = candidateTests;
      })

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
    this.dataSource.filterPredicate = this.createFilter(); // To add custom filter.
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor(); // To add custom sorting.
  }


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

  onCopyLink() {
    this.notificationService.showInfo("Link copied !")
  }

  /**
   * Custom filter to be able to search by lastname and firstname even if it's not direct attribut of candidateTest.
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sortingDataAccessor(): (data: CandidateTest, sortHeaderId: string) => string | number {
    return (data: CandidateTest, sortHeaderId: string): string | number => {
      switch (sortHeaderId) {
        case 'firstname':
          return data.candidate.person.firstName;
        case 'lastname':
          return data.candidate.person.lastName;
        case 'assignedAt':
          return new Date(data.assignedAt).getTime();
        // case 'startedAt':
        //   return data.startedAt !== null ? this.datePipe.transform(data.startedAt, 'yyyy-dd-MM') || '': '';
        case 'endedAt':
          return data.endedAt !== null ? new Date(data.endedAt).getTime() : new Date(0).getTime();
        case 'duration':
          return this.countdownService.calculateDurationInSeconds(data.startedAt, data.endedAt);
        case 'score':
          return (data.score !== null ? (data.score / this.testPointsSum * 100) : 0);
        case 'status':
          return this.translateService.instant(data.status);
        default:
          return '';
      }
    };
  }

  onSearch() {
    this.isSearching = !this.isSearching;
  }

  formatDateString(date: Date | null): string {
    return date ? formatDate(date, 'dd/MM/yy HH:mm:ss', 'en-US') : '';
  }

  shareCandidateTestResults(candidateTest: CandidateTest) {
    candidateTest.resultsShared = !candidateTest.resultsShared;
    this.candidateTestAPIService.editItem(candidateTest, false)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

}
