import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { ModalService } from 'src/app/main/_modal';
import { OfflineShopsService } from '../../offline-shops.service';

@Component({
  selector: 'app-offer-overview',
  templateUrl: './offer-overview.component.html',
  styleUrls: ['./offer-overview.component.scss']
})
export class OfferOverviewComponent implements OnInit {
  constants: any = CONSTANTS;
  shopObj: any;
  offerObj: any;
  shopId: any;
  offerId: any;
  overview: boolean = true;
  attendee: boolean = false;
  reviews: boolean = false;
  popUp: boolean = false;
  isOpenAddEditOffer: boolean = false;
  isTAndC: boolean = false;
  isAddUserWiseOffers: boolean = false;
  isLoading: boolean = false;
  isDeleteLoading: boolean = false;
  weekdays: any = [
    { value: 'su' },
    { value: 'mo' },
    { value: 'tu' },
    { value: 'we' },
    { value: 'th' },
    { value: 'fr' },
    { value: 'sr' }
  ];

  constructor(
    private _modalService: ModalService,
    private _globalFunctions: GlobalFunctions,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _offlineShopsService: OfflineShopsService,
    private _activatedRoute: ActivatedRoute,
    private _sNotify: SnotifyService,
  ) { }

  ngOnInit(): void {
    this.shopId = this._activatedRoute.snapshot.paramMap.get('shopId');
    this.offerId = this._activatedRoute.snapshot.paramMap.get('offerId');
    this.getShopOfferById();
    this.getShopById();
  }

  getShopOfferById(): void {
    this.isLoading = true;
    const offerObj: any = {
      shopid : this.shopId || '',
      offlineofferid : this.offerId || '',
    };
    this._offlineShopsService.getOfflineOffer(offerObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.offerObj = result.Data;
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  getShopById(): void {
    this.isLoading = true;
    this._offlineShopsService.getOfflineShopByShopId(this.shopId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.shopObj = result.Data;
        this.weekdays = this.weekdays.map((dayObj: any) => {
          dayObj.isSelected = (this.shopObj.shop_days.indexOf(dayObj.value) != -1);
          return dayObj;
        });
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }
  
  openUploadVideoDialog(): void {
    this.popUp = true;    
  }
  
  closeDialog():void {
    this.popUp = false;
  }

  openAddEditOfferDialog(event: any): any {
    event.stopPropagation();
    this.isOpenAddEditOffer = true;
    this._modalService.open('offerDialog');
  }

  closeAddEditOfferFormEvent(isReload: any): any {
    if (isReload) {
      this.getShopOfferById();
    }
    this.isOpenAddEditOffer = false;
    this._modalService.close('offerDialog');
  }

  setFlags(flagObj: any): void {
    if (flagObj) {
      this.isTAndC = flagObj.isTAndC;
      this.isAddUserWiseOffers = flagObj.isAddUserWiseOffers;
    }
  }

  onTabChange(tabVarName: any): void {
    this.overview = this.attendee = this.reviews = false;
    if (tabVarName == 'overview') {
      this.overview = true;
    } else if (tabVarName == 'attendee') {
      this.attendee = true;
    } else if (tabVarName == 'reviews') {
      this.reviews = true;
    }
  }

  
  closeDeleteDialog(): void {
    this._modalService.close("delete-shop-offer-pop");
  }
  
  openOfflineShopsOffer(event: any): void {
    event.stopPropagation();
    this._modalService.open("delete-shop-offer-pop");
  }

  deleteOfflineShopsOffer(): void {
    this.isDeleteLoading = true;
    this._offlineShopsService.removeOfflineOffer(this.offerObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isDeleteLoading = false;
        this._sNotify.success(result.Message, 'Success');
        this.closeDeleteDialog();
        this._router.navigate(['/offline-shops/' + this.shopId]);
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
