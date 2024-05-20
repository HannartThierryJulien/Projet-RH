import {Topic} from "./topic.model";

export class Questionnaire {

  constructor(
    public id: number,
    public label: string,
    public description: string,
    public createdAt: Date,
    public archived: boolean,
    public topic: Topic
  ) {
  }

}
