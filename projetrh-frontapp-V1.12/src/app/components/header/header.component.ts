import {Component, OnDestroy} from '@angular/core';
import {BehaviorSubject, Subject, Subscription, takeUntil} from "rxjs";
import {AuthAPIService} from "../../services/API/authAPI.service";
import {NavigationEnd, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.scss',
    '../../../assets/bootstrap.min.css'
  ]
})
export class HeaderComponent implements OnDestroy {
  private unsubscribe$ = new Subject<void>();
  isHRManager = false;
  isCandidate = false;
  username: string = '';
  isAuthPage: boolean = false;
  isLogoutButtonClickableSubject: boolean = true;

  constructor(private authAPIService: AuthAPIService,
              private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.authAPIService.user
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {

        this.isHRManager = user?.role == 'hrManager';
        this.isCandidate = user?.role == 'candidate';
        this.username = user ? this.extractUsername(user.email) : '';
      });

    this.router.events
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.isAuthPage = this.router.url === '/auth';
        }
      });

    this.authAPIService.isLogoutButtonClickable
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isClickable => this.isLogoutButtonClickableSubject = isClickable);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onLogout() {
    if (this.isLogoutButtonClickableSubject) {
      this.authAPIService.logout();
    } else {
      this.notificationService.showError("Disconnection prohibited.");
    }
  }

  private extractUsername(email: string): string {
    const usernameParts = email.split('@');
    return usernameParts.length > 0 ? usernameParts[0] : '';
  }

}
