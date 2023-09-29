import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { LiveStreamService } from '../live-stream.service';
import { GlobalService } from 'src/app/services/global.service';
import { ModalService } from 'src/app/main/_modal';
import { SnotifyService } from 'ng-snotify';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-stream-overview',
  templateUrl: './stream-overview.component.html',
  styleUrls: ['./stream-overview.component.scss']
})
export class StreamOverviewComponent implements OnInit {
  liveStreamObj: any = [];
  constants: any = CONSTANTS;
  isLoading: boolean = false;
  isExportLoading: boolean = false;
  isOpenPopup: boolean = false;
  cancelLiveStreamPop: boolean = false;
  isImage: boolean = false;
  isSingleVideo: boolean = false;
  companyIAndV: boolean = false;
  imagesOrVideosArr: Array<any> = [];

  overview: boolean = true;
  attendee: boolean = false;
  reviews: boolean = false;
  aboutLivestream: boolean = false;
  showMore: boolean = false;
  termsShow: boolean = false;
  subscription: boolean = false;
  isDeleteLoading: boolean = false;
  userObj: any = {};

  openPopUp: boolean = false;
  shareLink: string = `${window.location.origin}`;
  selectedLiveStreamId: string = '';
  fullShareLink: string = `${this.shareLink}/#/live-stream/${this.selectedLiveStreamId}`;

  zoom: number = CONSTANTS.defaultMapZoom;
  // initial center position for the map
  lat: number = 0;
  lng: number = 0;

  constructor(
    public _globalFunctions: GlobalFunctions,
    private _activatedRoute: ActivatedRoute,
    private _globalService: GlobalService,
    private _modalService: ModalService,
    private _router: Router,
    private _liveStreamService: LiveStreamService,
    private _sNotify: SnotifyService,
    private _clipboard: Clipboard
  ) {
  }

  ngOnInit(): void {
    // this._router.events.subscribe((event: NavigationEvent) => {
    //   if (event instanceof NavigationStart) {
    //     setTimeout(() => {
    //       const accessToken: any = localStorage.getItem('accessToken');
    //       if (accessToken && accessToken != '') {
    //         this.getLiveStreamObj();
    //       }
    //     }, 0);
    //   }
    // });
    this._globalService.loginUser$.subscribe((user: any) => {
      this.isLoading = true;
      if (user) {
        this.userObj = user;
        this.isLoading = false;
      }
    });
    this.getLiveStreamObj();
  }

  goLive(event: any, liveStreamObj: any = {}): void {
    event.stopPropagation();
    this._router.navigate(['/live-stream/broadcast/'+ liveStreamObj._id])
    // if (liveStreamObj && liveStreamObj.is_approved) {
    //   const link = document.createElement('a');
    //   link.target = '_blank';
    //   link.href = liveStreamObj.media_content_link + this.userObj._id;
    //   link.setAttribute('visibility', 'hidden');
    //   link.click();
    // }
  }

  getLiveStreamObj(): void {
    this.isLoading = true;
    const liveStreamId = this._activatedRoute.snapshot.paramMap.get('id');
    this._liveStreamService.getLiveStreamById(liveStreamId).subscribe((result: any) => {
      this.liveStreamObj = result.Data;
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

  onTabChange(tabVarName: any): void {
    this.overview = this.attendee = this.reviews = this.subscription = false;
    if (tabVarName == 'overview') {
      this.overview = true;
    } else if (tabVarName == 'attendee') {
      this.attendee = true;
    } else if (tabVarName == 'reviews') {
      this.reviews = true;
    } else if (tabVarName == 'subscription') {
      this.subscription = true;
    }
  }

  exportAttendees(): void {
    // if (this.isExportLoading) {
    //   return;
    // }
    // this.isExportLoading = true;
    // this._liveStreamService.exportAttendees({livestreamid: this.liveStreamObj._id}).subscribe((result: any) => {
    //   if (result && result.IsSuccess) {
    //     window.open(result.Data, '_blank');
    //     this.isExportLoading = false;
    //   } else {
    //     this._globalFunctions.successErrorHandling(result, this, true);
    //     this.isExportLoading = false;
    //   }
    // }, (error: any) => {
    //   this._globalFunctions.errorHanding(error, this, true);
    //   this.isExportLoading = false;
    // });
  }

  openImageAndVideoDialog(imagesOrVideosArr: Array<any>, isImage: boolean, companyIAndV: boolean, isSingleVideo: boolean = false): void {
    this.imagesOrVideosArr = imagesOrVideosArr;
    this.isImage = isImage;
    this.companyIAndV = companyIAndV;
    this.isSingleVideo = isSingleVideo;
    this.isOpenPopup = true;
  }

  closePop(flag: boolean): void {
    this.isOpenPopup = flag;
  }

  editEvent(event: any, liveStreamId: any): void {
    event.stopPropagation();
    localStorage.setItem('lsId', liveStreamId);
    this._router.navigate(['/live-stream/create/stream']);
  }
  gotoPromotion(event: any, liveStreamId: any){
    event.stopPropagation();
    localStorage.setItem('eId', liveStreamId);
    this._router.navigate(['/notifications']);


  }

  cancelLiveStreamPopup(event: any): void {
    event.stopPropagation();
    this.cancelLiveStreamPop = true;
  }
  closeLiveStreamCancelPopup() {
    this.cancelLiveStreamPop = false;
  }
  deletePop(): void {
    this.cancelLiveStreamPop = false;
    this._modalService.open("delete-livestream-pop");
  }
  closeCancelLiveStream(): void {
    this.cancelLiveStreamPop = false;
    this._modalService.close("delete-livestream-pop");
  }
  cancelLiveStream(liveStreamId: any): void {
    this.isDeleteLoading = true;
    this.cancelLiveStreamPop = false;
    // this.isDeleteLoading = false;
  }
  openSocailMediaDailog(event:any, data?: any){
    event.stopPropagation();
    this.openPopUp = !this.openPopUp;
    this.selectedLiveStreamId = data?._id;
  }
  copyShareLink() {
    let copyText = `${this.shareLink}/#/events/${this.selectedLiveStreamId}`;
    this._clipboard.copy(copyText);
    this._sNotify.success('Link Copied.');
  }
}
