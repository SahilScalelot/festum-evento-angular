import { Component, OnInit, Renderer2 } from '@angular/core';

import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})


export class LandingPageComponent implements OnInit {

  config: SwiperOptions = {
    pagination: { 
      el: '.swiper-pagination', 
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
  };

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    const script = this.renderer.createElement('script');
    script.src = `./assets/js/landing-page/script.js`;
    this.renderer.appendChild(document.head, script);
  }

  Dashboard(): void {
    window.location.href = '/login';
  }

}
