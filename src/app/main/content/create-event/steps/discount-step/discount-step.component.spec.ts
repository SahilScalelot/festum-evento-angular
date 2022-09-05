import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountStepComponent } from './discount-step.component';

describe('DiscountStepComponent', () => {
  let component: DiscountStepComponent;
  let fixture: ComponentFixture<DiscountStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountStepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
