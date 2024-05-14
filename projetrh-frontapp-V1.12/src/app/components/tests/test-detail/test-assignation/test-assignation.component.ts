import {AfterViewInit, Component, inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
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

@Component({
  selector: 'app-test-assignation',
  templateUrl: './test-assignation.component.html',
  styleUrl: './test-assignation.component.scss'
})
export class TestAssignationComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['lastname', 'firstname', 'assignationDate', 'completionDate', 'completionTime', 'obtainedPoints', 'actions'];
  dataSource = new MatTableDataSource<CandidateTest>();
  private unsubscribe$ = new Subject<void>();
  @Input() candidateTestsSubject: BehaviorSubject<CandidateTest[]> = new BehaviorSubject<CandidateTest[]>([]);
  @Input() test$!: Observable<Test>;
  test!: Test;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private notificationService = inject(NotificationService);


  constructor(private dialog: MatDialog,
              private candidateTestAPIService: CandidateTestAPIService) {
  }

  ngOnInit() {
    this.candidateTestsSubject
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(candidateTests => {
        this.dataSource.data = candidateTests;
        console.log(candidateTests)
      })

    this.test$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(test => this.test = test);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  onAssignToCandidates() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.test;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

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

  protected readonly location = location;

  onCopyLink() {
    this.notificationService.showInfo("Link copied !")
  }

}
