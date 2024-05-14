import {inject, Injectable} from "@angular/core";
import {Observable, throwError} from "rxjs";
import {NotificationService} from "./notification.service";
import {TranslateService} from "@ngx-translate/core";

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
        messageDetail = this.translateService.instant('Connection error: Unable to reach the server.');
        break;
      }
      case 400: {
        messageDetail = this.translateService.instant('Bad request.');
        break;
      }
      case 401: {
        messageDetail = this.translateService.instant('Unauthorized.');
        break;
      }
      case 403: {
        messageDetail = this.translateService.instant('Forbidden.');
        break;
      }
      case 404: {
        messageDetail = this.translateService.instant('Item not found.');
        break;
      }
      case 409: {
        messageDetail = this.translateService.instant('Conflict.');
        break;
      }
      case 500: {
        messageDetail = this.translateService.instant('Internal server error.');
        break;
      }
      default: {
        messageDetail = '';
        break;
      }
    }

    messageDetail = this.translateService.instant(messageDetail);
    errorMessage = this.translateService.instant(errorMessage) + ' ' + messageDetail;

    this.notificationService.showError(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
