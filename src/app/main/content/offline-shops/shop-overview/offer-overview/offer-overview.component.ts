import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
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
  offerdesc: boolean = false;
  tackt:boolean = false;
  offerId: any;
  attendees: any;
  isExportLoading: boolean = false;
  overview: boolean = true;
  attendee: boolean = false;
  reviews: boolean = false;
  popUp: boolean = false;
  isOpenAddEditOffer: boolean = false;
  isTAndC: boolean = false;
  isAddUserWiseOffers: boolean = false;
  isLoading: boolean = false;
  isDeleteLoading: boolean = false;
  isOpenPopup: boolean = false;
  isImage: boolean = false;
  companyIAndV: boolean = false;
  imagesOrVideosArr: Array<any> = [];
  obj:any =[];
  cancelEventPop: boolean = false;
  isSingleVideo: boolean = false;
  tempEventData:any;
  video:any;
  weekDays: any = [
    { value: 'su', label: 'Sun' },
    { value: 'mo', label: 'Mon' },
    { value: 'tu', label: 'Tue' },
    { value: 'we', label: 'Wed' },
    { value: 'th', label: 'Thu' },
    { value: 'fr', label: 'Fri' },
    { value: 'st', label: 'Sat' }
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
    // this._router.events.subscribe((event: NavigationEvent) => {
    //   if (event instanceof NavigationStart) {
    //     setTimeout(() => {
    //       const accessToken: any = localStorage.getItem('accessToken');
    //       if (accessToken && accessToken != '') {
    //         this.shopId = this._activatedRoute.snapshot.paramMap.get('shopId');
    //         this.offerId = this._activatedRoute.snapshot.paramMap.get('offerId');
    //         this.getShopOfferById();
    //         this.getShopById();
    //       }
    //     }, 0);
    //   }
    // });
    this.getShopOfferById();
    this.getShopById();
  }

  openImageAndVideoDialog(imagesOrVideosArr: Array<any>, isImage: boolean, companyIAndV: boolean, isSingleVideo: boolean = false): void {
    this.imagesOrVideosArr = imagesOrVideosArr;
    this.isImage = isImage;
    this.companyIAndV = companyIAndV;
    this.isSingleVideo = isSingleVideo;
    this.isOpenPopup = true;
  }
  gotoPromotion(event: any){
    event.stopPropagation();
    // localStorage.setItem('eId', shopId);
    this._router.navigate(['/notifications']);
   
    
  }

  closePop(flag: boolean = false): void {
    this.isOpenPopup = flag;
    this.cancelEventPop = false;
  }

  getShopOfferById(): void {
    this.isLoading = true;
    const offerObj: any = {
      shopid: this.shopId || '',
      offlineofferid: this.offerId || '',
    };
    this._offlineShopsService.getOfflineOffer(offerObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.offerObj = result.Data;
        this.obj = {url : this.offerObj.video}
        // this.video = JSON.parse(obj);
        console.log(this.obj);
        
        setTimeout(() => {
          this.getAttendees();
        }, 0);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  getAttendees(): void {
    // this.isLoading = true;
    const filterObj: any = {
      shopid: this.shopId,
      offlineofferid: this.offerId,
      page: 1,
      limit: 10
    }
    this._offlineShopsService.getAttendeesByEventId(filterObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.attendees = result.Data.docs;
        // this.isLoading = false;
      } else {
        // this._globalFunctions.successErrorHandling(result, this, true);
        // this.isLoading = false;
      }
    }, (error: any) => {
      // this._globalFunctions.errorHanding(error, this, true);
      // this.isLoading = false;
    });
  }

  getShopById(): void {
    this.isLoading = true;
    this._offlineShopsService.getOfflineShopByShopId(this.shopId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.shopObj = result.Data;
        this.weekDays = this.weekDays.map((dayObj: any) => {
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

  closeDialog(): void {
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

  exportAttendees(): void {
    if (this.isExportLoading) {
      return;
    }
    this.isExportLoading = true;

    const ids: any = {
      shopid: this.shopId,
      offlineofferid: this.offerId,
    }
    this._offlineShopsService.exportAttendees(ids).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        window.open(result.Data, '_blank');
        this.isExportLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isExportLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isExportLoading = false;
    });
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

  backRouter(): void {
    this._router.navigate(['/offline-shops/' + this.shopId]);
  }

}
