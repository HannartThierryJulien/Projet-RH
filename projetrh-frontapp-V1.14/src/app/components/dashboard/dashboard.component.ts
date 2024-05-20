import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AuthAPIService} from "../../services/API/authAPI.service";
import {BehaviorSubject, EMPTY, Observable, of, Subject, switchMap, take, takeUntil, tap} from "rxjs";
import {User} from "../../models/user.model";
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
  private unsubscribe$ = new Subject<void>();
  role: string = '';
  userSubject: BehaviorSubject<Candidate | HrManager | null> = new BehaviorSubject<Candidate | HrManager | null>(null);
  isLoading: boolean = false;

  private authAPIService = inject(AuthAPIService);
  private loadingService = inject(LoadingService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  constructor(private candidateAPIService: CandidateAPIService,
              private hrManagerAPIService: HrManagerAPIService) {
  }

  ngOnInit() {
    // Allow to know if there is at least one element loading
    this.loadingService.loading$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(loadingMap => {
        this.isLoading = Array.from(loadingMap.values()).some(value => value);
        this.changeDetectorRef.detectChanges(); // Force change detection
      });

    this.onRefresh();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onRefresh() {
    this.authAPIService.user.pipe(
      take(1), // Take only the first emitted value to avoid multiple subscriptions
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
        this.userSubject.next(user); // Update userSubject with the new data
      })
    ).subscribe();
  }

}
