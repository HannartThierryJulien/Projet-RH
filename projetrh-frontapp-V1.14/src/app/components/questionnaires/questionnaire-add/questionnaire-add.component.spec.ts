import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireAddComponent } from './questionnaire-add.component';

describe('QuestionnaireAddComponent', () => {
  let component: QuestionnaireAddComponent;
  let fixture: ComponentFixture<QuestionnaireAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionnaireAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionnaireAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
