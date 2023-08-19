import { Component, OnInit } from '@angular/core';
import { GlobalFunctions } from '../../common/global-functions';
import { OfflineShopsService } from './offline-shops.service';
import { CONSTANTS } from '../../common/constants';
import { ModalService } from '../../_modal';
import { Router } from "@angular/router";

@Component({
  selector: 'app-offline-shops',
  templateUrl: './offline-shops.component.html',
  styleUrls: ['./offline-shops.component.scss']
})
export class OfflineShopsComponent implements OnInit {
  shops: any = [];
  addShopObj: any = {};
  tmpShopObj: any = {};
  addShopForm: any;
  constants: any = CONSTANTS;
  isLoading: boolean = false;
  isDeleteLoading: boolean = false;
  weekDays: any = [];
  shopId: any = '';
  minDateValue: any = new Date();
  pageObj: any;
  offset: any = 1;
  isOpenAddEditShop: boolean = false;

  constructor(
    private _offlineShopsService: OfflineShopsService,
    private _globalFunctions: GlobalFunctions,
    private _modalService: ModalService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._globalFunctions.removeIdsFromLocalStorage();
    this.getOfflineShops();
  }

  closeAddEditFormEvent(isReload: any): any {
    if (isReload) {
      this.getOfflineShops();
    }
    this.isOpenAddEditShop = false;
    this._modalService.close('shopDialog');
  }

  getOfflineShops(shop: any = ''): void {
    this.isLoading = true;
    const page = shop ? (shop.page + 1) : 1;
    const filter: any = {
      page : page || '1',
      limit : shop?.rows || '10',
      search: ""
    };
    this._offlineShopsService.offlineShopList(filter).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.shops = this._globalFunctions.copyObject(result.Data.docs);
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

  openAddEditShopDialog(event: any, shopId: string = ''): void {
    event.stopPropagation();
    this.isOpenAddEditShop = true;
    this.shopId = shopId;
    this._modalService.open('shopDialog');
  }

  closeAddEditShopDialog(): void {
    this.isOpenAddEditShop = false;
  }

  gotoShopOverview(event: any, addShopObj: any): void {
    // event.stopPropagation();
    this._router.navigate(['/offline-shops/' + addShopObj._id]);
  }


  removeOfflineShops(shop: any = ''): void {
    this.isLoading = true;
    const page = shop ? (shop.page + 1) : 1;
    const filter: any = {
      page : page || '1',
      limit : shop?.rows || '10',
      search: ""
    };
  }

  openDeleteDialog(event: any, shopObj: any): void {
    event.stopPropagation();
    this.tmpShopObj = shopObj;
    this._modalService.open("delete-shop-pop");
  }

  closeDeleteDialog(): void {
    this.tmpShopObj = {};
    this._modalService.close("delete-shop-pop");
  }

  deleteOfflineShops(): void {
    // Open delete confirmation popup
    this.isDeleteLoading = true;
    this._offlineShopsService.removeOfflineShop(this.tmpShopObj._id).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.getOfflineShops();
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
  gotoPromotion(event: any, eventId: any){
    event.stopPropagation();
    localStorage.setItem('eId', eventId);
    this._router.navigate(['/notifications']);
  }
  
}