import {Answer} from "./answer.model";
import {Question} from "./question.model";
import {CandidateTest} from "./candidate-test.model";

export class Result {

  constructor(
    public id: number,
    public answerSelected: boolean,
    public answer: Answer,
    public candidateTest: CandidateTest,
    public question: Question
  ) {
  }

}
