import {inject, Injectable} from "@angular/core";
import {
  MatSnackBar,
  MatSnackBarConfig,
} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";

/**
 * Service used to create pre-configured or customized notifications.
 * It is based on the use of the "snack-bar" component of the angular material library.
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);
  private translateService = inject(TranslateService);

  /**
   * Display the notification (= snack-bar component) based on the provided parameters.
   * @param message
   * @param action
   * @param config
   */
  showNotification(message: string, action: string, config?: MatSnackBarConfig) {
    message = this.translateService.instant(message);
    action = this.translateService.instant(action);
    this.snackBar.open(message, action, config);
  }

  /**
   * Create a pre-configured success notification.
   * @param message
   */
  showSuccess(message: string) {
    const config: MatSnackBarConfig = {
      panelClass: ['success-snackbar'],
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    };
    this.showNotification(message, 'Close', config);
  }

  /**
   * Create a pre-configured warning notification.
   * @param message
   */
  showWarning(message: string) {
    const config: MatSnackBarConfig = {
      panelClass: ['warning-snackbar'],
      duration: 10000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    };
    this.showNotification(message, 'Close', config);
  }

  /**
   * Create a pre-configured error notification.
   * @param message
   */
  showError(message: string) {
    const config: MatSnackBarConfig = {
      panelClass: ['error-snackbar'],
      duration: 10000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    };
    this.showNotification(message, 'Close', config);
  }

  /**
   * Create a pre-configured info notification.
   * @param message
   */
  showInfo(message: string) {
    const config: MatSnackBarConfig = {
      panelClass: ['info-snackbar'],
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    };
    this.showNotification(message, 'Close', config);
  }

  /**
   * Create a custom notification based on the provided parameters.
   * @param message
   * @param action
   * @param config
   */
  showCustomNotification(message: string, action: string, config: MatSnackBarConfig) {
    this.showNotification(message, action, config);
  }

}
