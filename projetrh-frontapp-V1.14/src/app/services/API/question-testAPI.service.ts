import {Injectable} from "@angular/core";
import {GenericAPIService} from "./genericAPI.service";
import {catchError, finalize, map, Observable, retry} from "rxjs";
import {QuestionTest} from "../../models/question-test.model";

@Injectable({
  providedIn: 'root',
})
export class QuestionTestAPIService extends GenericAPIService<QuestionTest> {

  constructor() {
    super();
    this.itemName = 'question-test';
    this.apiUrl = '/aubay-HRProject/question_tests';
    this.initializeMessages();
  }

  getAllQuestionTestByTestId(testId: number): Observable<QuestionTest[]> {
    const key = `load_question-test_by_test_${testId}`;
    this.loadingService.setLoading(key, true);

    const params = {testId: testId.toString()};

    return this.http.get<{ data: QuestionTest[], message: string }>(this.apiUrl, {params}).pipe(
      map(response => response.data),
      retry(this.nbRequestRetry),
      catchError(error => this.errorHandlerService.handleError(error, this.errorMsg_loadItems)),
      finalize(() => this.loadingService.setLoading(key, false))
    );
  }

}
