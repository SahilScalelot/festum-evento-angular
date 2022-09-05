import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDetailsStepComponent } from './company-details-step.component';

describe('CompanyDetailsStepComponent', () => {
  let component: CompanyDetailsStepComponent;
  let fixture: ComponentFixture<CompanyDetailsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyDetailsStepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyDetailsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
