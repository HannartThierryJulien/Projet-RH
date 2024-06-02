import {Injectable} from "@angular/core";
import {Questionnaire} from "../../models/questionnaire.model";
import {GenericAPIService} from "./genericAPI.service";

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireAPIService extends GenericAPIService<Questionnaire> {
  constructor() {
    super();
    this.itemName = 'questionnaire';
    this.apiUrl = '/aubay-HRProject/questionnaires';
    this.initializeMessages();
  }

}

