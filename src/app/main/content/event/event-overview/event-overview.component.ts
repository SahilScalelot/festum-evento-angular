import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CONSTANTS} from 'src/app/main/common/constants';
import {GlobalFunctions} from 'src/app/main/common/global-functions';
import {EventService} from '../event.service';

declare var $: any;

@Component({
  selector: 'app-event-overview',
  templateUrl: './event-overview.component.html',
  styleUrls: ['./event-overview.component.scss']
})
export class EventOverviewComponent implements OnInit {
  events: any = [];
  constants: any = CONSTANTS;
  isLoading: boolean = false;
  isOpenPopup: boolean = false;
  isImage: boolean = false;
  imagesOrVideosArr: Array<any> = [];

  constructor(
    private _eventService: EventService,
    public _globalFunctions: GlobalFunctions,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.getEvent();
  }

  getEvent(): void {
    this.isLoading = true;
    const eventId = this._activatedRoute.snapshot.paramMap.get('id');
    this._eventService.retrieveEventsId(eventId).subscribe((result: any) => {
      this.events = result.events;
      setTimeout(() => {
        this._globalFunctions.loadAccordion();
        this._globalFunctions.loadTabsJs();
      }, 0);
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  openImageAndVideoDialog(imagesOrVideosArr: Array<any>, isImage: boolean): void {
    this.imagesOrVideosArr = imagesOrVideosArr;
    this.isImage = isImage;
    this.isOpenPopup = true;
  }

  closePop(flag: boolean): void {
    this.isOpenPopup = flag;
  }

}
