import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuySpacePlansComponent } from './buy-space-plans.component';

describe('BuySpacePlansComponent', () => {
  let component: BuySpacePlansComponent;
  let fixture: ComponentFixture<BuySpacePlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuySpacePlansComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuySpacePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
