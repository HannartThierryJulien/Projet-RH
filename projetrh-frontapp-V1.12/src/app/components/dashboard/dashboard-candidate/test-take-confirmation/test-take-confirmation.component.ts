import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CandidateTest} from "../../../../models/candidate-test.model";

@Component({
  selector: 'app-test-take-confirmation',
  templateUrl: './test-take-confirmation.component.html',
  styleUrl: './test-take-confirmation.component.scss'
})
export class TestTakeConfirmationComponent {
  constructor(public dialogRef: MatDialogRef<TestTakeConfirmationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CandidateTest) {
  }

  onClose() {
    this.dialogRef.close();
  }

  onTakeTest() {
    this.dialogRef.close();
  }
}
