import {Person} from "./person.model";

export class HrManager {

  constructor(
    public id: number,
    public mail: string,
    public label: string,
    public right: boolean,
    public archived: boolean,
    public person: Person
  ) {
  }

}
