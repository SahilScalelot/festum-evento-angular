import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionStepComponent } from './permission-step.component';

describe('PermissionStepComponent', () => {
  let component: PermissionStepComponent;
  let fixture: ComponentFixture<PermissionStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionStepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
