import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import {Router, NavigationEnd, RouterModule} from '@angular/router';
import { of, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import {TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {AuthAPIService} from "../../services/API/authAPI.service";
import {NotificationService} from "../../services/notification.service";
import {ThemeToggleComponent} from "./theme-toggle/theme-toggle.component";
import {LanguageSelectorComponent} from "./language-selector/language-selector.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";

class MockAuthAPIService {
  user = of({ role: 'hrManager', email: 'test@domain.com' });
  isLogoutButtonClickable = of(true);
  logout() {}
}

class MockNotificationService {
  showError(message: string) {}
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockAuthAPIService: MockAuthAPIService;
  let mockNotificationService: MockNotificationService;
  let routerEventsSubject = new Subject<any>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterModule.forRoot([]),
        MatSlideToggleModule,
        MatIconModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatTooltipModule
      ],
      declarations: [ HeaderComponent, ThemeToggleComponent, LanguageSelectorComponent ],
      providers: [
        { provide: AuthAPIService, useClass: MockAuthAPIService },
        { provide: NotificationService, useClass: MockNotificationService },
        MockAuthAPIService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    mockAuthAPIService = TestBed.inject(MockAuthAPIService);
    mockNotificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display HR Manager links if user is HR Manager', () => {
    component.isHRManager = true;
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.nav-link'));
    expect(links.length).toBe(4); // Vérifiez qu'il y a 4 liens de navigation pour HR Manager
    expect(links[0].nativeElement.textContent).toContain('Questions');
    expect(links[1].nativeElement.textContent).toContain('Questionnaires');
    expect(links[2].nativeElement.textContent).toContain('Topics');
    expect(links[3].nativeElement.textContent).toContain('Tests');
  });

  it('should display Candidate links if user is Candidate', () => {
    component.isHRManager = false;
    component.isCandidate = true;
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.nav-link'));
    expect(links.length).toBe(1); // Vérifiez qu'il y a 1 lien de navigation pour Candidate
    expect(links[0].nativeElement.textContent).toContain('Dashboard');
  });

  it('should display login button if user is not authenticated', () => {
    component.isHRManager = false;
    component.isCandidate = false;
    component.isAuthPage = false;
    fixture.detectChanges();
    const loginButton = fixture.debugElement.query(By.css('button[routerLink="/auth"]'));
    expect(loginButton).toBeTruthy();
    expect(loginButton.nativeElement.textContent).toContain('Login');
  });

  // it('should display user menu if user is authenticated', () => {
  //   component.isHRManager = true;
  //   component.isCandidate = false;
  //   component.username = 'testuser';
  //   fixture.detectChanges();
  //   const userMenuButton = fixture.debugElement.query(By.css('.mat-menu-trigger'));
  //   expect(userMenuButton).toBeTruthy();
  //   expect(userMenuButton.nativeElement.textContent).toContain('testuser');
  // });

  // it('should logout when logout button is clicked', () => {
  //   spyOn(mockAuthAPIService, 'logout').and.callThrough();
  //   component.isHRManager = true;
  //   component.isCandidate = false;
  //   fixture.detectChanges();
  //   const logoutButton = fixture.debugElement.query(By.css('button[mat-menu-item]'));
  //   logoutButton.nativeElement.click();
  //   expect(mockAuthAPIService.logout).toHaveBeenCalled();
  // });

});
