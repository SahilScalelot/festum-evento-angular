import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosVideosStepComponent } from './photos-videos-step.component';

describe('PhotosVideosStepComponent', () => {
  let component: PhotosVideosStepComponent;
  let fixture: ComponentFixture<PhotosVideosStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotosVideosStepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotosVideosStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
