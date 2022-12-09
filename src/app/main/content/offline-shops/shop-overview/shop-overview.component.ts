import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { ModalService } from 'src/app/main/_modal';
import { ActivatedRoute, Router } from '@angular/router';
import { OfflineShopsService } from '../offline-shops.service';

@Component({
  selector: 'app-shop-overview',
  templateUrl: './shop-overview.component.html',
  styleUrls: ['./shop-overview.component.scss']
})
export class ShopOverviewComponent implements OnInit {
  constants: any = CONSTANTS;
  shopId: any;
  shopObj: any;
  lat: number = 0;
  lng: number = 0;
  zoom: number = CONSTANTS.defaultMapZoom;
  isTAndC: boolean = false;
  isAddUserWiseOffers: boolean = false;
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
  offerId: any;
  paging: any;
  shopOffer: any;
  minDateValue: any = new Date();
  overview: boolean = true;
  reviews: boolean = false;
  isOpenAddEditShop: boolean = false;
  isOpenAddEditOffer: boolean = false;

  constructor(
    private _modalService: ModalService,
    private _globalFunctions: GlobalFunctions,
    private _router: Router,
    private _offlineShopsService: OfflineShopsService,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.shopId = this._activatedRoute.snapshot.paramMap.get('shopId');
    this.offerId = this._activatedRoute.snapshot.paramMap.get('offerId');

    this.getShop();
    this.offlineShopOfferList();
  }

  getShop(): void {
    this.isLoading = true;
    this._offlineShopsService.getOfflineShopByShopId(this.shopId).subscribe((result: any) => {
      this.shopObj = result.Data;
      this.weekdays = this.weekdays.map((dayObj: any) => {
        dayObj.isSelected = (this.shopObj.shop_days.indexOf(dayObj.value) != -1);
        return dayObj;
      });
      setTimeout(() => {
        this._globalFunctions.loadAccordion();
        // this._globalFunctions.loadTabsJs();
      }, 0);
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  offlineShopOfferList(shop: any = ''): void {
    this.isLoading = true;
    const page = shop ? (shop.page + 1) : 1;
    const filter: any = {
      shopid : this.shopId || '',
      page : page || '1',
      limit : shop?.rows || '4',
      search: ""
    };
    this._offlineShopsService.offlineShopOfferList(filter).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.paging = result.Data;
        this.shopOffer = result.Data.docs;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  openAddEditShopDialog(event: any): void {
    event.stopPropagation();
    this.isOpenAddEditShop = true;
    this.shopId = this._globalFunctions.copyObject(this.shopObj?._id || '');
    this._modalService.open('shopDialog');
  }

  closeAddEditShopDialog(): void {
    this.isOpenAddEditShop = false;
  }

  closeAddEditFormEvent(isReload: any): any {
    if (isReload) {
      this.getShop();
      this.offlineShopOfferList();
    }
    this.isOpenAddEditShop = false;
    this._modalService.close('shopDialog');
  }

  openAddEditOfferDialog(event: any, offerId: any = ''): any {
    event.stopPropagation();
    this.isOpenAddEditOffer = true;
    this.offerId = offerId;
    this._modalService.open('offerDialog');
  }

  closeAddEditOfferFormEvent(isReload: any): any {
    if (isReload) {
      this.offlineShopOfferList();
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

  gotoShopOfferOverview(event: any, addShopObj: any, offerId: any): void {
    // event.stopPropagation();
    this._router.navigate(['/offline-shops/' + addShopObj + '/offer-overview/' + offerId._id]);
  }

  onTabChange(tabVarName: any): void {
    this.overview = this.reviews = false;
    if (tabVarName == 'overview') {
      this.overview = true;
    } else if (tabVarName == 'reviews') {
      this.reviews = true;
    }
  }
}
