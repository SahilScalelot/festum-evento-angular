import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {CONSTANTS} from "../../common/constants";
import {OnlineOffersService} from "./online-offers.service";
import {GlobalFunctions} from "../../common/global-functions";

@Component({
  selector: 'app-online-offers',
  templateUrl: './online-offers.component.html',
  styleUrls: ['./online-offers.component.scss']
})
export class OnlineOffersComponent implements OnInit {
  shopOffers: any = [];
  constants: any = CONSTANTS;
  isLoading: boolean = false;
  pageObj: any;

  constructor(
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _onlineOffersService: OnlineOffersService,
  ) { }

  ngOnInit(): void {
    localStorage.removeItem('oOId');
    localStorage.removeItem('eId');
    this.getOnlineShopOffers();
  }

  getOnlineShopOffers(event: any = {}): void {
    this.isLoading = true;
    const page = (event && event.page) ? (event.page + 1) : 1;
    const filter: any = {
      page : page || '1',
      limit : event?.rows || '4',
      search: ""
    };
    this._onlineOffersService.onlineOffersList(filter).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.shopOffers = this._globalFunctions.copyObject(result.Data.docs);
        this.pageObj = this._globalFunctions.copyObject(result.Data);
        delete this.pageObj.docs;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  editOffer(event: any, offerId: any): void {
    event.stopPropagation();
    localStorage.setItem('oOId', offerId);
    this._router.navigate(['/online-offers/create-offer']);
  }
  
  offerOverview(event: any, offerObj: any): void {
    event.stopPropagation();
    this._router.navigate(['/online-offers/' + offerObj._id ]);
  }
}
