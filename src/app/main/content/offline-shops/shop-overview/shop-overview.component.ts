import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { ModalService } from 'src/app/main/_modal';
import { ActivatedRoute, Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { OfflineShopsService } from '../offline-shops.service';
import { SnotifyService } from 'ng-snotify';
import * as _ from 'lodash';

@Component({
  selector: 'app-shop-overview',
  templateUrl: './shop-overview.component.html',
  styleUrls: ['./shop-overview.component.scss']
})
export class ShopOverviewComponent implements OnInit {
  constants: any = CONSTANTS;
  shopId: any;
  shopObj: any;
  tmpOfferObj: any;
  lat: number = 0;
  lng: number = 0;
  zoom: number = CONSTANTS.defaultMapZoom;
  isTAndC: boolean = false;
  isDeleteLoading: boolean = false;
  isAddUserWiseOffers: boolean = false;
  isLoading: boolean = false;
  weekDays: any = [
    { value: 'su', label: 'Sun' },
    { value: 'mo', label: 'Mon' },
    { value: 'tu', label: 'Tue' },
    { value: 'we', label: 'Wed' },
    { value: 'th', label: 'Thu' },
    { value: 'fr', label: 'Fri' },
    { value: 'st', label: 'Sat' }
  ];
  offerId: any;
  paging: any;
  shopOffer: any;
  minDateValue: any = new Date();
  overview: boolean = true;
  reviews: boolean = false;
  isOpenAddEditShop: boolean = false;
  isOpenAddEditOffer: boolean = false;
  isDeleteOffer: boolean = false;

  constructor(
    private _modalService: ModalService,
    private _globalFunctions: GlobalFunctions,
    private _router: Router,
    private _offlineShopsService: OfflineShopsService,
    private _activatedRoute: ActivatedRoute,
    private _sNotify: SnotifyService,
  ) { }


  testDesc: any;

  ngOnInit(): void {
    this.shopId = this._activatedRoute.snapshot.paramMap.get('shopId');
    this.offerId = this._activatedRoute.snapshot.paramMap.get('offerId');
    // this._router.events.subscribe((event: NavigationEvent) => {
    //   if (event instanceof NavigationStart) {
    //     setTimeout(() => {
    //       const accessToken: any = localStorage.getItem('accessToken');
    //       if (accessToken && accessToken != '') {
    //         this.shopId = this._activatedRoute.snapshot.paramMap.get('shopId');
    //         this.offerId = this._activatedRoute.snapshot.paramMap.get('offerId');
    //         this.getShop();
    //       }
    //     }, 0);
    //   }
    // });
    this.getShop();
  }

  getShop(): void {
    this.isLoading = true;
    this._offlineShopsService.getOfflineShopByShopId(this.shopId).subscribe((result: any) => {
      this.shopObj = result.Data;
      this.weekDays = this.weekDays.map((dayObj: any) => {
        dayObj.isSelected = (this.shopObj && this.shopObj.shop_days && this.shopObj.shop_days.indexOf(dayObj.value) != -1);
        return dayObj;
      });
      setTimeout(() => {
        this._globalFunctions.loadAccordion();
        // this._globalFunctions.loadTabsJs();
        this.offlineShopOfferList();
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
      shopid: this.shopId || '',
      page: page || '1',
      limit: shop?.rows || '10',
      search: ""
    };
    this._offlineShopsService.offlineShopOfferList(filter).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.paging = result.Data;
        this.shopOffer = result.Data.docs;

        _.each(this.shopOffer, (shopOffer: any) => {
          const offers = (shopOffer && shopOffer.all_product_conditions && shopOffer.all_product_conditions.length) ? shopOffer.all_product_conditions : shopOffer.offer_type_conditions || [];
          const maxPercentageOfferObj: any = _.maxBy(offers, (offerObj: any) => {
            if (offerObj.discount_type == 'percentage') {
              return offerObj.discount;
            }
          });
          const maxRupeeOfferObj: any = _.maxBy(offers, (offerObj: any) => {
            if (offerObj.discount_type == 'rupee') {
              return offerObj.discount;
            }
          });
          shopOffer.maxDiscountObj = (maxPercentageOfferObj && maxPercentageOfferObj.discount) ? maxPercentageOfferObj : maxRupeeOfferObj || {};
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

  openDeleteDialog(event: any, offerObj: any, isDeleteOffer: boolean = false): void {
    event.stopPropagation();
    this.isDeleteOffer = isDeleteOffer;
    if (isDeleteOffer) {
      this.tmpOfferObj = offerObj;
    }
    this._modalService.open("delete-shop-pop");
  }

  closeDeleteDialog(): void {
    this.tmpOfferObj = {};
    this._modalService.close("delete-shop-pop");
    this._modalService.close("delete-shop-offer-pop");
  }

  deleteOfflineShops(): void {
    this.isDeleteLoading = true;
    this._offlineShopsService.removeOfflineShop(this.shopId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this._router.navigate(['/offline-shops']);
        this.isDeleteLoading = false;
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

  openOfflineShopsOffer(event: any, offerObj: any, isDeleteOffer: boolean = false): void {
    event.stopPropagation();
    // this.isDeleteOffer = isDeleteOffer;
    this.tmpOfferObj = offerObj;
    this._modalService.open("delete-shop-offer-pop");
  }

  deleteOfflineShopsOffer(): void {
    this.isDeleteLoading = true;
    this._offlineShopsService.removeOfflineOffer(this.tmpOfferObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.offlineShopOfferList();
        this.isDeleteLoading = false;
        this._sNotify.success(result.Message, 'Success');
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
}
