import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartTestsStatusComponent } from './chart-tests-status.component';

describe('ChartTestsStatusComponent', () => {
  let component: ChartTestsStatusComponent;
  let fixture: ComponentFixture<ChartTestsStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartTestsStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartTestsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
