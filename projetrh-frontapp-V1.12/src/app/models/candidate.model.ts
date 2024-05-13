import {Person} from "./person.model";

export class Candidate {

  constructor(
    public id: number,
    public mail: string,
    public professionalProfileUrl: string,
    public phoneNumber: string,
    public birthDate: Date,
    public archived: boolean,
    public person: Person
  ) {
  }

}
