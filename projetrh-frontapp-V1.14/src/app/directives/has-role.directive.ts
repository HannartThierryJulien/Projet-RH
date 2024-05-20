import {Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {distinctUntilChanged, Subject, switchMapTo, takeUntil} from "rxjs";
import {AuthAPIService} from "../services/API/authAPI.service";

@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnInit, OnDestroy {
  @Input() hasRole!: 'hrManager' | 'candidate';

  private destroy$ = new Subject();

  private template = inject(TemplateRef<unknown>);
  private view = inject(ViewContainerRef);
  private authAPIService = inject(AuthAPIService);

  ngOnInit(): void {
    this.authAPIService.user
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user?.role === this.hasRole) {
          this.view.createEmbeddedView(this.template);
        } else {
          this.view.clear();
        }
      });
  }

  ngOnDestroy() {
    // this.destroy$.next();
    this.destroy$.complete();
  }
}
