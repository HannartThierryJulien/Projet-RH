import {Injectable} from "@angular/core";
import {GenericAPIService} from "./genericAPI.service";
import {Test} from "../../models/test.model";
import {HrManager} from "../../models/hrManager.model";

@Injectable({
  providedIn: 'root',
})
export class HrManagerAPIService extends GenericAPIService<HrManager> {

  constructor() {
    super();
    this.itemName = 'hrManager';
    this.apiUrl = '/aubay-HRProject/auth/hrmanagers';
    this.initializeMessages();
  }

}
