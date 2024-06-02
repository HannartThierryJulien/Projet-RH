import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {AuthAPIService} from "../../services/API/authAPI.service";
import {NavigationEnd, Router} from "@angular/router";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.scss',
    '../../../assets/bootstrap.min.css'
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authAPIService = inject(AuthAPIService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  private unsubscribe$ = new Subject<void>();
  isHRManager = false;
  isCandidate = false;
  username: string = '';
  isAuthPage: boolean = false;
  isLogoutButtonClickableSubject: boolean = true;

  ngOnInit() {
    // Detect user's role and extract username from mail
    this.authAPIService.user
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        this.isHRManager = user?.role == 'hrManager';
        this.isCandidate = user?.role == 'candidate';
        this.username = user ? this.extractUsername(user.email) : '';
      });

    // Subscribe to router's events to know if user is on auth page (to hide the "login" button)
    this.router.events
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.isAuthPage = this.router.url === '/auth';
        }
      });

    // Subscribe to behaviorSubject to know when to disable logout button
    this.authAPIService.isLogoutButtonClickable
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isClickable => this.isLogoutButtonClickableSubject = isClickable);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Logout user, except if it's prohibited (during a test for example)
   */
  onLogout() {
    if (this.isLogoutButtonClickableSubject) {
      this.authAPIService.logout();
    } else {
      this.notificationService.showError("Disconnection prohibited.");
    }
  }

  /**
   * Extract a username from the mail
   * @param email
   * @private
   */
  private extractUsername(email: string): string {
    const usernameParts = email.split('@');
    return usernameParts.length > 0 ? usernameParts[0] : '';
  }

}
