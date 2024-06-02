import {Component, ElementRef, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, forkJoin, map, Subject, switchMap, takeUntil} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {CandidateTest} from "../../../models/candidate-test.model";
import {Chart, registerables} from "chart.js";
import {ResultAPIService} from "../../../services/API/resultAPI.service";
import {QuestionTest} from "../../../models/question-test.model";
import {Question} from "../../../models/question.model";
import {AnswerAPIService} from "../../../services/API/answerAPI.service";
import {TestService} from "../../../services/test.service";

export class QuestionChart {
  question: Question;
  points: number[] = [];

  constructor(question: Question, values: number[]) {
    this.question = question;
    this.points = values;
  }
}

@Component({
  selector: 'app-chart-average-questions-results',
  templateUrl: './chart-average-questions-results.component.html',
  styleUrl: './chart-average-questions-results.component.scss'
})
export class ChartAverageQuestionsResultsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private elementRef = inject(ElementRef);
  private translateService = inject(TranslateService);
  private resultAPIService = inject(ResultAPIService);
  private answerAPIService = inject(AnswerAPIService);
  private testService = inject(TestService);

  chart: any;
  @Input() questionTestsSubject!: BehaviorSubject<QuestionTest[]>;
  private questionsChart: QuestionChart[] = [];
  @Input() candidateTestsSubject!: BehaviorSubject<CandidateTest[]>;
  private candidateTests: CandidateTest[] = [];
  private questionTests: QuestionTest[] = [];
  private maxLabelLength = 20; // Maximum number of characters to display in the legend

  ngOnInit() {
    // First create chart, then load data if chart creation successful
    this.createChart().then(() => {
      this.loadChartData();
    });
  }

  private loadChartData() {
    // Combine latest values from candidateTestsSubject and questionTestsSubject
    combineLatest([this.testService.candidateTestsSubject, this.testService.questionTestsSubject])
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(([candidateTests, questionTests]) => {
          // Filter candidateTests and store the results
          this.candidateTests = this.filterCandidateTests(candidateTests);
          this.questionTests = questionTests;

          // Reset the questionsChart before calculating points
          this.questionsChart = [];
          return this.calculatePoints();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * For every candidateTest, calculate the points obtained for every question
   * @private
   */
  private calculatePoints() {
    // Map each candidate test to an observable that retrieves the results
    const allResultsObservables = this.candidateTests.map(qt =>
      this.resultAPIService.getAllResultsByCandidateTestId(qt.id).pipe(
        map(results => ({qt, results}))
      )
    );

    // Use forkJoin to wait for allResultsObservables to complete
    return forkJoin(allResultsObservables)
      .pipe(
        switchMap(candidateResults => {
          // Map each questionTest to an observable that retrieves the answers
          const allAnswersObservables = this.questionTests.map(qt =>
            this.answerAPIService.getAnswersByQuestionId(qt.question.id).pipe(
              map(answers => ({qt, answers}))
            )
          );

          // Wait for allAnswersObservables to complete
          return forkJoin(allAnswersObservables).pipe(
            map(questionAnswers => {
              candidateResults.forEach(({qt: candidateTest, results}) => {
                this.questionTests.forEach(questionTest => {
                  let totalQuestionPoint = 0;
                  const {answers} = questionAnswers.find(qa => qa.qt.question.id === questionTest.question.id) || {answers: []};
                  const maxPoints = questionTest.question.points * questionTest.question.weight;
                  const linkedAnswers = answers.filter(answer => answer.question.id === questionTest.question.id);
                  const pointsPerAnswer = linkedAnswers.length ? maxPoints / linkedAnswers.length : 0;

                  linkedAnswers.forEach(answer => {
                    const linkedResults = results.filter(result => result.answer.id === answer.id);
                    linkedResults.forEach(result => {
                      // Calculate points based on whether the answer was correct
                      if (result.answerSelected === answer.right) {
                        totalQuestionPoint += pointsPerAnswer;
                      } else {
                        totalQuestionPoint -= pointsPerAnswer;
                      }
                    });
                  });

                  // Ensure total points to not be negative
                  totalQuestionPoint = Math.max(totalQuestionPoint, 0);
                  this.updateQuestionsChart(questionTest.question, totalQuestionPoint);
                });
              });

              // Sort and update chart data
              this.sortChartData();
            })
          );
        })
      );
  }

  private updateQuestionsChart(question: Question, points: number) {
    // Find if question already exists in chart
    const existingQuestionChart = this.questionsChart.find(qc => qc.question.id === question.id);

    if (existingQuestionChart) {
      // Update points for existing question
      existingQuestionChart.points.push(points);
    } else {
      // Add new question to the chart
      const newQuestionChart = new QuestionChart(question, [points]);
      this.questionsChart.push(newQuestionChart);
    }
  }


  private async createChart() {
    return new Promise<void>((resolve, reject) => {
      Chart.register(...registerables);

      const canvas = this.elementRef.nativeElement.querySelector('#chartAverageQuestionsResults');
      if (canvas) {
        this.chart = new Chart(canvas, {
          type: 'line',
          data: {
            labels: [''],
            datasets: [{
              // label: 'Average score by question',
              data: [0],
              borderWidth: 1,
              pointStyle: 'circle',
              pointRadius: 7,
              pointHoverRadius: 12
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'x',
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                },
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  title: (context) => {
                    const index = context[0].dataIndex;
                    return this.questionsChart[index].question.label;
                  },
                  label: (context) => {
                    const index = context.dataIndex;
                    const value = Number(context.raw);
                    const formattedValue = !isNaN(value) ? value.toFixed(2) : context.raw;
                    const question = this.questionsChart[index].question;
                    const maxPoints = question.points * question.weight;
                    return this.translateService.instant('chart.averageQuestionsResults.tooltip') + formattedValue + ' (' + maxPoints + ' max)';
                  }
                }
              }
            }
          }
        });
        resolve();
      } else {
        reject();
      }
    });
  }


  private sortChartData() {
    let questions: string[] = [];
    let averageScore: number[] = [];

    this.questionsChart.forEach(questionChart => {
      // Truncate labels if they exceed the maximum length
      const truncatedLabel = questionChart.question.label.length > this.maxLabelLength
        ? questionChart.question.label.substring(0, this.maxLabelLength) + '...'
        : questionChart.question.label;

      questions.push(truncatedLabel);

      // Calculate the average score for each question
      const sum = questionChart.points.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      const calculatedAverageScore = sum / questionChart.points.length;
      averageScore.push(calculatedAverageScore);
    });

    // Update chart with new data
    this.updateChart(questions, averageScore);
  }


  /**
   * Update chart's data and update it
   * @param questions
   * @param averageScore
   * @private
   */
  private updateChart(questions: string[], averageScore: number[]) {
    if (this.chart && this.chart.data && this.chart.data.labels && this.chart.data.datasets) {
      this.chart.data.labels = questions;
      this.chart.data.datasets[0].data = averageScore;
      this.chart.update();
    }
  }


  /**
   * Filter candidateTests to keep only if status is "ended"
   * @param candidateTests
   * @private
   */
  private filterCandidateTests(candidateTests: CandidateTest[]) {
    let filteredCandidateTests: CandidateTest[] = [];

    candidateTests.forEach(ct => {
      ct.status == "ended" ? filteredCandidateTests.push(ct) : null;
    });

    return filteredCandidateTests;
  }
}




