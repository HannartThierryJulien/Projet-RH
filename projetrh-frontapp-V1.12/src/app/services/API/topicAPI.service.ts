import {Injectable} from "@angular/core";
import {Topic} from "../../models/topic.model";
import {HttpClient} from "@angular/common/http";
import {GenericAPIService} from "./genericAPI.service";
import {LoadingService} from "../loading.service";
import {NotificationService} from "../notification.service";
import {ErrorHandlerService} from "../errorHandler.service";

@Injectable({
  providedIn: 'root',
})
export class TopicAPIService extends GenericAPIService<Topic> {
  constructor() {
    super();
    this.itemName = 'topic';
    this.apiUrl = '/aubay-HRProject/topics';
    this.initializeMessages();
  }

}


