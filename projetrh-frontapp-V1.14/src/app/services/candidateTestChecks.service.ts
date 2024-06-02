import {Injectable} from "@angular/core";
import {CandidateTest} from "../models/candidate-test.model";

/**
 * Service used to execute some verifications before a candidate can take his test.
 */
@Injectable({
  providedIn: 'root'
})
export class CandidateTestChecksService {
  private maxDurationToTakeATest = (7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds

  public areSecurityChecksGood(candidateTest: CandidateTest, candidateId: number): boolean {
    if (!this.isLoggedUserAssigned(candidateTest, candidateId)) {
      return false;
    }

    if (this.isTestAlreadyStarted(candidateTest)) {
      return false;
    }

    if (this.isTestExpired(candidateTest)) {
      return false;
    }

    return true;
  }

  private isTestAlreadyStarted(candidateTest: CandidateTest) {
    if (candidateTest.startedAt == null) {
      return false;
    } else {
      return true;
    }
  }

  private isLoggedUserAssigned(candidateTest: CandidateTest, candidateId: number): boolean {
    if (candidateTest == null || (candidateTest.candidate.id != candidateId)) {
      return false;
    } else {
      return true;
    }
  }

  private isTestExpired(candidateTest: CandidateTest): boolean {
    // convert string to Date
    let convertedAssignationDate = new Date(candidateTest.assignedAt);
    const assignationTime = convertedAssignationDate.getTime();
    const expirationTime = assignationTime + this.maxDurationToTakeATest;
    const currentTime = Date.now();

    if (currentTime >= assignationTime && currentTime <= expirationTime) {
      return false;
    } else {
      return true;
    }

  }

}
