import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ResultAPIService} from "../../../services/API/resultAPI.service";
import {Observable, Subject, takeUntil} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Result} from "../../../models/result.model";
import {Question} from "../../../models/question.model";
import {CandidateTest} from "../../../models/candidate-test.model";
import {CountdownService} from "../../../services/countdown.service";
import {TestService} from "../../../services/test.service";
import {AuthAPIService} from "../../../services/API/authAPI.service";
import {NotificationService} from "../../../services/notification.service";

interface QuestionWithScoreAndResults {
  question: Question;
  results: Result[],
  score: number;
}

@Component({
  selector: 'app-results-candidate',
  templateUrl: './results-candidate.component.html',
  styleUrl: './results-candidate.component.scss',
  providers: [TestService]
})
export class ResultsCandidateComponent implements OnInit, OnDestroy {
  private resultAPIService = inject(ResultAPIService);
  private route = inject(ActivatedRoute);
  countdownService = inject(CountdownService);
  private testService = inject(TestService);
  private authAPIService = inject(AuthAPIService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  private unsubscribe$ = new Subject<void>();
  private results: Result[] = [];
  questions: QuestionWithScoreAndResults[] = [];
  candidateTest!: CandidateTest;
  testMaxDurationInSeconds = 0;
  testPointsSum = 0;


  ngOnInit() {
    const candidateTestId = this.route.snapshot.paramMap.get('id');
    if (candidateTestId && !isNaN(+candidateTestId)) {
      this.getResults(+candidateTestId);
    } else {
      // handle error
      console.log("error ds la route !")
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getResults(candidateTestId: number) {
    this.resultAPIService.getAllResultsByCandidateTestId(candidateTestId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        this.results = results;
        this.questions = this.sortResults(results);
        this.candidateTest = results[0].candidateTest;
        if (this.results.length > 0) {
          this.isCandidateAuthorized(this.results[0]);
        }
      });
  }

  private sortResults(results: Result[]) {
    const questionMap = new Map<number, QuestionWithScoreAndResults>();

    results.forEach(result => {
      const questionId = result.question.id;
      if (!questionMap.has(questionId)) {
        questionMap.set(questionId, {
          question: result.question,
          results: [],
          score: 0
        });
      }
      const questionWithScoreAndResults = questionMap.get(questionId)!;
      questionWithScoreAndResults.results.push(result);
      // questionWithScoreAndResults.score += result.score;
    });

    this.calculateData(Array.from(questionMap.values()));
    return Array.from(questionMap.values());
  }


  private isCandidateAuthorized(result: Result) {
    this.authAPIService.user
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        if (!user) {
          this.router.navigate(['/dashboard']);
          return;
        }

        // If the user is not a candidate, no need for further checks
        if (user.role !== 'candidate') return;


        // User is a candidate, perform checks
        if (!result.candidateTest.resultsShared) {
          this.notificationService.showWarning("Results aren't shared.")
          this.router.navigate(['/dashboard']);
          return;
        }
        if (result.candidateTest.candidate.id !== (+user.id)) {
          this.notificationService.showWarning("You aren't authorized to consult this page.");
          this.router.navigate(['/dashboard']);
          return;
        }
        // If all checks pass, candidate is authorized to consult results
      });
  }

  private calculateData(questions: QuestionWithScoreAndResults[]) {
    questions.forEach(q => {
      const maxQuestionScore = q.question.points * q.question.weight;
      const pointByAnswer = maxQuestionScore / q.results.length;
      q.results.forEach(result => {
        result.answerSelected === result.answer.right ? q.score += pointByAnswer : q.score -= pointByAnswer;
      });
      q.score = parseFloat(q.score.toFixed(2));
    });

    this.testMaxDurationInSeconds = this.testService.calculateCandidateTestMaxDurationInSecondsByQuestions(questions.map(q => q.question));
    this.testPointsSum = this.testService.calculateCandidateTestPointsSumByQuestions(questions.map(q => q.question));
  }

}
