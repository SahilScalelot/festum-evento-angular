import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {CONSTANTS} from "../../common/constants";
import {OnlineOffersService} from "./online-offers.service";
import {GlobalFunctions} from "../../common/global-functions";
import { ModalService } from '../../_modal';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-online-offers',
  templateUrl: './online-offers.component.html',
  styleUrls: ['./online-offers.component.scss']
})
export class OnlineOffersComponent implements OnInit {
  shopOffers: any = [];
  constants: any = CONSTANTS;
  isLoading: boolean = false;
  paging: any;
  platformsArr: any = [];
  platformsId: any = '';
  tmpOfferObj: any = {};
  isDeleteLoading: boolean = false;

  constructor(
    private _router: Router,
    private _sNotify: SnotifyService,
    private _modalService: ModalService,
    private _globalFunctions: GlobalFunctions,
    private _onlineOffersService: OnlineOffersService,
  ) { }

  ngOnInit(): void {
    this._globalFunctions.removeIdsFromLocalStorage();
    this.getPlatformList();
    this.getOnlineShopOffers();
  }

  getOnlineShopOffers(event: any = {}): void {
    this.isLoading = true;
    const page = event ? (event.page + 1) : 1;
    const filter: any = {
      page : page || '1',
      limit : event?.rows || '10',
      search: "",
      platform: this.platformsId || ""
    };
    this._onlineOffersService.onlineOffersList(filter).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.shopOffers = this._globalFunctions.copyObject(result.Data.docs);
        // this.paging = this._globalFunctions.copyObject(result.Data);
        this.paging = result.Data;
        // delete this.paging.docs;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  getPlatformList(): void {
    this.isLoading = true;
    this._onlineOffersService.getPlatformList().subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.platformsArr = result?.Data || {};
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

  gotoPromotion(event: any){
    event.stopPropagation();
    // localStorage.setItem('eId', eventId);
    this._router.navigate(['/promotions']);
  }

  offerLive(event: any, offerObj: any, index: number): void {
    event.stopPropagation();
    this._sNotify.clear();
    this.isLoading = true;
    this._onlineOffersService.onOff(offerObj._id).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const tmpEvents = this._globalFunctions.copyObject(this.shopOffers);
        tmpEvents[index].is_live = event.target.checked;
        this.shopOffers = this._globalFunctions.copyObject(tmpEvents);
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

  stopPropagation(event: any): void {
    event.stopPropagation();
  }

  editOffer(event: any, offerId: any): void {
    event.stopPropagation();
    localStorage.setItem('oOId', offerId);
    this._router.navigate(['/online-offers/create-offer']);
  }

  // Delete Online Offer
  openDeleteDialog(event: any, offerId: any): void {
    event.stopPropagation();
    this.tmpOfferObj = offerId;
    this._modalService.open("delete-shop-pop");
  }

  closeDeleteDialog(): void {
    this.tmpOfferObj = {};
    this._modalService.close("delete-shop-pop");
  }

  deleteOfflineShops(): void {
    this.isDeleteLoading = true;
    this._onlineOffersService.removeOnlineOfferById(this.tmpOfferObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isDeleteLoading = false;
        this.getOnlineShopOffers();
        this.closeDeleteDialog();
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isDeleteLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isDeleteLoading = false;
    });
  }
  
  offerOverview(event: any, offerId: any): void {
    event.stopPropagation();
    this._router.navigate(['/online-offers/' + offerId]);
  }
}
