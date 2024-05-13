import {EventEmitter, Injectable} from "@angular/core";
import {QuestionAPIService} from "./API/questionAPI.service";
import {BehaviorSubject} from "rxjs";
import {Test} from "../models/test.model";

@Injectable({
  providedIn: 'root',
})
export class SelectedItemsService {

  idQuestionSelected: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  isArchivedQuestionsListSelected = new BehaviorSubject<boolean>(false);

  idQuestionnaireSelected: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  isArchivedQuestionnairesListSelected = new BehaviorSubject<boolean>(false);

  idTopicSelected: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  isArchivedTopicsListSelected = new BehaviorSubject<boolean>(false);

  isArchivedTestsListSelected = new BehaviorSubject<boolean>(false);

}
