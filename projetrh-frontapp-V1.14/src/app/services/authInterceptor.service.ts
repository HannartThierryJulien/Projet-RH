import {Injectable} from "@angular/core";
import {HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthAPIService} from "./API/authAPI.service";
import {exhaustMap, take} from "rxjs";

/**
 * Interceptor used to attach an Authorization token in the header of every outgoing HTTP requests if the user is authenticated.
 */
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authAPIService: AuthAPIService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authAPIService.user.pipe(
      take(1),
      exhaustMap(user => {
        // If no user is authenticated, proceed with the original request
        if (!user) {
          return next.handle(req);
        }

        // If a user is authenticated, clone the request and add the authorization header
        const modifiedReq = req.clone({setHeaders: {'Authorization': user.token || ''}});
        return next.handle(modifiedReq);
      }));
  }
}
