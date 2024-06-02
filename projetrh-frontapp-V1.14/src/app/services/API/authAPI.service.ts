import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, finalize, retry, tap} from "rxjs";
import {Router} from "@angular/router";
import {User} from "../../models/user.model";
import {CustomJWT} from "../../models/customJWT.model";
import {LoadingService} from "../loading.service";
import {ErrorHandlerService} from "../errorHandler.service";
import {NotificationService} from "../notification.service";

/**
 * ⚠️⚠️ SERVICE THAT NEEDS A REWORK cause not clean enough ⚠️⚠️
 *
 * Service that manage everything linked to authentication and users.
 */
@Injectable({providedIn: 'root'})
export class AuthAPIService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private tokenExpirationTimer: any;
  private authBaseUrl = '/aubay-HRProject/auth';
  user = new BehaviorSubject<User | null>(null);
  private localStorageName = 'userData';
  isLogoutButtonClickable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private loadingService = inject(LoadingService);
  private nbRequestRetry: number = 1;
  private errorHandlerService = inject(ErrorHandlerService);
  private notificationService = inject(NotificationService);
  private errorMsg_anonymizeUser = "error_msg_anonymize_user";
  private successMsg_anonymizeUser = "success_msg_anonymize_user";
  private errorMsg_changeUserPassword = "error_msg_change_user_password";
  private successMsg_changeUserPassword = "success_msg_change_user_password";

  /**
   * Signup a new user, retrieve a JWT from backend and handle it.
   * Currently (01/06/2024), the backend signup candidates by default (not hrManagers).
   * @param lastname
   * @param firstname
   * @param email
   * @param password
   * @param consentGivenAt
   */
  signup(lastname: string, firstname: string, email: string, password: string, consentGivenAt: Date) {
    return this.http
      .post<any>(
        this.authBaseUrl + '/signup',
        {
          lastname: lastname,
          firstname: firstname,
          username: email,
          password: password,
          consentGivenAt: consentGivenAt
        }
      )
      .pipe(
        // Intercept the backend's response (a JWT) after registration and handle it.
        tap(resData => {
          const jwt = CustomJWT.getDecodedJWT(resData.token);
          if (jwt) {
            this.handleAuthentication(jwt);
          }
        })
      );
  }

  /**
   * Login in user, retrieve a JWT from backend and handle it.
   * @param email
   * @param password
   */
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
          if (jwt) {
            this.handleAuthentication(jwt);
          }
        })
      );
  }

  /**
   * When user land on app, check if he already came and has login data in his localStorage.
   * If it does, start a countdown to auto logout him.
   */
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

  /**
   * Use the JWT retrieved from the backend create a User object, exécute autoLogout() and store the User object in localStorage.
   * @param jwtData
   * @private
   */
  private handleAuthentication(jwtData: CustomJWT) {
    const expirationDate = new Date(jwtData.exp * 1000);
    const user = new User(jwtData.role, jwtData.email, jwtData.id, jwtData.jwt, expirationDate);
    this.user.next(user);
    this.autoLogout(jwtData.getMilliSecondsBetweenExpAndIat());
    localStorage.setItem('userData', JSON.stringify(user));
  }

  /**
   * Redirect user to auth page and remove User data from localStorage.
   * Then, clear timer for outologout.
   */
  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  /**
   * Initiates a timer based on the JWT expiration duration.
   * Upon timer completion, execute logout().
   * @param expirationDuration
   */
  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  /**
   * Sends a request to the backend to anonymize a user.
   * Notifies the user of the success or failure of the anonymization process.
   * @param userId
   * @param showNotification
   */
  anonymizeUser(userId: number, showNotification: boolean = true) {
    const key = `anonymize_user_${userId}`;
    this.loadingService.setLoading(key, true);

    return this.http.post<{ data: string, message: string }>(this.authBaseUrl + '/anonymize/' + userId, {}).pipe(
      retry(this.nbRequestRetry),
      catchError(error => this.errorHandlerService.handleError(error, this.errorMsg_anonymizeUser)),
      finalize(() => this.loadingService.setLoading(key, false))
    ).pipe(
      tap(() => {
        showNotification ? this.notificationService.showSuccess(this.successMsg_anonymizeUser) : null;
      })
    );
  }

  /**
   * Sends a request to the backend to change user's password.
   * Notifies the user of the success or failure of the anonymization process.
   * @param userId
   * @param passwords
   * @param showNotification
   */
  changePassword(userId: number, passwords: { oldPassword: string; newPassword: string }, showNotification: boolean = true) {
    const key = `change_password`;
    this.loadingService.setLoading(key, true);

    return this.http.post<{ data: string, message: string }>(this.authBaseUrl + '/change-password/' + userId, passwords).pipe(
      retry(this.nbRequestRetry),
      catchError(error => this.errorHandlerService.handleError(error, this.errorMsg_changeUserPassword)),
      finalize(() => this.loadingService.setLoading(key, false))
    ).pipe(
      tap(() => {
        showNotification ? this.notificationService.showSuccess(this.successMsg_changeUserPassword) : null;
      })
    );
  }
}
