import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {Topic} from "../../../models/topic.model";
import {Questionnaire} from "../../../models/questionnaire.model";
import {QuestionnaireAPIService} from "../../../services/API/questionnaireAPI.service";
import {TopicAPIService} from "../../../services/API/topicAPI.service";
import {AnswerAPIService} from "../../../services/API/answerAPI.service";
import {QuestionAPIService} from "../../../services/API/questionAPI.service";
import {Answer} from "../../../models/answer.model";
import {Question} from "../../../models/question.model";
import {MatDialogRef} from "@angular/material/dialog";
import {Subject, takeUntil} from "rxjs";
import {atLeastOneRightAnswerValidator} from "../../../validators/atLeastOneRightAnswer.validator";
import {minimumTimeLimitValidator} from "../../../validators/minimumTimeLimit.validator";
import {TimeService} from "../../../services/time.service";


@Component({
  selector: 'app-question-add',
  templateUrl: './question-add.component.html',
  styleUrl: './question-add.component.scss'
})
export class QuestionAddComponent implements OnInit, OnDestroy {
  private questionnaireAPIService = inject(QuestionnaireAPIService);
  private questionAPIService = inject(QuestionAPIService);
  private answerAPIService = inject(AnswerAPIService);
  private topicAPIService = inject(TopicAPIService);
  private formBuilder = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<QuestionAddComponent>);
  private timeService = inject(TimeService);

  questionnaires: Questionnaire[] = [];
  topics: Topic[] = [];
  questionForm!: FormGroup;
  answerForms!: FormArray;
  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    // questionForm initialization
    this.questionForm = this.formBuilder.group({
      label: ['', Validators.required],
      points: ['', [Validators.required, Validators.min(0.01)]],
      weight: ['', [Validators.required, Validators.min(0.01)]],
      maxDurationInSeconds: ['', [Validators.required, minimumTimeLimitValidator(30)]],
      topic: ['', Validators.required],
      questionnaire: ['', Validators.required],
      answers: this.formBuilder.array([])
    }, {validator: atLeastOneRightAnswerValidator});

    // answerForms initialization
    this.answerForms = this.questionForm.get('answers') as FormArray;

    // Populate answerForms with an answer
    this.addAnswer();

    // Populate the array of questionnaires
    this.questionnaireAPIService.getItems(false)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (questionnaires) => {
          this.questionnaires = questionnaires;
        }
      );

    // Populate the array of topics
    this.topicAPIService.getItems(false)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (topics) => {
          this.topics = topics;
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Close the MatDialog of the question-add component
   */
  onClose(addedQuestion?: Question) {
    this.dialogRef.close(addedQuestion);
  }


  /**
   * Return the forms of answers as a FormArray
   */
  get answers() {
    return this.questionForm.get('answers') as FormArray;
  }

  /**
   * Initialize a new form to add an answer. Then add it to the FormArray
   */
  addAnswer() {
    const answer = this.formBuilder.group({
      label: ['', Validators.required],
      right: [false],
      archived: [false],
    });

    this.answerForms.push(answer);
  }

  /**
   * Remove an answer form from the FormArray
   * @param index
   */
  removeAnswer(index: number) {
    this.answerForms.removeAt(index);
  }


  /**
   * Submit FormGroup
   */
  onSubmit() {
    // Check if the FormGroup is valid
    if (!this.questionForm.valid) {
      console.error('Form is invalid.');
      return;
    }

    // Recover selected topic/questionnaire and check if not null/undefined
    const selectedTopic = this.topics.find(topic => topic.id === this.questionForm.value.topic);
    const selectedQuestionnaire = this.questionnaires.find(questionnaire => questionnaire.id === this.questionForm.value.questionnaire);
    if (!selectedTopic || !selectedQuestionnaire) {
      console.error('Selected topic or questionnaire not found.');
      return;
    }

    // Recover new question and new answers
    const newQuestion: Question = {
      id: 0,
      label: this.questionForm.value.label,
      points: this.questionForm.value.points,
      weight: this.questionForm.value.weight,
      maxDurationInSeconds: this.timeService.convertTimeToSeconds('00:' + this.questionForm.value.maxDurationInSeconds), // recover the 'mm:ss' as string and add 'hh' before to get format 'hh:mm:ss'
      archived: false, // New questions are not archived by default
      topic: selectedTopic,
      questionnaire: selectedQuestionnaire
    };
    const newAnswers: Answer[] = this.questionForm.value.answers;

    // Add question to database
    this.questionAPIService.addItem(newQuestion)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(addedQuestion => {
        this.sendAnswersToAPI(newAnswers, addedQuestion);
        this.onClose(addedQuestion);
      });

  }

  /**
   * Link added question to every new answers first. Then add them to database
   * @param answers
   * @param addedQuestion
   */
  sendAnswersToAPI(answers: Answer[], addedQuestion: Question) {
    answers.forEach(answer => {
      answer.question = addedQuestion;
      this.answerAPIService.addItem(answer)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe();
    });
  }
}
