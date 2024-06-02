import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, forkJoin, map, Subject, switchMap, takeUntil} from "rxjs";
import {Test} from "../../../../models/test.model";
import {QuestionTest} from "../../../../models/question-test.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {QuestionTestManageComponent} from "./question-test-manage/question-test-manage.component";
import {QuestionAddComponent} from "../../../questions/question-add/question-add.component";
import {QuestionTestAPIService} from "../../../../services/API/question-testAPI.service";
import {TestAPIService} from "../../../../services/API/testAPI.service";
import {Router} from "@angular/router";
import {NotificationService} from "../../../../services/notification.service";

@Component({
  selector: 'app-test-details',
  templateUrl: './test-details.component.html',
  styleUrl: './test-details.component.scss'
})
export class TestDetailsComponent implements OnInit, OnDestroy {
  private dialog = inject(MatDialog);
  private questionTestAPIService = inject(QuestionTestAPIService);
  private testAPIService = inject(TestAPIService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  private unsubscribe$ = new Subject<void>();
  displayedColumns: string[] = ['label', 'points', 'weight', 'maxScore', 'timeLimit'];
  dataSource = new MatTableDataSource<QuestionTest>();
  @Input() questionTestsSubject: BehaviorSubject<QuestionTest[]> = new BehaviorSubject<QuestionTest[]>([]);
  @Input() testSubject = new BehaviorSubject<Test | null>(null);
  test!: Test;
  @Input() testAssignedAtLeastOnce!: boolean;
  @Input() testMaxDurationInSeconds!: number;
  @Input() testPointsSum!: number;

  ngOnInit() {
    // Retrieve all questionTests linked to populate table.
    this.questionTestsSubject
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(questionTests => {
        this.dataSource.data = questionTests;
      });

    // Retrieve test.
    this.testSubject
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(test => test ? this.test = test : null);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Manage (add or remove) linked questionTests for this test.
   */
  onManageQuestionTests() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.test;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'dialog-test-question-manage';

    // If response isn't null, recover new candidateTests and add them to the candidateTests observable.
    let dialogRef = this.dialog.open(QuestionTestManageComponent, dialogConfig);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if (response) {
          this.questionTestsSubject.next(response);
        }
      });
  }

  /**
   * Create a new question that will automatically be added to this test.
   * @param enterAnimationDuration
   * @param exitAnimationDuration
   */
  openAddQuestionDialog(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.test;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;

    let dialogRef = this.dialog.open(QuestionAddComponent, dialogConfig);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if (response) {
          let newQuestionTest: QuestionTest = new QuestionTest(0, response, this.test);
          this.questionTestAPIService.addItem(newQuestionTest)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(addedQT => {
              const currentQuestionTests: QuestionTest[] = this.questionTestsSubject.getValue();
              currentQuestionTests.push(addedQT);
              this.questionTestsSubject.next(currentQuestionTests);
            });
        }
      });
  }

  /**
   * Duplicate a test and all the linked questionTests.
   * Method used if hrManager want to update linked questionTests, but candidate already assigned to this test.
   */
  onDuplicateTest() {
    let testDuplicate: Test = new Test(0, new Date(), this.test.label + " - DUPLICATA", false);
    this.testAPIService.addItem(testDuplicate)
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(addedTest => {
          const questionTestObservables = this.dataSource.data.map(questionTest => {
            const questionTestDuplicate = new QuestionTest(0, questionTest.question, addedTest);
            return this.questionTestAPIService.addItem(questionTestDuplicate, false);
          });

          // ForkJoin to wait for all the questionTest to be sent
          return forkJoin(questionTestObservables).pipe(map(() => addedTest));
        })
      )
      .subscribe(
        addedTest => {
          this.router.navigate(['/tests', addedTest.id]);
        },
        error => {
          this.notificationService.showError("error_msg_add_item.test");
        }
      );
  }
}
