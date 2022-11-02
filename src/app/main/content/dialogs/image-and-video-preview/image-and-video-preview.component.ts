import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CONSTANTS } from 'src/app/main/common/constants';
declare var $:any;
declare var Swiper:any;
@Component({
  selector: 'app-image-and-video-preview',
  templateUrl: './image-and-video-preview.component.html',
  styleUrls: ['./image-and-video-preview.component.scss']
})
export class ImageAndVideoPreviewComponent implements OnInit {
  
  constants: any = CONSTANTS;
  @Input() expectedProp: any;
  @Input() isImageOrVideoFlag: boolean = false;
  @Output() openClosePopup = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
      // console.log(this.expectedProp);
      // console.log(this.isImageOrVideoFlag);
      // gallery slider 
      var galleryTop = new Swiper('.gallery-top', {
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        loop: false,
        loopedSlides: 4
      });
      var galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true,
        loop: false,
        loopedSlides: 4
      });
      galleryTop.controller.control = galleryThumbs;
      galleryThumbs.controller.control = galleryTop;
  }

  closePopup(): void {
    this.openClosePopup.emit(false);
  }
}
