import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {
  BehaviorSubject,
  concatMap,
  forkJoin,
  interval,
  of,
  startWith,
  Subject,
  Subscription,
  take,
  takeUntil,
  tap
} from "rxjs";
import {Test} from "../../../models/test.model";
import {TestAPIService} from "../../../services/API/testAPI.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../services/loading.service";
import {QuestionTestAPIService} from "../../../services/API/question-testAPI.service";
import {CandidateTestAPIService} from "../../../services/API/candidate-testAPI.service";
import {QuestionTest} from "../../../models/question-test.model";
import {CandidateTest} from "../../../models/candidate-test.model";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TopicEditComponent} from "../../topics/topic-edit/topic-edit.component";
import {TestEditComponent} from "../test-edit/test-edit.component";
import {DialogDeleteComponent} from "../../shared/dialog-delete/dialog-delete.component";

@Component({
  selector: 'app-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrl: './test-detail.component.scss',
})
export class TestDetailComponent implements OnInit, OnDestroy {
  test$!: BehaviorSubject<Test>;
  questionTestsSubject: BehaviorSubject<QuestionTest[]> = new BehaviorSubject<QuestionTest[]>([]);
  candidateTestsSubject: BehaviorSubject<CandidateTest[]> = new BehaviorSubject<CandidateTest[]>([]);
  private unsubscribe$ = new Subject<void>();
  isLoading!: boolean;
  // Starts directly, then every 10 seconds
  private refreshInterval$ = interval(10000).pipe(startWith(0));
  private refreshSubscription!: Subscription;

  constructor(private testAPIService: TestAPIService,
              private route: ActivatedRoute,
              private loadingService: LoadingService,
              private questionTestAPIService: QuestionTestAPIService,
              private candidateTestAPIService: CandidateTestAPIService,
              private changeDetectorRef: ChangeDetectorRef,
              private dialog: MatDialog,
              private router: Router) {
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
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onRefresh() {
    const testId = this.route.snapshot.paramMap.get('id');
    if (testId !== null) {
      // Recover test as observable
      this.testAPIService.getItem(+testId)
        .pipe(
          take(1), // Take only the first emitted value to avoid multiple subscriptions
          takeUntil(this.unsubscribe$),
          tap(test => {
            this.test$ = new BehaviorSubject<Test>(test);
          })
        )
        .subscribe();

      // Recover question-tests as observable
      this.questionTestAPIService.getAllQuestionTestByTestId(+testId)
        .pipe(
          takeUntil(this.unsubscribe$),
          tap(questionTests => {
            this.questionTestsSubject.next(questionTests);
          })
        )
        .subscribe();

      // Recover candidate-tests as BehaviorSubject
      this.candidateTestAPIService.getAllCandidateTestByTestId(+testId)
        .pipe(
          takeUntil(this.unsubscribe$),
          tap(candidateTests => {
            this.candidateTestsSubject.next(candidateTests);
          })
        )
        .subscribe();
    }
  }

  onEdit(testToEdit: Test) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = testToEdit;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    // If response isn't null, recover test and transform it in observable type.
    let dialogRef = this.dialog.open(TestEditComponent, dialogConfig);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if (response) {
          this.test$.next(response.updatedTest);
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
    this.questionTestsSubject.pipe(
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
  }

  /**
   * Check the value of test.archived, change it to the opposite and update DB
   * @param test
   */
  onChangeArchivedValue(test: Test) {
    this.testAPIService.changeItemArchivedValue(test)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(test => this.test$.next(test));
  }
}
