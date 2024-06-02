import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

/**
 * Service used to handle and listen to the selection of item and archived/unarchived list in many components.
 * An "item" means a Question/Questionnaire/Topic/Test object.
 */
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
