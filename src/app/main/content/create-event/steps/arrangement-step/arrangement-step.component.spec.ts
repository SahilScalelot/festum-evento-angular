import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrangementStepComponent } from './arrangement-step.component';

describe('ArrangementStepComponent', () => {
  let component: ArrangementStepComponent;
  let fixture: ComponentFixture<ArrangementStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrangementStepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrangementStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
