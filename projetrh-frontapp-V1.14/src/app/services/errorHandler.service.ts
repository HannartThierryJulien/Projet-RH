import {inject, Injectable} from "@angular/core";
import {Observable, throwError} from "rxjs";
import {NotificationService} from "./notification.service";
import {TranslateService} from "@ngx-translate/core";

/**
 * Service used to handle http errors with backend.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private notificationService = inject(NotificationService);
  private translateService = inject(TranslateService);

  public handleError(error: any, errorMessage: string): Observable<never> {
    const errorDetail = `Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`;
    let messageDetail: string;
    console.error('An error occurred:', errorDetail);

    switch (error.status) {
      case 0: {
        messageDetail = 'Connection error: Unable to reach the server.';
        break;
      }
      case 400: {
        messageDetail = 'Bad request.';
        break;
      }
      case 401: {
        messageDetail = 'Unauthorized.';
        break;
      }
      case 403: {
        messageDetail = 'Forbidden.';
        break;
      }
      case 404: {
        messageDetail = 'Item not found.';
        break;
      }
      case 409: {
        messageDetail = 'Conflict.';
        break;
      }
      case 500: {
        messageDetail = 'Internal server error.';
        break;
      }
      default: {
        messageDetail = '';
        break;
      }
    }

    messageDetail = this.translateService.instant(messageDetail);
    errorMessage = this.translateService.instant(errorMessage);
    errorMessage = errorMessage + ' ' + messageDetail;

    this.notificationService.showError(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
