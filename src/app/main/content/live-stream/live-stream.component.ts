import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANTS } from '../../common/constants';
import { GlobalFunctions } from '../../common/global-functions';
import { ModalService } from '../../_modal';
import { LiveStreamService } from './live-stream.service';

@Component({
  selector: 'app-live-stream',
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.scss']
})
export class LiveStreamComponent implements OnInit {
  liveStreamObj: any = [];
  constants: any = CONSTANTS;
  isLoading: boolean = false;
  paging: any;
  platformsArr: any = [];
  platformsId: any = '';
  tmpOfferObj: any = {};
  isDeleteLoading: boolean = false;

  constructor(
    private _router: Router,
    private _modalService: ModalService,
    private _globalFunctions: GlobalFunctions,
    private _liveStreamService: LiveStreamService,
  ) { }

  ngOnInit(): void {
    localStorage.removeItem('lsId');
    this.getLiveStreamObj();
  }

  getLiveStreamObj(event: any = {}): void {
    this.isLoading = true;
    const page = event ? (event.page + 1) : 1;
    const filter: any = {
      page : page || '1',
      limit : event?.rows || '4',
      search: ""
    };
    this._liveStreamService.liveStreamsList(filter).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.liveStreamObj = this._globalFunctions.copyObject(result.Data.docs);
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


  editLiveStream(event: any, liveStreamId: any): void {
    event.stopPropagation();
    localStorage.setItem('lsId', liveStreamId);
    this._router.navigate(['/live-stream/create/stream']);
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
    // this._onlineOffersService.removeOnlineOfferById(this.tmpOfferObj).subscribe((result: any) => {
    //   if (result && result.IsSuccess) {
    //     this.isDeleteLoading = false;
    //     this.getOnlineShopOffers();
    //     this.closeDeleteDialog();
    //   } else {
    //     this._globalFunctions.successErrorHandling(result, this, true);
    //     this.isDeleteLoading = false;
    //   }
    // }, (error: any) => {
    //   this._globalFunctions.errorHanding(error, this, true);
    //   this.isDeleteLoading = false;
    // });
  }
  
  liveStreamOverview(event: any, offerId: any): void {
    event.stopPropagation();
    this._router.navigate(['/online-offers/' + offerId]);
  }
  

}
