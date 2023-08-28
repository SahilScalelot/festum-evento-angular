import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastStreamSettingsComponent } from './broadcast-stream-settings.component';

describe('BroadcastStreamSettingsComponent', () => {
  let component: BroadcastStreamSettingsComponent;
  let fixture: ComponentFixture<BroadcastStreamSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BroadcastStreamSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BroadcastStreamSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
