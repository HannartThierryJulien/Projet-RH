import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, Subject, tap, throwError} from "rxjs";
import {Router} from "@angular/router";
import {User} from "../../models/user.model";
import {JwtHelperService} from '@auth0/angular-jwt';
import {CustomJWT} from "../../models/customJWT.model"; // https://www.npmjs.com/package/@auth0/angular-jwt

@Injectable({providedIn: 'root'})
export class AuthAPIService {
  private tokenExpirationTimer: any;
  private authBaseUrl = '/aubay-HRProject/auth';
  user = new BehaviorSubject<User | null>(null);
  private localStorageName = 'userData';
  redirectUrl: string | null = null;
  isLogoutButtonClickable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient,
              private router: Router) {
  }

  signup(lastname: string, firstname: string, email: string, password: string) {
    console.log(lastname, " ", firstname, " ", email, " ", password);
    return this.http
      .post<any>(
        this.authBaseUrl + '/signup',
        {
          lastname: lastname,
          firstname: firstname,
          username: email,
          password: password
        }
      )
      .pipe(
        tap(resData => {
          const jwt = CustomJWT.getDecodedJWT(resData.token);
          if (jwt){
            this.handleAuthentication(jwt);
          }
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(
        this.authBaseUrl + '/login',
        {
          username: email,
          password: password
        }
      )
      .pipe(
        tap(resData => {
          const jwt = CustomJWT.getDecodedJWT(resData.token);
          if (jwt){
            this.handleAuthentication(jwt);
          }
        })
      );
  }

  autoLogin() {
    const item = localStorage.getItem(this.localStorageName);
    if (!item) {
      return;
    }

    const userData: {
      role: string,
      email: string,
      id: string,
      _jwt: string,
      _tokenExpirationDate: string
    } = JSON.parse(item);

    const loadedUser = new User(userData.role, userData.email, userData.id, userData._jwt, new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {
      this.user.next(loadedUser);

      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  private handleAuthentication(jwtData: CustomJWT) {
    const expirationDate = new Date(jwtData.exp * 1000);
    const user = new User(jwtData.role, jwtData.email, jwtData.id, jwtData.jwt, expirationDate);
    this.user.next(user);
    this.autoLogout(jwtData.getMilliSecondsBetweenExpAndIat());
    localStorage.setItem('userData', JSON.stringify(user));
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

}
