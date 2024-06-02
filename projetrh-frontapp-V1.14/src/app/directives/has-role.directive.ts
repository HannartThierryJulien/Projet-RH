import {Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {AuthAPIService} from "../services/API/authAPI.service";

/**
 * Directive not used for the moment (at 01/06/2024), but can be use to hide element from tempalate depending of the user role.
 */
@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnInit, OnDestroy {
  private template = inject(TemplateRef<unknown>);
  private view = inject(ViewContainerRef);
  private authAPIService = inject(AuthAPIService);

  @Input() hasRole!: 'hrManager' | 'candidate';
  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    // Retrieve logged user
    this.authAPIService.user
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        // Check if user's role matches the specified role
        if (user?.role === this.hasRole) {
          // If matched, create embedded view (= insert template content into the DOM)
          this.view.createEmbeddedView(this.template);
        } else {
          // If not matches, clear the view (= remove template content from the DOM)
          this.view.clear();
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  
}
