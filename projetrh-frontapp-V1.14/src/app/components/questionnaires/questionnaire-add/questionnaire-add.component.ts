import {Component, OnDestroy, OnInit} from '@angular/core';
import {Questionnaire} from "../../../models/questionnaire.model";
import {Topic} from "../../../models/topic.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {QuestionnaireAPIService} from "../../../services/API/questionnaireAPI.service";
import {TopicAPIService} from "../../../services/API/topicAPI.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-questionnaire-add',
  templateUrl: './questionnaire-add.component.html',
  styleUrl: './questionnaire-add.component.scss'
})
export class QuestionnaireAddComponent implements OnInit, OnDestroy {
  topics: Topic[] = [];
  questionnaireForm!: FormGroup;
  private unsubscribe$ = new Subject<void>();

  constructor(private questionnaireAPIService: QuestionnaireAPIService,
              private topicAPIService: TopicAPIService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<QuestionnaireAddComponent>) {
  }

  ngOnInit(): void {
    // questionnaireForm initialization
    this.questionnaireForm = this.formBuilder.group({
      label: ['', Validators.required],
      description: [''],
      topic: ['', Validators.required]
    });

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
   * Close the MatDialog of the questionnaire-add component
   */
  onClose() {
    this.dialogRef.close(false);
  }


  /**
   * Submit FormGroup
   */
  onSubmit() {
    // Check if the FormGroup is valid
    if (!this.questionnaireForm.valid) {
      console.error('Form is invalid.');
      return;
    }

    // Recover selected topic and check if not null/undefined
    const selectedTopic = this.topics.find(topic => topic.id === this.questionnaireForm.value.topic);
    if (!selectedTopic) {
      console.error('Selected topic not found.');
      return;
    }

    // Recover new questionnaire
    const newQuestionnaire: Questionnaire = {
      id: 0,
      label: this.questionnaireForm.value.label,
      description: this.questionnaireForm.value.description,
      createdAt: new Date(),
      archived: false, // New questionnaires are not archived by default
      topic: selectedTopic,
    };

    // Add questionnaire to database
    this.questionnaireAPIService.addItem(newQuestionnaire)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(addedQuestionnaire => {
        this.onClose();
      });

  }

}
