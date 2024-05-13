export class Topic {

  constructor(
    public id: number,
    public label: string,
    public description: string,
    public creationDate: Date,
    public archived: boolean
  ) {
  }

}
