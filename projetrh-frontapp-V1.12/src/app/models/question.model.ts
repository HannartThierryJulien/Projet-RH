import {Topic} from "./topic.model";
import {Questionnaire} from "./questionnaire.model";

export class Question {

  constructor(
    public id: number,
    public label: string,
    public points: number,
    public weight: number,
    public timeLimit: string,
    public archived: boolean,
    public topic: Topic,
    public questionnaire: Questionnaire
  ) {
  }

}
