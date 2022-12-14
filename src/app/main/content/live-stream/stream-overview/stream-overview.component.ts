import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { LiveStreamService } from '../live-stream.service';

@Component({
  selector: 'app-stream-overview',
  templateUrl: './stream-overview.component.html',
  styleUrls: ['./stream-overview.component.scss']
})
export class StreamOverviewComponent implements OnInit {
  liveStreamObj: any = [];
  constants: any = CONSTANTS;
  isLoading: boolean = false;
  isOpenPopup: boolean = false;
  isImage: boolean = false;
  companyIAndV: boolean = false;
  imagesOrVideosArr: Array<any> = [];

  overview: boolean = true;
  attendee: boolean = false;
  reviews: boolean = false;
  subscription: boolean = false;

  zoom: number = CONSTANTS.defaultMapZoom;
  // initial center position for the map
  lat: number = 0;
  lng: number = 0;

  constructor(
    public _globalFunctions: GlobalFunctions,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _liveStreamService: LiveStreamService,
  ) {
  }

  ngOnInit(): void {
    this.getLiveStreamObj();
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

  openImageAndVideoDialog(imagesOrVideosArr: Array<any>, isImage: boolean, companyIAndV: boolean): void {
    this.imagesOrVideosArr = imagesOrVideosArr;
    this.isImage = isImage;
    this.companyIAndV = companyIAndV;
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
}
