import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, Event as NavigationEvent, NavigationEnd } from '@angular/router';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { EventService } from '../event.service';
import { MatAccordion } from '@angular/material/expansion';
import { ModalService } from 'src/app/main/_modal';


declare var $: any;

@Component({
  selector: 'app-event-overview',
  templateUrl: './event-overview.component.html',
  styleUrls: ['./event-overview.component.scss']
})
export class EventOverviewComponent implements OnInit {
  event: any = {};
  eventId: any = '';
  constants: any = CONSTANTS;
  isLoading: boolean = false;
  isExportLoading: boolean = false;
  isOpenPopup: boolean = false;
  isImage: boolean = false;
  companyIAndV: boolean = false;
  imagesOrVideosArr: Array<any> = [];
  attendees: Array<any> = [];
  cancelEventPop: boolean = false;
  tempEventData:any;

  isDeleteLoading: boolean = false;
  panelOpenState: boolean = false;

  overview: boolean = true;
  attendee: boolean = false;
  reviews: boolean = false;
  deposit: boolean = false;
  showMore: boolean = false;
  aboutevent: boolean = false;
  tandcShow: boolean = false;

  zoom: number = CONSTANTS.defaultMapZoom;
  // initial center position for the map
  lat: number = 0;
  lng: number = 0;
  isSingleVideo: boolean = false;
  visible: boolean = false;

  constructor(
    public _globalFunctions: GlobalFunctions,
    private _activatedRoute: ActivatedRoute,
    private _eventService: EventService,
    private _modalService: ModalService,
    private _router: Router,
  ) {
  }

  ngOnInit(): void {
    this.eventId = this._activatedRoute.snapshot.paramMap.get('id');
    this._router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          const accessToken: any = localStorage.getItem('accessToken');
          if (accessToken && accessToken != '') {
            this.eventId = this._activatedRoute.snapshot.paramMap.get('id');
            this.getEvent();
          }
        }, 0);
      }
    });
    this.getEvent();
  }

  toggleCollapse(): void {
    this.visible = !this.visible;
  }

  getEvent(): void {
    this.isLoading = true;
    this._eventService.getSingleEvents(this.eventId).subscribe((result: any) => {
      this.event = result.Data;

      setTimeout(() => {
        if (this.event.accept_booking && !this.event.iseditable) {
          this.getAttendees();
        }
        this._globalFunctions.loadAccordion();
        // this._globalFunctions.loadTabsJs();
        $('#rateYo').rateYo({
          rating: (this.event?.ratings || 0),
          readOnly: true,
          fullStar: true,
          starWidth: '25px',
          spacing: '3px',
          normalFill: '#ececec',
          ratedFill: '#fdd835'
        });
      }, 0);
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  liveEvent(event: any, eventObj: any): void {
    event.stopPropagation();
    if (eventObj.is_approved) {
      this.isLoading = true;
      this._eventService.liveEventById(eventObj._id).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          const tmpEvents = this._globalFunctions.copyObject(this.event);
          tmpEvents.is_live = event.target.checked;
          this.event = this._globalFunctions.copyObject(tmpEvents);
          this.isLoading = false;
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
          this.isLoading = false;
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isLoading = false;
      });
    }
  }

  onTabChange(tabVarName: any): void {
    this.overview = this.attendee = this.reviews = this.deposit = false;
    if (tabVarName == 'overview') {
      this.overview = true;
    } else if (tabVarName == 'attendee') {
      this.attendee = true;
    } else if (tabVarName == 'reviews') {
      this.reviews = true;
    } else if (tabVarName == 'deposit') {
      this.deposit = true;
    }
  }

  getAttendees(): void {
    // this.isLoading = true;
    const filterObj: any = {
      eventid: this.event._id,
      page: 1,
      limit: 10
    }
    this._eventService.getAttendeesByEventId(filterObj).subscribe((result: any) => {
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

  exportAttendees(): void {
    if (this.isExportLoading) {
      return;
    }
    this.isExportLoading = true;
    this._eventService.exportAttendees({ eventid: this.event._id }).subscribe((result: any) => {
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

  toggleAccordion(event: any, index: any): void {
    const element: any = event.target;
    const panel: any = element.nextElementSibling;

    if (panel && panel.style) {
      element.classList.toggle("active");
      this.attendees[index].isActive = !this.attendees[index].isActive;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    }
  }

  openImageAndVideoDialog(imagesOrVideosArr: Array<any>, isImage: boolean, companyIAndV: boolean, isSingleVideo: boolean = false): void {
    this.imagesOrVideosArr = imagesOrVideosArr;
    this.isImage = isImage;
    this.companyIAndV = companyIAndV;
    this.isSingleVideo = isSingleVideo;
    this.isOpenPopup = true;
  }

  closePop(flag: boolean = false): void {
    this.isOpenPopup = flag;
    this.cancelEventPop = false;
  }

  deletePop(): void {
    this.cancelEventPop = false;
    this._modalService.open("delete-event-pop");
  }

  close(): void {
    this.cancelEventPop = false;
    this._modalService.close("delete-event-pop");
  }

  editEvent(event: any, eventId: any): void {
    event.stopPropagation();
    localStorage.setItem('eId', eventId);
    this._router.navigate(['/events/create/add-event']);
  }

  cancelEventPopup(event: any): void {
    event.stopPropagation();
    this.cancelEventPop = true;
  }

  cancelEvent(eventId: any): void {
    this.isDeleteLoading = true;
    this.cancelEventPop = false;
    // this.isDeleteLoading = false;
  }

  gotoPromotion(event: any, eventId: any){
    event.stopPropagation();
    localStorage.setItem('eId', eventId);
    this._router.navigate(['/notifications']);
   
    
  }



}
