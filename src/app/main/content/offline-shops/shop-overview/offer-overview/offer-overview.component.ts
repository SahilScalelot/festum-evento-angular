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
  // Loadings
  isLoading: boolean = false;

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
    const offerId: any = {
      shopid : this.shopId || '',
      offlineofferid : this.offerId || '',
    };
    this._offlineShopsService.getOfflineOffer(offerId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        console.log(result.Data);
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

  
  openUploadVideoDialog(popId: string = ''): void {
    this._modalService.open(popId);
  }

}
