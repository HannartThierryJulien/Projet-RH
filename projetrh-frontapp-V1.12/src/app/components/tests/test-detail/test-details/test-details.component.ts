import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {Test} from "../../../../models/test.model";
import {QuestionTest} from "../../../../models/question-test.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {QuestionTestManageComponent} from "./question-test-manage/question-test-manage.component";
import {QuestionAddComponent} from "../../../questions/question-add/question-add.component";
import {QuestionTestAPIService} from "../../../../services/API/question-testAPI.service";
import {CountdownService} from "../../../../services/countdown.service";
import {TestAPIService} from "../../../../services/API/testAPI.service";

@Component({
  selector: 'app-test-details',
  templateUrl: './test-details.component.html',
  styleUrl: './test-details.component.scss'
})
export class TestDetailsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  displayedColumns: string[] = ['label', 'points', 'timeLimit'];
  dataSource = new MatTableDataSource<QuestionTest>();
  @Input() questionTestsSubject: BehaviorSubject<QuestionTest[]> = new BehaviorSubject<QuestionTest[]>([]);
  @Input() testSubject!: BehaviorSubject<Test>;
  test!: Test;
  @Input() testAssignedAtLeastOnce!: boolean;

  constructor(private dialog: MatDialog,
              private questionTestAPIService: QuestionTestAPIService,
              private countdownService: CountdownService,
              private testAPIService: TestAPIService) {
  }

  ngOnInit() {
    this.questionTestsSubject
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(questionTests => {
        this.dataSource.data = questionTests;
      });

    this.testSubject
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(test => this.test = test);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

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
          this.updateCandidateTest(response);
        }
      });
  }

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
              this.updateCandidateTest(currentQuestionTests);
              this.questionTestsSubject.next(currentQuestionTests);
            });
        }
      });
  }

  private updateCandidateTest(questionTests: QuestionTest[]) {
    let newPointsSum: number = 0;
    let newTimeLimit: string = '00:00:00';
    let times: string[] = [];

    questionTests.forEach(q => {
      newPointsSum += (q.question.points * q.question.weight);
      times.push(q.question.timeLimit);
    });
    newTimeLimit = this.countdownService.calculateTotalTimeLimit(times);

    this.test.timeLimit = newTimeLimit;
    this.test.pointsSum = newPointsSum;
    this.testAPIService.editItem(this.test, false)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(updatedTest => this.testSubject.next(updatedTest));
  }

  onDuplicateTest() {
    console.log("Still to do !")
  }
}
