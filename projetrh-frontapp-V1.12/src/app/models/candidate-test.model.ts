import {Test} from "./test.model";
import {Candidate} from "./candidate.model";

export class CandidateTest {

  constructor(
    public id: number,
    public assignationDate: Date,
    public completionDate: Date | null,
    public completionTime: string | null,
    public obtainedPoints: number | null,
    public candidate: Candidate,
    public test: Test
  ) {
  }

}
