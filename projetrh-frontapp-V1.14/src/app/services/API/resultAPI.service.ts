import {Injectable} from "@angular/core";
import {GenericAPIService} from "./genericAPI.service";
import {Result} from "../../models/result.model";
import {catchError, finalize, map, Observable, retry, tap} from "rxjs";
import {Question} from "../../models/question.model";

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

  getAllResultsByCandidate_testId(candidateTestId: number): Observable<Result[]> {
    const key = `load_results_by_candidate-test_${candidateTestId}`;
    this.loadingService.setLoading(key, true);

    const params = {candidate_testId: candidateTestId.toString()};

    return this.http.get<{ data: Result[], message: string }>(this.apiUrl, {params}).pipe(
      map(response => response.data),
      retry(this.nbRequestRetry),
      catchError(error => this.errorHandlerService.handleError(error, this.errorMsg_loadItems)),
      finalize(() => this.loadingService.setLoading(key, false))
    );
  }

  getAllResultsByTestId(testId: number): Observable<Result[]> {
    const key = `load_results_by_test_${testId}`;
    this.loadingService.setLoading(key, true);

    const params = {testId: testId.toString()};

    return this.http.get<{ data: Result[], message: string }>(this.apiUrl, {params}).pipe(
      map(response => response.data),
      retry(this.nbRequestRetry),
      catchError(error => this.errorHandlerService.handleError(error, this.errorMsg_loadItems)),
      finalize(() => this.loadingService.setLoading(key, false))
    );
  }


}
