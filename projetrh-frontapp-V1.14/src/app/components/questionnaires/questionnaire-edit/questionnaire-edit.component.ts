import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Questionnaire} from "../../../models/questionnaire.model";
import {Topic} from "../../../models/topic.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {QuestionnaireAPIService} from "../../../services/API/questionnaireAPI.service";
import {TopicAPIService} from "../../../services/API/topicAPI.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-questionnaire-edit',
  templateUrl: './questionnaire-edit.component.html',
  styleUrl: './questionnaire-edit.component.scss'
})
export class QuestionnaireEditComponent implements OnInit, OnDestroy {
  topics: Topic[] = [];
  questionnaireForm!:  FormGroup;
  questionnaireToEdit!: Questionnaire;
  defaultTopic: Topic | undefined;
  private unsubscribe$ = new Subject<void>();


  private questionnaireAPIService = inject(QuestionnaireAPIService);
  private topicAPIService = inject(TopicAPIService);
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<QuestionnaireEditComponent>);
  private data: any = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    // Recover questionnaire to edit
    this.questionnaireToEdit = this.data.questionnaireToEdit;

    if (this.questionnaireToEdit) {
      // questionnaireForm initialization
      this.questionnaireForm = this.formBuilder.group({
        id: [this.questionnaireToEdit.id],
        label: [this.questionnaireToEdit.label, Validators.required],
        description: [this.questionnaireToEdit.description],
        createdAt: [this.questionnaireToEdit.createdAt, [Validators.required]],
        archived: [this.questionnaireToEdit.archived],
        topic: [this.questionnaireToEdit.topic.id, Validators.required],
      });
      this.defaultTopic = this.questionnaireToEdit.topic;
    }

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
   * Close the MatDialog of the questionnaire-edit component and possibly return updated questionnaire
   */
  onClose(updatedData?: { updatedQuestionnaire: Questionnaire}): void {
    this.dialogRef.close(updatedData);
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

    // Recover updated questionnaire
    const updatedQuestionnaire: Questionnaire = {
      id: this.questionnaireForm.value.id,
      label: this.questionnaireForm.value.label,
      description: this.questionnaireForm.value.description,
      createdAt: this.questionnaireForm.value.createdAt,
      archived: this.questionnaireToEdit.archived,
      topic: selectedTopic,
    };

    // Update questionnaire in database
    this.questionnaireAPIService.editItem(updatedQuestionnaire)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: updatedQuestionnaire => {
          this.onClose({updatedQuestionnaire});
        }
      });
  }

}
