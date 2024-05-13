import {Injectable} from "@angular/core";
import {GenericAPIService} from "./genericAPI.service";
import {Candidate} from "../../models/candidate.model";

@Injectable({
  providedIn: 'root',
})
export class CandidateAPIService extends GenericAPIService<Candidate> {
  constructor() {
    super();
    this.itemName = 'candidate';
    this.apiUrl = '/aubay-HRProject/auth/candidates';
    this.initializeMessages();
  }

}
