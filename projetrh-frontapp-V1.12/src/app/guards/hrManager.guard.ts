import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import {inject, Injectable} from "@angular/core";
import {map, Observable, take} from "rxjs";
import {AuthAPIService} from "../services/API/authAPI.service";

@Injectable({providedIn: 'root'})
class HrManagerGuardService {

  constructor(private authAPIService: AuthAPIService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.authAPIService.user.pipe(
      take(1),
      map(user => {
        if (user && user.role == 'hrManager') {
          return true;
        } else {
          this.router.navigate(['/auth']);
          return false;
        }

      })
    )
  }
}

export const HrManagerGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> => {
  return inject(HrManagerGuardService).canActivate(route, state);
}

// @Injectable({providedIn: 'root'})
// export class HrManagerGuard implements CanActivate {
//   constructor(private authAPIService: AuthAPIService,
//               private router: Router) {
//   }
//
//   canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     return this.authAPIService.user.pipe(
//       take(1),
//       map(user => {
//         if (user && user.role == 'hrManager') {
//           return true;
//         }
//         return this.router.createUrlTree(['/auth']);
//       })
//     )
//   }
//
// }
