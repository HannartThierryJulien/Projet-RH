import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {LoadingService} from "../../../services/loading.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrl: './loading-bar.component.scss'
})
export class LoadingBarComponent implements OnInit, OnDestroy {
  private loadingService = inject(LoadingService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  isLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    // Subscribe to loading$ to track loading status
    this.loadingService.loading$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(loadingMap => {
        // Determine if there is at least one element loading by checking the values in loadingMap
        this.isLoading = this.loadingService.hasLoading();
        // Force change detection to update the view based on the new loading status
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
