import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTakeConfirmationComponent } from './test-take-confirmation.component';

describe('TestTakeConfirmationComponent', () => {
  let component: TestTakeConfirmationComponent;
  let fixture: ComponentFixture<TestTakeConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestTakeConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestTakeConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
