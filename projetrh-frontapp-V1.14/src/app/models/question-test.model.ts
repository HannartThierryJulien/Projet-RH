import {Test} from "./test.model";
import {Question} from "./question.model";

export class QuestionTest {

  constructor(
    public id: number,
    public question: Question,
    public test: Test,
  ) {
  }

}
