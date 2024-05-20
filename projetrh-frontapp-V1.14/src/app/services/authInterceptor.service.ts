import {Injectable} from "@angular/core";
import {HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import {AuthAPIService} from "./API/authAPI.service";
import {exhaustMap, take} from "rxjs";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authAPIService: AuthAPIService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authAPIService.user.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }

        // si ya un user connecté, on ajoute le token
        const modifiedReq = req.clone({setHeaders: {'Authorization': user.token || ''}});
        return next.handle(modifiedReq);
      }));
  }
}
