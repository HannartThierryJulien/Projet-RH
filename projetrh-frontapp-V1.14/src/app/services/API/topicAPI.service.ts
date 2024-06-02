import {Injectable} from "@angular/core";
import {Topic} from "../../models/topic.model";
import {GenericAPIService} from "./genericAPI.service";

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


