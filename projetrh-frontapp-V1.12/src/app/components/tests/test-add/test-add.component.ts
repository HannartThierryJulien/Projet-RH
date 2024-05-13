import {Component, OnDestroy, OnInit} from '@angular/core';
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
  testForm!: FormGroup;
  private unsubscribe$ = new Subject<void>();

  constructor(private testAPIService: TestAPIService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<TestAddComponent>,
              private router: Router) {
  }

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
      pointsSum: 0,
      timeLimit: "00:00:00",
      creationDate: new Date(),
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

