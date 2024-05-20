import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Questionnaire} from "../../../models/questionnaire.model";
import {CandidateTest} from "../../../models/candidate-test.model";
import {CandidateAPIService} from "../../../services/API/candidateAPI.service";
import {CandidateTestAPIService} from "../../../services/API/candidate-testAPI.service";
import {BehaviorSubject, EMPTY, of, Subject, switchMap, takeUntil} from "rxjs";
import {Candidate} from "../../../models/candidate.model";
import {HrManager} from "../../../models/hrManager.model";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {QuestionEditComponent} from "../../questions/question-edit/question-edit.component";
import {TestTakeConfirmationComponent} from "./test-take-confirmation/test-take-confirmation.component";
import {CandidateEditComponent} from "./candidate-edit/candidate-edit.component";
import {CountdownService} from "../../../services/countdown.service";
import {TestService} from "../../../services/test.service";

@Component({
  selector: 'app-dashboard-candidate',
  templateUrl: './dashboard-candidate.component.html',
  styleUrl: './dashboard-candidate.component.scss'
})
export class DashboardCandidateComponent implements OnInit, OnDestroy {
  private candidateTestAPIService = inject(CandidateTestAPIService);
  private dialog = inject(MatDialog);
  countdownService = inject(CountdownService);

  private unsubscribe$ = new Subject<void>();
  @Input() candidateSubject: BehaviorSubject<Candidate | HrManager | null> = new BehaviorSubject<Candidate | HrManager | null>(null);
  candidate!: Candidate;
  testsToTake: CandidateTest[] = [];
  testsTaken: CandidateTest[] = [];
  testsToTakeTableColumns: string[] = ['label', 'assignationDate', 'actions'];
  testsToTakeTableSource: MatTableDataSource<CandidateTest> = new MatTableDataSource<CandidateTest>();
  testsTakenTableColumns: string[] = ['label', 'assignedAt', 'duration'];
  testsTakenTableSource: MatTableDataSource<CandidateTest> = new MatTableDataSource<CandidateTest>();

  ngOnInit() {
    this.candidateSubject.pipe(
      takeUntil(this.unsubscribe$),
      switchMap(user => {
        if (!user) {
          return EMPTY;
        }

        this.candidate = user as Candidate;
        return this.candidateTestAPIService.getAllCandidateTestByCandidateId(user.id);
      })
    ).subscribe(candidateTests => {
      // Clear arrays to avoid duplicate data in case of user refresh
      this.testsToTake = [];
      this.testsTaken = [];
      this.testsToTakeTableSource.data = this.testsToTake;
      this.testsTakenTableSource.data = this.testsTaken;

      candidateTests.forEach(test => {
        if (test.startedAt) {
          this.testsTaken.push(test);
        } else {
          this.testsToTake.push(test);
        }

        this.testsToTakeTableSource.data = this.testsToTake;
        this.testsTakenTableSource.data = this.testsTaken;
      });
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onDisplayConfirmation(candidateTest: CandidateTest) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = candidateTest;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;

    this.dialog.open(TestTakeConfirmationComponent, dialogConfig);
  }

  onEditDialog(candidateToEdit: Candidate) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = candidateToEdit;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    // If response isn't null, recover candidate and transform it in observable type.
    let dialogRef = this.dialog.open(CandidateEditComponent, dialogConfig);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if (response) {
          this.candidateSubject.next(response.updatedCandidate);
        }
      });
  }
}
