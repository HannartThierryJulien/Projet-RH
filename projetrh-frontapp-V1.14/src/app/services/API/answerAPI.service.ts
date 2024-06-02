import {Injectable} from "@angular/core";
import {catchError, finalize, map, Observable, retry} from "rxjs";
import {Answer} from "../../models/answer.model";
import {GenericAPIService} from "./genericAPI.service";

@Injectable({
  providedIn: 'root',
})
export class AnswerAPIService extends GenericAPIService<Answer> {

  constructor() {
    super();
    this.itemName = 'answer';
    this.apiUrl = '/aubay-HRProject/answers';
    this.initializeMessages();
  }

  getAnswersByQuestionId(questionId: number): Observable<Answer[]> {
    const key = `load_answers_by_question_${questionId}`;
    this.loadingService.setLoading(key, true);

    const params = {questionId: questionId.toString()};

    return this.http.get<{ data: Answer[], message: string }>(this.apiUrl, {params}).pipe(
      map(response => response.data),
      retry(this.nbRequestRetry),
      catchError(error => this.errorHandlerService.handleError(error, this.errorMsg_loadItems)),
      finalize(() => this.loadingService.setLoading(key, false))
    );
  }

}
