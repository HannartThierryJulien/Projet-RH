import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionStartComponent } from './question-start.component';

describe('QuestionStartComponent', () => {
  let component: QuestionStartComponent;
  let fixture: ComponentFixture<QuestionStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionStartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
