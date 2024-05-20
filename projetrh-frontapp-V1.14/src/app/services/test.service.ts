import {Injectable, OnDestroy} from "@angular/core";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {Test} from "../models/test.model";
import {QuestionTest} from "../models/question-test.model";
import {CandidateTest} from "../models/candidate-test.model";
import {TestAPIService} from "./API/testAPI.service";
import {QuestionTestAPIService} from "./API/question-testAPI.service";
import {CandidateTestAPIService} from "./API/candidate-testAPI.service";
import {Question} from "../models/question.model";

/**
 * Service but not a singleton
 * https://dev.to/ussdlover/best-practice-for-subscribing-to-observables-in-services-with-angular-1712
 */
@Injectable()
export class TestService implements OnDestroy {
  test$ = new BehaviorSubject<Test | null>(null);
  questionTestsSubject = new BehaviorSubject<QuestionTest[]>([]);
  candidateTestsSubject = new BehaviorSubject<CandidateTest[]>([]);
  private unsubscribe$ = new Subject<void>();

  constructor(
    private testAPIService: TestAPIService,
    private questionTestAPIService: QuestionTestAPIService,
    private candidateTestAPIService: CandidateTestAPIService
  ) {
  }

  loadTestDetails(testId: number) {
    // Load test details
    this.testAPIService.getItem(testId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(test => {
        this.test$.next(test);
      });

    // Load question tests
    this.questionTestAPIService.getAllQuestionTestByTestId(testId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(questionTests => {
        this.questionTestsSubject.next(questionTests);
      });

    // Load candidate tests
    this.candidateTestAPIService.getAllCandidateTestByTestId(testId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(candidateTests => {
        this.candidateTestsSubject.next(candidateTests);
      });
  }

  calculateCandidateTestMaxDurationInSecondsByQuestions(questions: Question[]) {
    let maxDurationInSeconds = 0;
    questions.forEach(q => maxDurationInSeconds += q.maxDurationInSeconds);
    return maxDurationInSeconds
  }

  calculateCandidateTestPointsSumByQuestions(questions: Question[]) {
    let pointsSum = 0;
    questions.forEach(q => pointsSum += (q.points * q.weight));
    return pointsSum
  }

  calculateCandidateTestMaxDurationInSecondsByQuestionTests(questionTests: QuestionTest[]) {
    let maxDurationInSeconds = 0;
    questionTests.forEach(qt => maxDurationInSeconds += qt.question.maxDurationInSeconds);
    return maxDurationInSeconds
  }

  calculateCandidateTestPointsSumByQuestionTests(questionTests: QuestionTest[]) {
    let pointsSum = 0;
    questionTests.forEach(qt => pointsSum += (qt.question.points * qt.question.weight));
    return pointsSum
  }

  ngOnDestroy() {
    console.log("test-service.ts destroyed")

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
