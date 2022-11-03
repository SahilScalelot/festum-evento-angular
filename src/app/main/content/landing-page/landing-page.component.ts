import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})


export class LandingPageComponent implements OnInit {
  @ViewChild('queryNgForm') queryNgForm: any;

  queryForm: any;
  submit: boolean = false;

  upcomingEvents: boolean = true;
  upcomingOffers: boolean = false;
  upcomingLiveStream: boolean = false;

  swiperSlider(): void {
  };
  
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

  constructor(
    private renderer: Renderer2,
    private _formBuilder: FormBuilder,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    const script = this.renderer.createElement('script');
    script.src = `./assets/js/landing-page/script.js`;
    this.renderer.appendChild(document.head, script);
    
    this._queryForm();
  }

  Dashboard(): void {
    window.location.href = '/login';
  }

  onTabChange(tabVarName: any): void {
    this.upcomingEvents = this.upcomingOffers = this.upcomingLiveStream = false;
    if (tabVarName == 'Events') {
      this.upcomingEvents = true;
    } else if (tabVarName == 'Offers') {
      this.upcomingOffers = true;
    } else if (tabVarName == 'LiveStream') {
      this.upcomingLiveStream = true;
    }
  }

  submitForm(): any {
    if (this.queryForm.invalid) {
      // this.queryForm.controls.markAsDirty();
      Object.keys(this.queryForm.controls).forEach((key) => {
        this.queryForm.controls[key].touched = true;
        this.queryForm.controls[key].markAsDirty();
      });
      return;
    }
    this.queryForm.disable();
    // this.queryNgForm.resetForm();
    console.log(this.queryForm.value);
  }

  private _queryForm(): void {
    this.queryForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      company: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      message: ['', [Validators.required]],
    });
  }

}
