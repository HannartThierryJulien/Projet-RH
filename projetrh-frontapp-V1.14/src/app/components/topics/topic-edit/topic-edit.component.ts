import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Topic} from "../../../models/topic.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {TopicAPIService} from "../../../services/API/topicAPI.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-topic-edit',
  templateUrl: './topic-edit.component.html',
  styleUrl: './topic-edit.component.scss'
})
export class TopicEditComponent implements OnInit, OnDestroy {
  topicForm!: FormGroup;
  topicToEdit!: Topic;
  private unsubscribe$ = new Subject<void>();

  constructor(private topicAPIService: TopicAPIService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<TopicEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    // Recover topic to edit
    this.topicToEdit = this.data.topicToEdit;

    if (this.topicToEdit) {
      // topicForm initialization
      this.topicForm = this.formBuilder.group({
        id: [this.topicToEdit.id],
        label: [this.topicToEdit.label, Validators.required],
        description: [this.topicToEdit.description],
        createdAt: [this.topicToEdit.createdAt, [Validators.required]],
        archived: [this.topicToEdit.archived]
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Close the MatDialog of the topic-edit component and possibly return updated topic
   */
  onClose(updatedData?: { updatedTopic: Topic }): void {
    this.dialogRef.close(updatedData);
  }

  /**
   * Submit FormGroup
   */
  onSubmit() {
    // Check if the FormGroup is valid
    if (!this.topicForm.valid) {
      console.error('Form is invalid.');
      return;
    }

    // Recover updated topic
    const updatedTopic: Topic = {
      id: this.topicForm.value.id,
      label: this.topicForm.value.label,
      description: this.topicForm.value.description,
      createdAt: this.topicForm.value.createdAt,
      archived: this.topicToEdit.archived
    };

    // Update topic in database
    this.topicAPIService.editItem(updatedTopic)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: updatedTopic => {
          this.onClose({updatedTopic});
        }
      });
  }

}
