import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTakeComponent } from './test-take.component';

describe('TestTakeComponent', () => {
  let component: TestTakeComponent;
  let fixture: ComponentFixture<TestTakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestTakeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestTakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
