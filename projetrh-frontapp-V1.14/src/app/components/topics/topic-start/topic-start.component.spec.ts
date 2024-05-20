import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicStartComponent } from './topic-start.component';

describe('TopicStartComponent', () => {
  let component: TopicStartComponent;
  let fixture: ComponentFixture<TopicStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopicStartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopicStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
