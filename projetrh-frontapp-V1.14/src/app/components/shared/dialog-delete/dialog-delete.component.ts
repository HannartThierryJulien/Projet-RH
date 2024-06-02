import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrl: './dialog-delete.component.scss'
})
export class DialogDeleteComponent {
  public dialogRef = inject(MatDialogRef<DialogDeleteComponent>);
  public data: any = inject(MAT_DIALOG_DATA);

  onClose() {
    this.dialogRef.close(false);
  }

  onDelete() {
    this.dialogRef.close(true);
  }
}
