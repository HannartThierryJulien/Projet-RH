import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHrManagerComponent } from './dashboard-hr-manager.component';

describe('DashboardHrManagerComponent', () => {
  let component: DashboardHrManagerComponent;
  let fixture: ComponentFixture<DashboardHrManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardHrManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardHrManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
