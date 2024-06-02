import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HamsterLoaderComponent } from './hamster-loader.component';

describe('LoaderComponent', () => {
  let component: HamsterLoaderComponent;
  let fixture: ComponentFixture<HamsterLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HamsterLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HamsterLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
