import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAverageQuestionsResultsComponent } from './chart-average-questions-results.component';

describe('ChartAverageQuestionsResultsComponent', () => {
  let component: ChartAverageQuestionsResultsComponent;
  let fixture: ComponentFixture<ChartAverageQuestionsResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartAverageQuestionsResultsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartAverageQuestionsResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
