import {Component, HostListener, inject, OnDestroy, OnInit} from '@angular/core';
import {AuthAPIService} from "../../../services/API/authAPI.service";
import {
  catchError,
  EMPTY,
  finalize,
  forkJoin,
  interval,
  Observable,
  Subject,
  Subscription,
  switchMap,
  takeUntil
} from "rxjs";
import {QuestionTestAPIService} from "../../../services/API/question-testAPI.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CandidateTestAPIService} from "../../../services/API/candidate-testAPI.service";
import {AnswerAPIService} from "../../../services/API/answerAPI.service";
import {Question} from "../../../models/question.model";
import {Answer} from "../../../models/answer.model";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Result} from "../../../models/result.model";
import {ResultAPIService} from "../../../services/API/resultAPI.service";
import {CandidateTest} from "../../../models/candidate-test.model";
import {CandidateTestChecksService} from "../../../services/candidateTestChecks.service";
import {QuestionTest} from "../../../models/question-test.model";
import {CountdownService} from "../../../services/countdown.service";
import {TestService} from "../../../services/test.service";

@Component({
  selector: 'app-test-take',
  templateUrl: './test-take.component.html',
  styleUrl: './test-take.component.scss',
  providers: [TestService]
})
export class TestTakeComponent implements OnInit, OnDestroy {
  private authAPIService = inject(AuthAPIService);
  private questionTestAPIService = inject(QuestionTestAPIService);
  private route = inject(ActivatedRoute);
  private candidateTestAPIService = inject(CandidateTestAPIService);
  private router = inject(Router);
  private answerAPIService = inject(AnswerAPIService);
  private formBuilder = inject(FormBuilder);
  private resultAPIService = inject(ResultAPIService);
  private candidateTestChecksService = inject(CandidateTestChecksService);
  private countdownService = inject(CountdownService);
  private testService = inject(TestService)

  private unsubscribe$ = new Subject<void>();
  questions: Question[] = [];
  answers: Answer[] = [];
  form!: FormGroup;
  protected candidateTest!: CandidateTest;
  private formSubmitted = false;
  timeRemaining: number = 0;
  private score!: number;

  private editingCandidateTest$ = new Subject<void>();


  ngOnInit() {
    this.form = this.formBuilder.group({});

    this.subscribeToUser();
  }

  ngOnDestroy() {
    this.countdownService.stopCountdown();

    if (!this.formSubmitted) {
      this.updateCandidateTestOnEvent('fraudSuspicion');
    }

    // this.editingCandidateTest$.subscribe(() => {
    //   this.unsubscribe$.next();
    //   this.unsubscribe$.complete();
    // });
  }

  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    if (!this.formSubmitted) {
      this.updateCandidateTestOnEvent('fraudSuspicion');
    }
  }

  private subscribeToUser() {
    this.authAPIService.user
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        if (user) {
          this.checkAndLoadTest(+user.id);
        } else {
          this.handleTestIssue();
        }
      });
  }

  private checkAndLoadTest(candidateId: number) {
    const idAssignedTest = this.route.snapshot.paramMap.get('id');
    if (idAssignedTest && !isNaN(+idAssignedTest)) {
      this.loadTest(+idAssignedTest, candidateId);
    } else {
      this.handleTestIssue();
    }
  }

  loadTest(idAssignedTest: number, candidateId: number) {
    this.candidateTestAPIService.getItem(idAssignedTest)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(candidateTest => {
        console.log("this.candidateTest : ", this.candidateTest)
        this.candidateTest = candidateTest;
        if (this.candidateTestChecksService.areSecurityChecksGood(candidateTest, candidateId)) {
          this.loadQuestions(candidateTest.test.id);
        } else {
          this.handleTestIssue();
        }
      });
  }

  loadQuestions(testId: number) {
    this.questionTestAPIService.getAllQuestionTestByTestId(testId)
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError(error => {
          this.handleTestIssue();
          return EMPTY;
        })
      )
      .subscribe(questionTests => {
        if (questionTests.length === 0) {
          this.handleTestIssue();
          return;
        }
        this.loadAnswers(questionTests);
      });
  }

  loadAnswers(questionTests: QuestionTest[]) {
    forkJoin(questionTests.map(qt =>
      this.answerAPIService.getAnswersByQuestionId(qt.question.id)
        .pipe(
          catchError(error => {
            this.handleTestIssue();
            return EMPTY;
          })
        )
    )).subscribe(answerss => {
      answerss.forEach(answerList => {
        this.answers.push(...answerList);
      });

      // Check if all data are loaded
      const allDataLoaded = this.questions.length === questionTests.length;
      if (allDataLoaded) {
        this.fillForm();
        this.startTest();
      }
    });
    this.questions = questionTests.map(qt => qt.question);
  }

  private handleTestIssue() {
    this.router.navigate(['/dashboard']);
  }

  private fillForm() {
    this.answers.forEach(answer => {
      const control = new FormControl(false);
      this.form.addControl(answer.id.toString(), control);
    });
  }

  private startTest() {
    this.authAPIService.isLogoutButtonClickable.next(false);

    this.startCountdown();
    this.updateCandidateTestOnEvent('started');
  }

  submitForm() {
    if (this.formSubmitted) {
      return;
    }

    let results: Result[] = [];
    let apiCalls: Observable<any>[] = [];

    this.questions.forEach(question => {
      const answersForQuestion = this.getAnswersForQuestion(question);
      answersForQuestion.forEach(answer => {
        const control = this.form.get(answer.id.toString());
        let isSelected: boolean;
        if (control && control.value) {
          isSelected = true;
        } else {
          isSelected = false;
        }
        let result = new Result(0, isSelected, answer, this.candidateTest, answer.question);
        results.push(result);
        apiCalls.push(this.resultAPIService.addResult(result, false));
      });
    });

    forkJoin(apiCalls).pipe(
      finalize(() => {
        this.score = this.calculateScore(results);
        this.updateCandidateTestOnEvent('ended');
        this.formSubmitted = true;
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  getAnswersForQuestion(question: Question): Answer[] {
    return this.answers.filter(answer => answer.question.id === question.id);
  }

  startCountdown() {
    const maxDurationInSeconds = this.testService.calculateCandidateTestMaxDurationInSecondsByQuestions(this.questions);

    this.countdownService.startCountdown(
      maxDurationInSeconds,
      (timeRemainingInSeconds: number) => {
        this.timeRemaining = timeRemainingInSeconds;
      },
      () => {
        this.submitForm();
      }
    );
  }

  private calculateScore(results: Result[]): number {
    let totalPoints = 0;

    this.questions.forEach(question => {
      // Total points a candidate can have for this question
      const maxPoints = question.points * question.weight;
      // Array of answers linked to this question
      const linkedAnswers = this.answers.filter(answer => answer.question.id === question.id);
      // Amount of points per answer
      const pointsPerAnswer = maxPoints / linkedAnswers.length;
      let questionScore = 0;

      linkedAnswers.forEach(answer => {
        const linkedResults = results.filter(result => result.answer.id === answer.id);
        linkedResults.forEach(result => {
          if (result.answerSelected == answer.right) {
            questionScore += pointsPerAnswer;
          } else {
            questionScore -= pointsPerAnswer;
          }

        });
      });

      questionScore < 0 ? questionScore = 0 : null;
      totalPoints += questionScore;
    });

    return totalPoints;
  }

  private updateCandidateTestOnEvent(event: string) {
    let showNotification: boolean = false;
    let redirect: boolean = false;
    let startUnsubscribing = false;

    switch (event) {
      case "started": {
        this.candidateTest.status = "started";
        this.candidateTest.startedAt = new Date();
        break;
      }
      case "ended": {
        this.candidateTest.score = this.score;
        this.candidateTest.status = "ended";
        this.candidateTest.endedAt = new Date();
        showNotification = true;
        redirect = true;
        startUnsubscribing = true;
        this.authAPIService.isLogoutButtonClickable.next(true);
        break;
      }
      case "fraudSuspicion": {
        this.candidateTest.status = "fraudSuspicion";
        this.candidateTest.endedAt = new Date();
        redirect = true;
        startUnsubscribing = true;
        this.authAPIService.isLogoutButtonClickable.next(true);
        break;
      }
      default: {
        break;
      }
    }

    this.candidateTestAPIService.editItem(this.candidateTest, showNotification)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => {
          redirect ? this.router.navigate(['/dashboard']) : null;
          // this.editingCandidateTest$.next();
          if (startUnsubscribing) {
            this.unsubscribe$.next();
            this.unsubscribe$.complete();
          }
        })
      )
      .subscribe();
  }

}
