import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';

import { CONSTANTS } from '../../common/constants';
import { GlobalFunctions } from '../../common/global-functions';
import { LandingPageService } from './landing-page.service';
import * as _ from 'lodash';

// import Swiper core and required modules
import SwiperCore, { Autoplay, Pagination, Navigation, SwiperOptions } from "swiper";
import { ModalService } from '../../_modal';

// install Swiper modules
SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})


export class LandingPageComponent implements OnInit {
  @ViewChild('queryNgForm') queryNgForm: any;

  queryForm: any;
  constants: any = CONSTANTS;
  isOpenDialog: boolean = false;
  isLoading: boolean = false;
  submit: boolean = false;

  upcomingEvents: boolean = false;
  upcomingOffers: boolean = false;
  upcomingLiveStream: boolean = false;

  upcomingEventList: any = [];
  upcomingOfferList: any = [];
  upcomingStreamList: any = [];
  videoObj: any = {};
  otherProjectConfig: SwiperOptions = {};
  config: SwiperOptions = {};

  constructor(
    private _renderer: Renderer2,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sNotify: SnotifyService,
    private _globalFunctions: GlobalFunctions,
    private _landingPageService: LandingPageService,
    private _modalService: ModalService,
  ) {
    const script = this._renderer.createElement('script');
    script.src = `./assets/js/landing-page/script.js`;
    this._renderer.appendChild(document.head, script);
   }

  ngOnInit(): void {
    this.config = {
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
          slidesPerView: 4,
        },
      },
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      autoplay: { delay: 2500, disableOnInteraction: false },
    };

    this._queryForm();
    this.upcomingEvents = true;
    this.getUpcomingEvents();
    this.getUpcomingOffers();
    this.getUpcomingStreams();
  }

  // On Click to scroll
  scrollToElement($element: any): void {
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  onSlideChange() {
    // console.log('slide change');
  }

  Dashboard(): void {
    window.location.href = '/login';
  }

  onTabChange(tabVarName: any): void {
    if (!this.upcomingEvents && tabVarName == 'Events') {
      this.upcomingEvents = true;
      this.upcomingOffers = this.upcomingLiveStream = false;
      // this.getUpcomingEvents();
    } else if (!this.upcomingOffers && tabVarName == 'Offers') {
      this.upcomingOffers = true;
      this.upcomingEvents = this.upcomingLiveStream = false;
      // this.getUpcomingOffers();
    } else if (!this.upcomingLiveStream && tabVarName == 'LiveStream') {
      this.upcomingLiveStream = true;
      this.upcomingEvents = this.upcomingOffers = false;
      // this.getUpcomingStreams();
    }
  }

  getUpcomingEvents(): void {
    this.isLoading = true;
    this._landingPageService.getUpcomingEvents().subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.upcomingEventList = result.Data;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  getUpcomingOffers(): void {
    this.isLoading = true;
    this._landingPageService.getUpcomingOffers().subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.upcomingOfferList = [];
        _.each(result.Data.offlineoffer, (offer: any) => {
          this.upcomingOfferList.push(offer);
        });
        _.each(result.Data.onlineoffer, (offer: any) => {
          this.upcomingOfferList.push(offer);
        });
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  getUpcomingStreams(): void {
    this.isLoading = true;
    this._landingPageService.getUpcomingStreams().subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.upcomingStreamList = result.Data;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  submitForm(): any {
    if (this.queryForm.invalid) {
      Object.keys(this.queryForm.controls).forEach((key) => {
        this.queryForm.controls[key].touched = true;
        this.queryForm.controls[key].markAsDirty();
      });
      return;
    }
    this.queryForm.disable();
    this._landingPageService.getInTouch(this.queryForm.value).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.queryForm.enable();
        this.queryNgForm.resetForm();
        this._sNotify.success('Form submitted Successfully!', 'Success');
      } else {
        this.queryForm.enable();
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error: any) => {
      this.queryForm.enable();
      this.queryNgForm.resetForm();
      this._globalFunctions.errorHanding(error, this, true);
    });
  }

  openVideoDialog(adGalleryObj: any = {}): void {
    this.videoObj = adGalleryObj;
    this.isOpenDialog = true;
  }

  closeVideoDialog(): void {
    this.isOpenDialog = false;
    this.videoObj = {};
  }

  private _queryForm(): void {
    this.queryForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      company_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      description: ['', [Validators.required]],
    });
  }


  tAndCPop(popId: any = ''): void {
    this._modalService.open(popId);
  }

  closePop(popId: any = ''): any {
    this._modalService.close(popId);
  }


}
