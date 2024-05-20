import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionTestManageComponent } from './question-test-manage.component';

describe('QuestionTestManageComponent', () => {
  let component: QuestionTestManageComponent;
  let fixture: ComponentFixture<QuestionTestManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionTestManageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionTestManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
