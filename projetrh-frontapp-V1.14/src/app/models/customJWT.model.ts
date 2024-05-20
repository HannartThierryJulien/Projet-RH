import {JwtHelperService} from "@auth0/angular-jwt";

export class CustomJWT {

  role: string;
  email: string;
  id: string;
  username: string;
  exp: number;
  iat: number;
  jwt: string;

  constructor(decodedToken: any) {
    this.role = decodedToken.role || '';
    this.email = decodedToken.email || '';
    this.id = decodedToken.id || '';
    this.username = decodedToken.username || '';
    this.exp = decodedToken.exp || 0;
    this.iat = decodedToken.iat || 0;
    this.jwt = decodedToken.jwt || '';
  }

  static getDecodedJWT(jwt: string): CustomJWT | null {
    const helper = new JwtHelperService();
    try {
      const decodedToken = helper.decodeToken(jwt);
      const decodedJWT = new CustomJWT({...decodedToken, jwt});
      return decodedJWT;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  getMilliSecondsBetweenExpAndIat(): number {
    return (this.exp - this.iat) * 1000;
  }
}
