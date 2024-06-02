import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AuthAPIService} from "../../../services/API/authAPI.service";
import {passwordValidator} from "../../../validators/password.validator";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  private authAPIService = inject(AuthAPIService);
  private formBuilder = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<ChangePasswordComponent>);
  public data: number = inject(MAT_DIALOG_DATA);
  showPassword = false;

  passwordForm!: FormGroup;
  userId!: number;
  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    // Recover user id
    this.userId = this.data;

    if (this.userId) {
      // passwordForm initialization
      this.passwordForm = this.formBuilder.group({
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, passwordValidator()]]
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Close the MatDialog of the change-password component.
   */
  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Submit FormGroup.
   */
  onSubmit() {
    // Check if the FormGroup is valid
    if (!this.passwordForm.valid) {
      console.error('Form is invalid.');
      return;
    }

    // Recover passwords
    const passwords: {oldPassword: string, newPassword: string} = {
      oldPassword: this.passwordForm.value.oldPassword,
      newPassword: this.passwordForm.value.newPassword,
    };

    // Update password in database
    this.authAPIService.changePassword(this.userId, passwords)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.onClose());
  }

  /**
   * Used to display, or not, the password in text.
   */
  toggleShowOldPassword() {
    this.showPassword = !this.showPassword;
  }

}
