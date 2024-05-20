import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsCandidateComponent } from './results-candidate.component';

describe('ResultsCandidateComponent', () => {
  let component: ResultsCandidateComponent;
  let fixture: ComponentFixture<ResultsCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultsCandidateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultsCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
