import {Component, OnDestroy, OnInit} from '@angular/core';
import {Topic} from "../../../models/topic.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {TopicAPIService} from "../../../services/API/topicAPI.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-topic-add',
  templateUrl: './topic-add.component.html',
  styleUrl: './topic-add.component.scss'
})
export class TopicAddComponent implements OnInit, OnDestroy {
  topicForm!: FormGroup;
  private unsubscribe$ = new Subject<void>();

  constructor(private topicAPIService: TopicAPIService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<TopicAddComponent>) {
  }

  ngOnInit(): void {
    // questionnaireForm initialization
    this.topicForm = this.formBuilder.group({
      label: ['', Validators.required],
      description: ['']
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Close the MatDialog of the topic-add component
   */
  onClose() {
    this.dialogRef.close(false);
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

    // Recover new topic
    const newTopic: Topic = {
      id: 0,
      label: this.topicForm.value.label,
      description: this.topicForm.value.description,
      creationDate: new Date(),
      archived: false, // New topics are not archived by default
    };

    // Add topic to database
    this.topicAPIService.addItem(newTopic)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(addedTopic => {
        this.onClose();
      });

  }

}

