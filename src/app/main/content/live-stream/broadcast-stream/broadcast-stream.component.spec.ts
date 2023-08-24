import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastStreamComponent } from './broadcast-stream.component';

describe('BroadcastStreamComponent', () => {
  let component: BroadcastStreamComponent;
  let fixture: ComponentFixture<BroadcastStreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BroadcastStreamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BroadcastStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
