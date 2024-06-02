import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CandidateTest} from "../../../../models/candidate-test.model";
import {TestService} from "../../../../services/test.service";
import {Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {QuestionTestAPIService} from "../../../../services/API/question-testAPI.service";
import {TimeService} from "../../../../services/time.service";

@Component({
  selector: 'app-test-take-confirmation',
  templateUrl: './test-take-confirmation.component.html',
  styleUrl: './test-take-confirmation.component.scss',
  providers: [TestService]
})
export class TestTakeConfirmationComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  testMaxDurationInSeconds = 0;

  constructor(public dialogRef: MatDialogRef<TestTakeConfirmationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CandidateTest,
              private testService: TestService,
              private questionTestAPIService: QuestionTestAPIService) {
  }

  ngOnInit(): void {
    // Recover all the questions linked to this test, then calculate the max duration that the candidate can take to complete it
    this.questionTestAPIService.getAllQuestionTestByTestId(this.data.test.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(questionTests => {
        this.testMaxDurationInSeconds = this.testService.calculateCandidateTestMaxDurationInSecondsByQuestionTests(questionTests);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onClose() {
    this.dialogRef.close();
  }

}
