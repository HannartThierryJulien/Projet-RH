import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ResultAPIService} from "../../../services/API/resultAPI.service";
import {Observable, Subject, takeUntil} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Result} from "../../../models/result.model";
import {Question} from "../../../models/question.model";
import {CandidateTest} from "../../../models/candidate-test.model";
import {CountdownService} from "../../../services/countdown.service";
import {TestService} from "../../../services/test.service";


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

  private unsubscribe$ = new Subject<void>();
  results: Result[] = [];
  questions: Question[] = [];
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
    this.resultAPIService.getAllResultsByCandidate_testId(candidateTestId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        this.results = results;
        this.questions = this.isolateQuestions(results);
        this.candidateTest = results[0].candidateTest;
        this.testMaxDurationInSeconds = this.testService.calculateCandidateTestMaxDurationInSecondsByQuestions(this.questions);
        this.testPointsSum = this.testService.calculateCandidateTestPointsSumByQuestions(this.questions);
      });
  }

  private isolateQuestions(results: Result[]) {
    const questionIDsSet = new Set<number>();
    const questions: Question[] = [];

    results.forEach(result => {
      if (!questionIDsSet.has(result.question.id)) {
        questions.push(result.question);
        questionIDsSet.add(result.question.id);
      }
    });

    return questions;
  }

}
