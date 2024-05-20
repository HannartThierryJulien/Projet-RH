import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {
  concatMap,
  forkJoin,
  interval,
  startWith,
  Subject,
  Subscription,
  takeUntil,
} from "rxjs";
import {Test} from "../../../models/test.model";
import {TestAPIService} from "../../../services/API/testAPI.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../services/loading.service";
import {QuestionTestAPIService} from "../../../services/API/question-testAPI.service";
import {CandidateTestAPIService} from "../../../services/API/candidate-testAPI.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TestEditComponent} from "../test-edit/test-edit.component";
import {DialogDeleteComponent} from "../../shared/dialog-delete/dialog-delete.component";
import {TestService} from "../../../services/test.service";

@Component({
  selector: 'app-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrl: './test-detail.component.scss',
  providers: [TestService]
})
export class TestDetailComponent implements OnInit, OnDestroy {
  test$ = this.testService.test$;
  questionTestsSubject = this.testService.questionTestsSubject;
  candidateTestsSubject = this.testService.candidateTestsSubject;
  private unsubscribe$ = new Subject<void>();
  isLoading!: boolean;
  // Starts directly, then every 10 seconds
  private refreshInterval$ = interval(10000).pipe(startWith(0));
  private refreshSubscription!: Subscription;
  testMaxDurationInSeconds = 0;
  testPointsSum = 0;

  constructor(private testAPIService: TestAPIService,
              private route: ActivatedRoute,
              private loadingService: LoadingService,
              private questionTestAPIService: QuestionTestAPIService,
              private changeDetectorRef: ChangeDetectorRef,
              private dialog: MatDialog,
              private router: Router,
              private testService: TestService) {
  }

  ngOnInit() {
    // Allow to know if there is at least one element loading
    this.loadingService.loading$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(loadingMap => {
        this.isLoading = Array.from(loadingMap.values()).some(value => value);
        this.changeDetectorRef.detectChanges(); // Force change detection
      });

    this.refreshSubscription = this.refreshInterval$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.onRefresh();
      });

    const testId = this.route.snapshot.paramMap.get('id');
    if (testId) {
      this.testService.loadTestDetails(+testId);
    }

    this.questionTestsSubject
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(questionTests => {
        this.testMaxDurationInSeconds = this.testService.calculateCandidateTestMaxDurationInSecondsByQuestionTests(questionTests);
        this.testPointsSum = this.testService.calculateCandidateTestPointsSumByQuestionTests(questionTests);
      })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onRefresh() {
    const testId = this.route.snapshot.paramMap.get('id');
    if (testId !== null) {
      this.testService.loadTestDetails(+testId);
    }
  }

  onEdit(testToEdit: Test) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = testToEdit;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = "dialog-small";

    // If response isn't null, recover test and transform it in observable type.
    let dialogRef = this.dialog.open(TestEditComponent, dialogConfig);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if (response) {
          this.testService.test$.next(response.updatedTest);
        }
      });
  }

  /**
   * First, configure MatDialog settings for DialogDelete component.
   * Second, open DialogDelete component.
   * Finally, listen for response and cancel/confirm deleting action.
   */
  openDeleteDialog(testId: number) {
    const dialogConfig = new MatDialogConfig();
    let dataType = 'test';
    let dataNote = ''; // Handled with json files of ngx-translate
    dialogConfig.data = {dataType, dataNote};
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    // Check if returned value by DialogDelete component is true. If it is the case, execute @deleteTest()
    const dialogRef = this.dialog.open(DialogDeleteComponent, dialogConfig);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        data => data ? this.deleteTest(testId) : null
      );
  }

  deleteTest(testId: number) {
    const questionTests = this.questionTestsSubject.getValue();

    // If test has questions linked, delete questions, then delete test
    if (questionTests.length > 0) {
      this.testService.questionTestsSubject.pipe(
        takeUntil(this.unsubscribe$),
        concatMap(questionTests => {
          const deleteObservables = questionTests.map(questionTest =>
            this.questionTestAPIService.deleteItem(questionTest.id, false)
          );
          return forkJoin(deleteObservables);
        })
      ).subscribe(() => {
        this.testAPIService.deleteItem(testId)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(() => this.router.navigate(['/tests']));
      });
      // If test hasn't question linked, delete it
    } else {
      this.testAPIService.deleteItem(testId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => this.router.navigate(['/tests']));
    }
  }

  /**
   * Check the value of test.archived, change it to the opposite and update DB
   * @param test
   */
  onChangeArchivedValue(test: Test) {
    this.testAPIService.changeItemArchivedValue(test)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(test => this.testService.test$.next(test));
  }

}
