import {Component, HostListener, inject, OnDestroy, OnInit} from '@angular/core';
import {AuthAPIService} from "../../../services/API/authAPI.service";
import {
  catchError,
  EMPTY,
  finalize,
  forkJoin,
  Observable,
  Subject,
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
import {TimeService} from "../../../services/time.service";
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
  private timeService = inject(TimeService);
  private testService = inject(TestService)

  private unsubscribe$ = new Subject<void>();
  questions: Question[] = [];
  answers: Answer[] = [];
  form!: FormGroup;
  protected candidateTest!: CandidateTest;
  private formSubmitted = false;
  timeRemaining: number = 0;
  private score!: number;

  ngOnInit() {
    // Create form
    this.form = this.formBuilder.group({});

    this.subscribeToUser();
  }

  ngOnDestroy() {
    this.timeService.stopCountdown();

    if (!this.formSubmitted) {
      this.updateCandidateTestOnEvent('fraudSuspicion');
    }
  }

  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    if (!this.formSubmitted) {
      this.updateCandidateTestOnEvent('fraudSuspicion');
    }
  }

  /**
   * Retrieve logged user, then retrieveCandidateTestId().
   * If no logged user, handleTestIssue().
   * @private
   */
  private subscribeToUser() {
    this.authAPIService.user
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        if (user) {
          this.retrieveCandidateTestId(+user.id);
        } else {
          this.handleTestIssue();
        }
      });
  }

  /**
   * Retrieve candidateTestId from route and check it's a number.
   * @param candidateId
   * @private
   */
  private retrieveCandidateTestId(candidateId: number) {
    const candidateTestId = this.route.snapshot.paramMap.get('id');
    if (candidateTestId && !isNaN(+candidateTestId)) {
      this.checkCandidateTestAndLoadQuestions(+candidateTestId, candidateId);
    } else {
      this.handleTestIssue();
    }
  }

  /**
   * First retrieve candidateTest from database and do some checks.
   * Then, execute loadQuestions() if checks are good.
   * @param idAssignedTest
   * @param candidateId
   */
  checkCandidateTestAndLoadQuestions(idAssignedTest: number, candidateId: number) {
    this.candidateTestAPIService.getItem(idAssignedTest)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(candidateTest => {
        this.candidateTest = candidateTest;
        if (this.candidateTestChecksService.areSecurityChecksGood(candidateTest, candidateId)) {
          this.loadQuestions(candidateTest.test.id);
        } else {
          this.handleTestIssue();
        }
      });
  }

  /**
   * Retrieve questions from this test and call loadAnswers().
   * @param testId
   */
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

  /**
   * First load the anwers for every linked questions.
   * Then, initialize a question's array.
   * Finally, execute FillFormAndStartTest().
   * @param questionTests
   */
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

      // When all answers loaded from API, intialize question's array and execute FillFormAndStarTest()
      this.questions = questionTests.map(qt => qt.question);
      this.FillFormAndStartTest();
    });
  }

  /**
   * Fill form and start the test.
   * @constructor
   * @private
   */
  private FillFormAndStartTest() {
      this.fillForm();
      this.startTest();
  }

  private handleTestIssue() {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Fill the form with every answer previously loaded.
   * @private
   */
  private fillForm() {
    this.answers.forEach(answer => {
      const control = new FormControl(false);
      this.form.addControl(answer.id.toString(), control);
    });
  }

  /**
   * Start the test by disabling logout button, starting coutdown and updating the test's test.
   * @private
   */
  private startTest() {
    this.authAPIService.isLogoutButtonClickable.next(false);

    this.startCountdown();
    this.updateCandidateTestOnEvent('started');
  }

  /**
   * Submit the form and create a result object for every answer.
   */
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

    // Wait for every result to be pushed to database before ending submitting form actions
    forkJoin(apiCalls).pipe(
      finalize(() => {
        this.score = this.calculateScore(results);
        this.updateCandidateTestOnEvent('ended');
        this.formSubmitted = true;
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  /**
   * Search for every answer linked to a given question.
   * @param question
   */
  getAnswersForQuestion(question: Question): Answer[] {
    return this.answers.filter(answer => answer.question.id === question.id);
  }

  /**
   * Start countdown and update this.timeRemaining.
   * When this.timeRemaining is ended, execute submitForm().
   */
  startCountdown() {
    const maxDurationInSeconds = this.testService.calculateCandidateTestMaxDurationInSecondsByQuestions(this.questions);

    this.timeService.startCountdown(
      maxDurationInSeconds,
      (timeRemainingInSeconds: number) => {
        this.timeRemaining = timeRemainingInSeconds;
      },
      () => {
        this.submitForm();
      }
    );
  }

  /**
   * Calculate the obtained score for this candidateTest.
   * @param results
   * @private
   */
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

  /**
   * Update candidateTest based on event.
   * @param event
   * @private
   */
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
