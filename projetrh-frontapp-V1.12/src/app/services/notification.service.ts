import {inject, Injectable} from "@angular/core";

;
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);
  private translateService = inject(TranslateService);

  showNotification(message: string, action: string, config?: MatSnackBarConfig) {
    message = this.translateService.instant(message);
    action = this.translateService.instant(action);
    this.snackBar.open(message, action, config);
  }

  showSuccess(message: string) {
    const config: MatSnackBarConfig = {
      panelClass: ['success-snackbar'],
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    };
    this.showNotification(message, 'Close', config);
  }

  showWarning(message: string) {
    const config: MatSnackBarConfig = {
      panelClass: ['warning-snackbar'],
      duration: 10000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    };
    this.showNotification(message, 'Close', config);
  }

  showError(message: string) {
    const config: MatSnackBarConfig = {
      panelClass: ['error-snackbar'],
      duration: 10000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    };
    this.showNotification(message, 'Close', config);
  }

  showInfo(message: string) {
    const config: MatSnackBarConfig = {
      panelClass: ['info-snackbar'],
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    };
    this.showNotification(message, 'Close', config);
  }

  showCustomNotification(message: string, action: string, config: MatSnackBarConfig) {
    this.showNotification(message, action, config);
  }

}
