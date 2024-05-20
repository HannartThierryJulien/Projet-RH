import {Injectable} from "@angular/core";
import {GenericAPIService} from "./genericAPI.service";
import {Test} from "../../models/test.model";
import {HttpClient} from "@angular/common/http";
import {LoadingService} from "../loading.service";
import {NotificationService} from "../notification.service";
import {ErrorHandlerService} from "../errorHandler.service";
@Injectable({
  providedIn: 'root',
})
export class TestAPIService extends GenericAPIService<Test> {

  constructor() {
    super();
    this.itemName = 'test';
    this.apiUrl = '/aubay-HRProject/tests';
    this.initializeMessages();
  }

}
