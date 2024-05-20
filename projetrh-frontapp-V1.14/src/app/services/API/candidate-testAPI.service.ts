import {inject, Injectable} from "@angular/core";
import {GenericAPIService} from "./genericAPI.service";
import {HttpClient} from "@angular/common/http";
import {LoadingService} from "../loading.service";
import {NotificationService} from "../notification.service";
import {ErrorHandlerService} from "../errorHandler.service";
import {CandidateTest} from "../../models/candidate-test.model";
import {catchError, finalize, map, Observable, retry} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class CandidateTestAPIService extends GenericAPIService<CandidateTest> {

  constructor() {
    super();
    this.itemName = 'candidate-test';
    this.apiUrl = '/aubay-HRProject/candidate_tests';
    this.initializeMessages();
  }

  getAllCandidateTestByTestId(testId: number): Observable<CandidateTest[]> {
    const key = `load_candidate-test_by_test_${testId}`;
    this.loadingService.setLoading(key, true);

    const params = {testId: testId.toString()};

    return this.http.get<{ data: CandidateTest[], message: string }>(this.apiUrl + '/bytest', {params}).pipe(
      map(response => response.data),
      retry(this.nbRequestRetry),
      catchError(error => this.errorHandlerService.handleError(error, this.errorMsg_loadItems)),
      finalize(() => this.loadingService.setLoading(key, false))
    );
  }

  getAllCandidateTestByCandidateId(candidateId: number): Observable<CandidateTest[]> {
    const key = `load_candidate-test_by_candidate_${candidateId}`;
    this.loadingService.setLoading(key, true);

    const params = {candidateId: candidateId.toString()};

    return this.http.get<{ data: CandidateTest[], message: string }>(this.apiUrl, {params}).pipe(
      map(response => response.data),
      retry(this.nbRequestRetry),
      catchError(error => this.errorHandlerService.handleError(error, this.errorMsg_loadItems)),
      finalize(() => this.loadingService.setLoading(key, false))
    );
  }

  setCandidateTestCompleted(candidateTestId: number) {
    const key = `set_candidate-test_${candidateTestId}_completed`;
    this.loadingService.setLoading(key, true);

    return this.http.get<{ data: CandidateTest, message: string }>(this.apiUrl + '/' + candidateTestId + '/completed').pipe(
      retry(this.nbRequestRetry),
      catchError(error => this.errorHandlerService.handleError(error, "errorMsg_testCompleted")),
      finalize(() => this.loadingService.setLoading(key, false))
    );
  }

}


