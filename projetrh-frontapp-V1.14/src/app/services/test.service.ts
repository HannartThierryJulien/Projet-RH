import {inject, Injectable, OnDestroy} from "@angular/core";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {Test} from "../models/test.model";
import {QuestionTest} from "../models/question-test.model";
import {CandidateTest} from "../models/candidate-test.model";
import {TestAPIService} from "./API/testAPI.service";
import {QuestionTestAPIService} from "./API/question-testAPI.service";
import {CandidateTestAPIService} from "./API/candidate-testAPI.service";
import {Question} from "../models/question.model";

/**
 * Service used to load a test, his questionTests and his candidateTests at once and used to refresh easily these data.
 * It's also used to calculate some information like the maxDuration or the pointsSum of a given test.
 *
 * ⚠️⚠️ Particular attention to the fact that this service is not a singleton, it can therefore be instantiated several times. ⚠️⚠️
 * Cf. https://dev.to/ussdlover/best-practice-for-subscribing-to-observables-in-services-with-angular-1712
 */
@Injectable()
export class TestService implements OnDestroy {
  private testAPIService = inject(TestAPIService);
  private questionTestAPIService = inject(QuestionTestAPIService);
  private candidateTestAPIService = inject(CandidateTestAPIService);

  test$ = new BehaviorSubject<Test | null>(null);
  questionTestsSubject = new BehaviorSubject<QuestionTest[]>([]);
  candidateTestsSubject = new BehaviorSubject<CandidateTest[]>([]);
  private unsubscribe$ = new Subject<void>();

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

  /**
   * Calculate the max duration a candidate can get to take a specific test, based on the provided parameter.
   * @param questions
   */
  calculateCandidateTestMaxDurationInSecondsByQuestions(questions: Question[]) {
    let maxDurationInSeconds = 0;
    questions.forEach(q => maxDurationInSeconds += q.maxDurationInSeconds);
    return maxDurationInSeconds
  }

  /**
   * Calculate the max duration a candidate can get to take a specific test, based on the provided parameter.
   * @param questionTests
   */
  calculateCandidateTestMaxDurationInSecondsByQuestionTests(questionTests: QuestionTest[]) {
    let maxDurationInSeconds = 0;
    questionTests.forEach(qt => maxDurationInSeconds += qt.question.maxDurationInSeconds);
    return maxDurationInSeconds
  }

  /**
   * Calculate the biggest score a candidate can get to take a specific test, based on the provided parameter.
   * @param questions
   */
  calculateCandidateTestPointsSumByQuestions(questions: Question[]) {
    let pointsSum = 0;
    questions.forEach(q => pointsSum += (q.points * q.weight));
    return pointsSum
  }

  /**
   * Calculate the biggest score a candidate can get to take a specific test, based on the provided parameter.
   * @param questionTests
   */
  calculateCandidateTestPointsSumByQuestionTests(questionTests: QuestionTest[]) {
    let pointsSum = 0;
    questionTests.forEach(qt => pointsSum += (qt.question.points * qt.question.weight));
    return pointsSum
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
