import {Question} from "./question.model";

export class Answer {

  constructor(
    public id: number,
    public label: string,
    public right: boolean,
    public archived: boolean,
    public question: Question
  ) {
  }

}
