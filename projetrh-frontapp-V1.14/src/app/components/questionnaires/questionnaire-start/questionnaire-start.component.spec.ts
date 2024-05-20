import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireStartComponent } from './questionnaire-start.component';

describe('QuestionnaireStartComponent', () => {
  let component: QuestionnaireStartComponent;
  let fixture: ComponentFixture<QuestionnaireStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionnaireStartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionnaireStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
