import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { OnlineOffersService } from '../online-offers.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { SnotifyService } from 'ng-snotify';
import { ModalService } from 'src/app/main/_modal';

@Component({
  selector: 'app-offer-overview',
  templateUrl: './offer-overview.component.html',
  styleUrls: ['./offer-overview.component.scss']
})
export class OfferOverviewComponent implements OnInit {
  offerId: any;
  offerObj: any;
  clickUsersObj: any = [];
  constants: any = CONSTANTS;
  isLoading: boolean = false;
  isDeleteLoading: boolean = false;
  tAndc: boolean = false;
  tAndc1: boolean = false;
  tAndc2: boolean = false;


  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _onlineOffersService: OnlineOffersService,
    private _globalFunctions: GlobalFunctions,
    private _clipboard: Clipboard,
    private _sNotify: SnotifyService,
    private _modalService: ModalService,
  ) { }

  ngOnInit(): void {
    this.offerId = this._activatedRoute.snapshot.paramMap.get('id');
    // this._router.events.subscribe((event: NavigationEvent) => {
    //   if (event instanceof NavigationStart) {
    //     setTimeout(() => {
    //       const accessToken: any = localStorage.getItem('accessToken');
    //       if (accessToken && accessToken != '') {
    //         this.offerId = this._activatedRoute.snapshot.paramMap.get('id');
    //         this.getOnlineShopOfferByOfferId(this.offerId);
    //       }
    //     }, 0);
    //   }
    // });
    this.getOnlineShopOfferByOfferId(this.offerId);
  }
  overview: boolean = true;
  reviews: boolean = false;
  onTabChange(tabVarName: any): void {
    this.overview = this.reviews = false;
    if (tabVarName == 'overview') {
      this.overview = true;
    } else if (tabVarName == 'reviews') {
      this.reviews = true;
    }
  }


  copyLink(copyText: any) {
    this._clipboard.copy(copyText);
    this._sNotify.success('Link Copied.');
  }

  editOffer(event: any, offerId: any): void {
    event.stopPropagation();
    localStorage.setItem('oOId', offerId);
    this._router.navigate(['/online-offers/create-offer']);
  }

  getOnlineShopOfferByOfferId(offerId: any = ''): void {
    this.isLoading = true;
    this._onlineOffersService.getOnlineOfferById(offerId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.offerObj = result.Data
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
    this._router.navigate(['/notifications']);
  }

  offerLive(event: any, offerObj: any): void {
    event.stopPropagation();
    this._sNotify.clear();
    this.isLoading = true;
    this._onlineOffersService.onOff(offerObj._id).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const tmpEvents = this._globalFunctions.copyObject(this.offerObj);
        tmpEvents.is_live = event.target.checked;
        this.offerObj = this._globalFunctions.copyObject(tmpEvents);
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


  userClick(shortUrl: any = ''): void {
    // this.isLoading = true;
    // this._onlineOffersService.clickList('47LWZA1K6Z').subscribe((result: any) => {
    this._onlineOffersService.clickList(shortUrl).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.clickUsersObj = result?.Data || [];
        this._modalService.open("clickUserList");
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this._modalService.close("clickUserList");
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this._modalService.close("clickUserList");
    });
  }
  clickPopClose(): void {
    this._modalService.close("clickUserList");
    this.clickUsersObj = [];
  }

  // Delete Online Offer
  deletePop(): void {
    this._modalService.open("delete-offer-pop");
  }
  close(): void {
    this._modalService.close("delete-offer-pop");
  }
  deleteEvent(): void {
    // Open delete confirmation popup
    this.isDeleteLoading = true;
    this._onlineOffersService.removeOnlineOfferById(this.offerId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this._router.navigate(['/online-offers']);
        this.isDeleteLoading = false;
        this._modalService.close("delete-offer-pop");
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isDeleteLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isDeleteLoading = false;
    });
  }

}
