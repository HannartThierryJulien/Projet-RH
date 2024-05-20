import {Component, ElementRef, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, finalize, forkJoin, map, Subject, switchMap, take, takeUntil} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {CandidateTest} from "../../../models/candidate-test.model";
import {Chart, registerables} from "chart.js";
import {ActivatedRoute} from "@angular/router";
import {ResultAPIService} from "../../../services/API/resultAPI.service";
import {Result} from "../../../models/result.model";
import {QuestionTest} from "../../../models/question-test.model";
import {Question} from "../../../models/question.model";
import {AnswerAPIService} from "../../../services/API/answerAPI.service";
import {Answer} from "../../../models/answer.model";
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

  constructor() {
  }

  ngOnInit() {


    this.createChart().then(() => {
      this.loadChartData();
    });
  }

  private loadChartData() {
    combineLatest([this.testService.candidateTestsSubject, this.testService.questionTestsSubject])
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(([candidateTests, questionTests]) => {
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

  // For every candidateTest, calculate the points obtained for every question
  private calculatePoints() {
    const allResultsObservables = this.candidateTests.map(qt =>
      this.resultAPIService.getAllResultsByCandidate_testId(qt.id).pipe(
        map(results => ({qt, results}))
      )
    );

    return forkJoin(allResultsObservables)
      .pipe(
        switchMap(candidateResults => {
          const allAnswersObservables = this.questionTests.map(qt =>
            this.answerAPIService.getAnswersByQuestionId(qt.question.id).pipe(
              map(answers => ({qt, answers}))
            )
          );

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
                      if (result.answerSelected === answer.right) {
                        totalQuestionPoint += pointsPerAnswer;
                      } else {
                        totalQuestionPoint -= pointsPerAnswer;
                      }
                    });
                  });
                  totalQuestionPoint = Math.max(totalQuestionPoint, 0);
                  this.updateQuestionsChart(questionTest.question, totalQuestionPoint);
                });
              });

              // return this.questionsChart; // Return the updated questionsChart
              this.sortChartData();
            })
          );
        })
      );
  }

  private updateQuestionsChart(question: Question, points: number) {
    const existingQuestionChart = this.questionsChart.find(qc => qc.question.id === question.id);

    if (existingQuestionChart) {
      existingQuestionChart.points.push(points);
    } else {
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
        console.error('Canvas element with ID "chartTestsStatus" not found.');
        reject();
      }
    });
  }

  //
  // private loadChartData() {
  //   this.candidateTestsSubject
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe(candidateTests => {
  //       this.candidateTests = candidateTests;
  //       // this.sortChartData(this.candidateTests);
  //       // this.updateChart();
  //     });
  // }
  //

  private MAX_LABEL_LENGTH = 20; // Nombre maximum de caractères à afficher dans la légende

  private sortChartData() {
    let questions: string[] = [];
    let averageScore: number[] = [];

    this.questionsChart.forEach(questionChart => {
      const truncatedLabel = questionChart.question.label.length > this.MAX_LABEL_LENGTH
        ? questionChart.question.label.substring(0, this.MAX_LABEL_LENGTH) + '...'
        : questionChart.question.label;

      questions.push(truncatedLabel);

      const sum = questionChart.points.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      const calculatedAverageScore = sum / questionChart.points.length;
      averageScore.push(calculatedAverageScore);
    });
    this.updateChart(questions, averageScore);
  }


  private updateChart(questions: string[], averageScore: number[]) {
    if (this.chart && this.chart.data && this.chart.data.labels && this.chart.data.datasets) {
      this.chart.data.labels = questions;
      this.chart.data.datasets[0].data = averageScore;
      this.chart.update();
    } else {
      console.error("Chart not initialized.");
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




