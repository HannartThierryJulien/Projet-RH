import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AuthAPIService} from "../../services/API/authAPI.service";
import {BehaviorSubject, EMPTY, Subject, switchMap, take, takeUntil, tap} from "rxjs";
import {LoadingService} from "../../services/loading.service";
import {Candidate} from "../../models/candidate.model";
import {CandidateAPIService} from "../../services/API/candidateAPI.service";
import {HrManagerAPIService} from "../../services/API/hrManagerAPI.service";
import {HrManager} from "../../models/hrManager.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private candidateAPIService = inject(CandidateAPIService);
  private hrManagerAPIService = inject(HrManagerAPIService);
  private authAPIService = inject(AuthAPIService);

  private unsubscribe$ = new Subject<void>();
  role: string = '';
  userSubject: BehaviorSubject<Candidate | HrManager | null> = new BehaviorSubject<Candidate | HrManager | null>(null);

  ngOnInit() {
    this.onRefresh();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * First recover logged user.
   * Then recover candidate/hrManager as observable for the child component to react when refresh
   */
  onRefresh() {
    this.authAPIService.user.pipe(
      take(1), // Take only first emitted value (to avoid multiple subscriptions)
      switchMap(user => {
        if (!user) {
          return EMPTY;
        }

        if (user.role == 'candidate') {
          this.role = 'candidate';
          return this.candidateAPIService.getItem(+user.id);
        } else if (user.role == 'hrManager') {
          this.role = 'hrManager';
          return this.hrManagerAPIService.getItem(+user.id);
        } else {
          return EMPTY;
        }
      }),
      tap(user => {
        // Update userSubject
        this.userSubject.next(user);
      })
    ).subscribe();
  }

}
