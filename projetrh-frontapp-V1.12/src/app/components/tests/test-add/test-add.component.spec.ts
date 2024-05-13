import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAddComponent } from './test-add.component';

describe('TestAddComponent', () => {
  let component: TestAddComponent;
  let fixture: ComponentFixture<TestAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
