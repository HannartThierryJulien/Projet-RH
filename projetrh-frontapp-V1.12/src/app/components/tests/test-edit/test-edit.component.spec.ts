import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEditComponent } from './test-edit.component';

describe('TestEditComponent', () => {
  let component: TestEditComponent;
  let fixture: ComponentFixture<TestEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
