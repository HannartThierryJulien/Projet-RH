import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAssignationComponent } from './test-assignation.component';

describe('TestAssignationComponent', () => {
  let component: TestAssignationComponent;
  let fixture: ComponentFixture<TestAssignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestAssignationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestAssignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
