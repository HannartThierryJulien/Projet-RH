import {Component, HostListener, inject, OnDestroy, OnInit} from '@angular/core';
import {AuthAPIService} from "../../../services/API/authAPI.service";
import {catchError, EMPTY, forkJoin, interval, Subject, Subscription, switchMap, takeUntil} from "rxjs";
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

@Component({
  selector: 'app-test-take',
  templateUrl: './test-take.component.html',
  styleUrl: './test-take.component.scss'
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

  private unsubscribe$ = new Subject<void>();
  questions: Question[] = [];
  answers: Answer[] = [];
  form!: FormGroup;
  protected candidateTest!: CandidateTest;
  private formSubmitted = false;
  timeRemaining: string = '';

  ngOnInit() {
    this.form = this.formBuilder.group({});

    this.subscribeToUser();
  }

  ngOnDestroy() {
    console.log("ngOnDestroy !")
    this.countdownService.stopCountdown();

    this.submitForm();

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    console.log("visibilitychange !")
    this.submitForm();
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
      }
    });
    this.questions = questionTests.map(qt => qt.question);
  }

  private handleTestIssue() {
    this.router.navigate(['/dashboard']);
  }

  fillForm() {
    this.answers.forEach(answer => {
      const control = new FormControl(false);
      this.form.addControl(answer.id.toString(), control);
    });

    this.authAPIService.isLogoutButtonClickable.next(false);

    this.startCountdown();
  }

  submitForm() {
    if (this.formSubmitted) {
      return;
    }

    let results: Result[] = [];
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
        this.resultAPIService.addResult(result, false)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe();
      });
    });

    let totalPoints = this.calculObtainedPoints(results);
    this.updateCandidateTest(totalPoints);
    this.formSubmitted = true;
  }

  getAnswersForQuestion(question: Question): Answer[] {
    return this.answers.filter(answer => answer.question.id === question.id);
  }

  startCountdown() {
    this.countdownService.startCountdown(
      this.candidateTest.test.timeLimit,
      (timeRemaining: string) => {
        this.timeRemaining = timeRemaining;
      },
      () => {
        this.submitForm();
      }
    );
  }

  private calculObtainedPoints(results: Result[]): number {
    let totalPoints = 0;

    this.questions.forEach(question => {
      // Total points a candidate can have for this question
      const maxPoints = question.points * question.weight;
      // Array of answers linked to this question
      const linkedAnswers = this.answers.filter(answer => answer.question.id === question.id);
      // Amount of points per answer
      const pointsPerAnswer = maxPoints / linkedAnswers.length;

      linkedAnswers.forEach(answer => {
        const linkedResults = results.filter(result => result.answer.id === answer.id);
        linkedResults.forEach(result => {
          if (result.answerSelected == answer.right) {
            totalPoints += pointsPerAnswer;
          } else {
            totalPoints -= pointsPerAnswer;
          }
        });
      });
    });

    return totalPoints;
  }

  private updateCandidateTest(calculatedScore: number) {
    this.candidateTest.completionTime = this.countdownService.calculateElapsedTime();
    this.candidateTest.obtainedPoints = calculatedScore;
    this.candidateTest.completionDate = new Date();

    this.candidateTestAPIService.editItem(this.candidateTest)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(ct => {
        console.log("updated candidateTest : ", ct);
        this.authAPIService.isLogoutButtonClickable.next(true);
        this.router.navigate(['/dashboard']);
      });
  }

}
