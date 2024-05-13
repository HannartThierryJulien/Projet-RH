import {Injectable} from "@angular/core";
import {GenericAPIService} from "./genericAPI.service";
import {Result} from "../../models/result.model";
import {catchError, finalize, map, Observable, retry, tap} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ResultAPIService extends GenericAPIService<Result> {
  constructor() {
    super();
    this.itemName = 'result';
    this.apiUrl = '/aubay-HRProject/results';
    this.initializeMessages();
  }

  addResult(item: Result, showNotification: boolean = true): Observable<void> {
    const key = 'add_' + this.itemName;
    this.loadingService.setLoading(key, true);

    return this.http.post<void>(this.apiUrl, item).pipe(
      retry(this.nbRequestRetry),
      catchError(error => this.errorHandlerService.handleError(error, this.errorMsg_addItem)),
      finalize(() => this.loadingService.setLoading(key, false)),
      tap(() => {
        showNotification ? this.notificationService.showSuccess(this.successMsg_addItem) : null;
      })
    );
  }


}
