export class User {

  constructor(
    public role: string,
    public email: string,
    public id: string,
    private _jwt: string,
    private _tokenExpirationDate: Date
  ) {
  }

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._jwt;
  }
}
