import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Question} from "../../../models/question.model";
import {Questionnaire} from "../../../models/questionnaire.model";
import {Topic} from "../../../models/topic.model";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {QuestionnaireAPIService} from "../../../services/API/questionnaireAPI.service";
import {QuestionAPIService} from "../../../services/API/questionAPI.service";
import {AnswerAPIService} from "../../../services/API/answerAPI.service";
import {TopicAPIService} from "../../../services/API/topicAPI.service";
import {Answer} from "../../../models/answer.model";
import {Subject, takeUntil} from "rxjs";
import {atLeastOneRightAnswerValidator} from "../../../validators/atLeastOneRightAnswer.validator";
import {minimumTimeLimitValidator} from "../../../validators/minimumTimeLimit.validator";

@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrl: './question-edit.component.scss'
})
export class QuestionEditComponent implements OnInit, OnDestroy {
  questionnaires: Questionnaire[] = [];
  topics: Topic[] = [];
  questionForm!: FormGroup;
  answerForms!: FormArray;
  questionToEdit!: Question;
  linkedAnswers: Answer[] | undefined;
  defaultTopic: Topic | undefined;
  defaultQuestionnaire: Questionnaire | undefined;
  idAnswersToDelete: number[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(private questionnaireAPIService: QuestionnaireAPIService,
              private questionAPIService: QuestionAPIService,
              private answerAPIService: AnswerAPIService,
              private topicAPIService: TopicAPIService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<QuestionEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    // Recover data (question and answer) to edit
    this.questionToEdit = this.data.questionToEdit;
    this.linkedAnswers = this.data.linkedAnswers;

    if (this.questionToEdit && this.linkedAnswers) {
      // questionForm initialization
      this.questionForm = this.formBuilder.group({
        id: [this.questionToEdit.id],
        label: [this.questionToEdit.label, Validators.required],
        points: [this.questionToEdit.points, [Validators.required, Validators.min(0.01)]],
        weight: [this.questionToEdit.weight, [Validators.required, Validators.min(0.01)]],
        timeLimit: [this.questionToEdit.timeLimit.substring(3), [Validators.required, minimumTimeLimitValidator(30)]],
        archived: [this.questionToEdit.archived],
        topic: [this.questionToEdit.topic.id, Validators.required],
        questionnaire: [this.questionToEdit.questionnaire.id, Validators.required],
        answers: this.formBuilder.array(this.linkedAnswers.map(answer => this.formBuilder.group({
          id: [answer.id],
          label: [answer.label, Validators.required],
          right: [answer.right],
          archived: [answer.archived],
        })))
      }, {validator: atLeastOneRightAnswerValidator});
      this.defaultTopic = this.questionToEdit.topic;
      this.defaultQuestionnaire = this.questionToEdit.questionnaire;
    }

    // Populate answerForms with an answer
    this.answerForms = this.questionForm.get('answers') as FormArray;

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
   * Close the MatDialog of the question-edit component and possibly return updated question/answers
   */
  onClose(updatedData?: { updatedQuestion: Question; updatedAnswers: Answer[] }): void {
    this.dialogRef.close(updatedData);
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
    const answerControl = this.answerForms.at(index).get('id');
    if (answerControl) {
      const deletedAnswerId = answerControl.value;
      this.idAnswersToDelete.push(deletedAnswerId);
    }

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

    // Recover updated question and updated answers
    const updatedQuestion: Question = {
      id: this.questionForm.value.id,
      label: this.questionForm.value.label,
      points: this.questionForm.value.points,
      weight: this.questionForm.value.weight,
      timeLimit: '00:' + this.questionForm.value.timeLimit,
      archived: this.questionToEdit.archived,
      topic: selectedTopic,
      questionnaire: selectedQuestionnaire
    };
    const updatedAnswers: Answer[] = this.questionForm.value.answers;

    // Update question in database
    this.questionAPIService.editItem(updatedQuestion)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: updatedQuestion => {
          this.sendAnswersToAPI(updatedAnswers, updatedQuestion);
          this.sendAnswersToDeleteToAPI(this.idAnswersToDelete);
          this.onClose({updatedQuestion, updatedAnswers: updatedAnswers});
        }
      });

  }

  /**
   * Link added question to every new answers first. Then add them to database
   * @param answers
   * @param updatedQuestion
   */
  sendAnswersToAPI(answers: Answer[], updatedQuestion: Question) {
    answers.forEach(answer => {
      answer.question = updatedQuestion;
      if (answer.id) {
        // If answer's id is set, this is an update
        this.answerAPIService.editItem(answer)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe();
      } else {
        // Otherwise this is a new answer to add
        this.answerAPIService.addItem(answer)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe();
      }
    });
  }

  /**
   *  Check if there are any responses to delete.
   *  If there are any, delete them from database.
   * @param idAnswersToDelete
   */
  sendAnswersToDeleteToAPI(idAnswersToDelete: number[]) {
    if (!idAnswersToDelete.length) return;

    idAnswersToDelete.forEach(idAnswer => {
      this.answerAPIService.deleteItem(idAnswer)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe();
    });
  }

}
