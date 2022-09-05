import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionsStepComponent } from './terms-and-conditions-step.component';

describe('TermsAndConditionsStepComponent', () => {
  let component: TermsAndConditionsStepComponent;
  let fixture: ComponentFixture<TermsAndConditionsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsAndConditionsStepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsAndConditionsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
