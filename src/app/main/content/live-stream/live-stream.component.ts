import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANTS } from '../../common/constants';
import { GlobalFunctions } from '../../common/global-functions';
import { ModalService } from '../../_modal';
import { LiveStreamService } from './live-stream.service';
import { GlobalService } from 'src/app/services/global.service';

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
  tmpLSObj: any = {};
  userObj: any = {};
  isDeleteLoading: boolean = false;
  isBroadCastEvent: boolean = false;

  constructor(
    private _router: Router,
    private _modalService: ModalService,
    private _globalService: GlobalService,
    private _globalFunctions: GlobalFunctions,
    private _liveStreamService: LiveStreamService,
  ) { }

  ngOnInit(): void {
    this._globalService.loginUser$.subscribe((user: any) => {
      this.isLoading = true;
      if (user) {
        this.userObj = user;
        this.isLoading = false;
      }
    });
    this._globalFunctions.removeIdsFromLocalStorage();
    this.getLiveStreamObj();
  }

  getLiveStreamObj(event: any = {}): void {
    this.isLoading = true;
    const page = event ? (event.page + 1) : 1;
    const filter: any = {
      page : page || '1',
      limit : event?.rows || '10',
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

  goLive(event: any, liveStreamObj: any = {}): void {
    event.stopPropagation();
    if (liveStreamObj && liveStreamObj.is_approved) {
      const link = document.createElement('a');
      link.target = '_blank';
      link.href = liveStreamObj.media_content_link + this.userObj._id;
      link.setAttribute('visibility', 'hidden');
      link.click();
    }
  }

  editLiveStream(event: any, liveStreamId: any): void {
    event.stopPropagation();
    localStorage.setItem('lsId', liveStreamId);
    this._router.navigate(['/live-stream/create/stream']);
  }
  gotoPromotion(event: any, eventId: any){
    event.stopPropagation();
    localStorage.setItem('eId', eventId);
    this._router.navigate(['/notifications']);
  }
  gotoDiscount(event: any, eventId: any): void{
    event.stopPropagation();
    localStorage.setItem('eId', eventId);
    this._router.navigate(['/events/create/discount']);
  }
  
  // Delete Live Stream
  openDeleteDialog(event: any, LiveStreamId: any): void {
    event.stopPropagation();
    this.tmpLSObj = LiveStreamId;
    this._modalService.open("delete-ls-pop");
  }

  closeDeleteDialog(): void {
    this.tmpLSObj = {};
    this._modalService.close("delete-ls-pop");
  }

  deleteLiveStream(): void {
    this.isDeleteLoading = true;
    this._liveStreamService.removeLiveStreamById(this.tmpLSObj._id).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.isDeleteLoading = false;
        this.getLiveStreamObj();
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
  
  liveStreamOverview(event: any, offerId: any): void {
    event.stopPropagation();
    this._router.navigate(['/live-stream/' + offerId]);
  }
  
  openBroadCastStream(event: any, liveEventId: any): void {
    event.stopPropagation();
    this._router.navigate(['/live-stream/broadcast/'+ liveEventId])
    // this.isBroadCastEvent = true;
    // console.log(liveEvent);
  }

  closePop(flag: boolean): void {
    this.isBroadCastEvent = false;
  
  }
}
