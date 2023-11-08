import { Component, OnInit, OnDestroy, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { GlobalFunctions } from '../../common/global-functions';
import { OfflineShopsService } from './offline-shops.service';
import { CONSTANTS } from '../../common/constants';
import { ModalService } from '../../_modal';
import { Router } from "@angular/router";
import { SnotifyService } from 'ng-snotify';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-offline-shops',
  templateUrl: './offline-shops.component.html',
  styleUrls: ['./offline-shops.component.scss']
})
export class OfflineShopsComponent implements OnInit, OnDestroy {
  shops: any = [];
  addShopObj: any = {};
  tmpShopObj: any = {};
  addShopForm: any;
  constants: any = CONSTANTS;
  isLoading: boolean = false;
  isDeleteLoading: boolean = false;
  successfully: boolean = false;
  weekDays: any = [];
  shopId: any = '';
  minDateValue: any = new Date();
  pageObj: any;
  offset: any = 1;
  isOpenAddEditShop: boolean = false;

  openPopUp: boolean = false;
  shareLink: string = `${window.location.origin}`;
  selectedEventId: string = '';
  fullShareLink: string = `${this.shareLink}/#/offline-shops/${this.selectedEventId}`;

  constructor(
    private _offlineShopsService: OfflineShopsService,
    private _globalFunctions: GlobalFunctions,
    private _modalService: ModalService,
    private _router: Router,
    private _sNotify:SnotifyService,
    private renderer: Renderer2,
    private _clipboard: Clipboard,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this._globalFunctions.removeIdsFromLocalStorage();
    this.getOfflineShops();
  }

  public loadJsScript(): HTMLScriptElement {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = '/assets/js/message-script.js';
    script.id = "messageScript";
    this.renderer.appendChild(this.document.body, script);
    return script;
  }

  closeAddEditFormEvent(isReload: any): any {
    this.isOpenAddEditShop = false;
    this._modalService.close('shopDialog');
    if (isReload) {
      this.getOfflineShops();
      this.successfully = true;
      this.loadJsScript();
      setTimeout(() => {
        this.successfully = false;
      }, 3000);
    }
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
  gotoPromotion(event: any, shopId: any){
    event.stopPropagation();
    localStorage.setItem('eId', shopId);
    this._router.navigate(['/promotions/'], { queryParams: {id: shopId, type: 'shop'}});
  }

  openSocailMediaPopUp(event:any, data?: any){
    event.stopPropagation();
    this.openPopUp = !this.openPopUp;
    console.log(data);
    
    this.selectedEventId = data?._id;
  }
  copyShareLink() {
    let copyText = `${this.shareLink}/#/offline-shops/${this.selectedEventId}`;
    this._clipboard.copy(copyText);
    this._sNotify.success('Link Copied.');
  }

  ngOnDestroy() {
    let elem = document.querySelector("#messageScript");
    if (elem) {
      document.querySelector("#messageScript").parentNode.removeChild(elem);
    }
  }
}