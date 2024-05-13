import {Injectable, OnInit} from "@angular/core";
import {BehaviorSubject, map, Observable, Subject} from "rxjs";
import {Questionnaire} from "../../models/questionnaire.model";
import {AuthAPIService} from "./authAPI.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../../models/user.model";
import {GenericAPIService} from "./genericAPI.service";
import {LoadingService} from "../loading.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationService} from "../notification.service";
import {ErrorHandlerService} from "../errorHandler.service";

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

