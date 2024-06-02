import {Injectable} from "@angular/core";
import {catchError, finalize, map, Observable, retry} from "rxjs";
import {Question} from "../../models/question.model";
import {GenericAPIService} from "./genericAPI.service";

@Injectable({
  providedIn: 'root',
})
export class QuestionAPIService extends GenericAPIService<Question> {
  constructor() {
    super();
    this.itemName = 'question';
    this.apiUrl = '/aubay-HRProject/questions';
    this.initializeMessages();
  }

  getQuestionsByArchivedAndQuestionnaireId(archived: boolean, questionnaireId: number): Observable<Question[]> {
    const key = `load_questions_by_archived_and_questionnaire_${questionnaireId}`;
    this.loadingService.setLoading(key, true);

    const params = {archived: archived, questionnaireId: questionnaireId.toString()};

    return this.http.get<{ data: Question[], message: string }>(this.apiUrl, {params}).pipe(
      map(response => response.data),
      retry(this.nbRequestRetry),
      catchError(error => this.errorHandlerService.handleError(error, this.errorMsg_loadItems)),
      finalize(() => this.loadingService.setLoading(key, false))
    );
  }

}


