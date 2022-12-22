import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CONSTANTS } from '../../common/constants';
import { GlobalFunctions } from '../../common/global-functions';
import { ModalService } from '../../_modal';
import { EntertainmentService } from './entertainment.service';

@Component({
  selector: 'app-entertainment',
  templateUrl: './entertainment.component.html',
  styleUrls: ['./entertainment.component.scss']
})
export class EntertainmentComponent implements OnInit {
  constants = CONSTANTS;
  entertainmentObj: any;
  isLoading: boolean = false;

  all: boolean = true;
  images: boolean = false;
  videos: boolean = false;

  tmpEObj: any;

  constructor(
    public _globalFunctions: GlobalFunctions,
    private _entertainment: EntertainmentService,
    private _modalService: ModalService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.getEntertainment();
  }

  getEntertainment(): void {
    this.isLoading = true;
    this._entertainment.getEntertainmentApi().subscribe((result: any) => {
      this.entertainmentObj = result.Data;
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  openPop(event: any, entertainment: any = {}): void {
    this._modalService.open("detailPop");
    this.tmpEObj = entertainment;
    // this.tmpEObj = {};
  }

  openUrl(event: any, entertainment: any = {}): void {
    this.tmpEObj = entertainment;
    switch (entertainment.type) {
      case 'event':
        this._router.navigate(['/events/'+entertainment?._id]);
        break;
      case 'offlineoffer':
        this._router.navigate(['/offline-shops/'+entertainment?._id]);
        break;
      case 'onlineoffer':
        this._router.navigate(['/online-offers/'+entertainment?._id]);
        break;
      case 'livestream':
        this._router.navigate(['/live-stream/'+entertainment?._id]);
        break;
    }
  }

}
