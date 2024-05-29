import {Test} from "./test.model";
import {Candidate} from "./candidate.model";

export class CandidateTest {

  constructor(
    public id: number,
    public assignedAt: Date,
    public startedAt: Date | null,
    public endedAt: Date | null,
    public score: number | null,
    public resultsShared: boolean,
    public status: string,
    public candidate: Candidate,
    public test: Test
  ) {
  }

}
