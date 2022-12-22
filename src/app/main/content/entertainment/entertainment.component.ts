import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANTS } from '../../common/constants';
import { GlobalFunctions } from '../../common/global-functions';
import { ModalService } from '../../_modal';
import { EntertainmentService } from './entertainment.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-entertainment',
  templateUrl: './entertainment.component.html',
  styleUrls: ['./entertainment.component.scss']
})
export class EntertainmentComponent implements OnInit {
  constants = CONSTANTS;
  allEntertainmentPhotosAndVideosList: any = [];
  entertainmentArrObj: any = {};
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
      if (result && result.IsSuccess) {
        this.allEntertainmentPhotosAndVideosList = this._globalFunctions.copyObject(result?.Data || []);
        this.entertainmentArrObj = _.mapValues(_.groupBy(this.allEntertainmentPhotosAndVideosList, 'media'));

        console.log(this.allEntertainmentPhotosAndVideosList);
        console.log(this.entertainmentArrObj.photo);
        console.log(this.entertainmentArrObj.video);
        this.isLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
      }
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
