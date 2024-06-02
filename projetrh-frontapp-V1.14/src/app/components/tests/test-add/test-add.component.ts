import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {TestAPIService} from "../../../services/API/testAPI.service";
import {MatDialogRef} from "@angular/material/dialog";
import {Test} from "../../../models/test.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-test-add',
  templateUrl: './test-add.component.html',
  styleUrl: './test-add.component.scss'
})
export class TestAddComponent implements OnInit, OnDestroy {
  private testAPIService = inject(TestAPIService);
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TestAddComponent>);
  private router = inject(Router);

  testForm!: FormGroup;
  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    // form initialization
    this.testForm = this.formBuilder.group({
      label: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Close the MatDialog of the test-add component
   */
  onClose(addedTestId?: number) {
    if (addedTestId) {
      this.router.navigate(['/tests/', addedTestId]);
    }
    this.dialogRef.close();
  }


  /**
   * Submit FormGroup
   */
  onSubmit() {
    // Check if the FormGroup is valid
    if (!this.testForm.valid) {
      console.error('Form is invalid.');
      return;
    }

    // Recover new test
    const newTest: Test = {
      id: 0,
      label: this.testForm.value.label,
      createdAt: new Date(),
      archived: false, // New tests are not archived by default
    };

    // Add test to database
    this.testAPIService.addItem(newTest)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(addedTest => {
        this.onClose(addedTest.id);
      });

  }

}

