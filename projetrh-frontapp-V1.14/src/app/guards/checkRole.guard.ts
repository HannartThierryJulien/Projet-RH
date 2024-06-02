import {Injectable} from "@angular/core";
import {AuthAPIService} from "../services/API/authAPI.service";
import {map, Observable, take} from "rxjs";
import {ActivatedRouteSnapshot, Router} from "@angular/router";

/**
 * Guard to grant/refuse user to access a route, depending on his role.
 */
@Injectable({providedIn: 'root'})
export class CheckRoleGuard {

  constructor(private authAPIService: AuthAPIService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    // Retrieve the allowed roles
    const allowedRoles = route.data['allowedRoles'];

    // Return true (access granted) if user's role matches allowed roles
    return this.authAPIService.user.pipe(
      take(1),
      map(user => {
        if (user) {
          return allowedRoles.indexOf(user.role) !== -1;
        } else {
          this.router.navigate(['/auth']);
          return false;
        }
      })
    )
  }

}
