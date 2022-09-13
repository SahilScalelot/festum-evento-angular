import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { EventService } from '../event.service';

declare var $: any;

@Component({
  selector: 'app-event-overview',
  templateUrl: './event-overview.component.html',
  styleUrls: ['./event-overview.component.scss']
})
export class EventOverviewComponent implements OnInit {
  
  events: any = [];
  constants: any = CONSTANTS;

  constructor(
    private _eventService: EventService,
    public _globalFunctions: GlobalFunctions,
    private _router: Router,
    private _aRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this._globalFunctions.loadAccordion();
    
    $('.teb-holder button').click(function (e: any) {
      var tab_id = $(e.target).attr('data-tab');
      $('.teb-holder button').removeClass('active');
      $('.tab-main').removeClass('active');
      $(e.target).addClass('active');
      $("#" + tab_id).addClass('active');
    });
    
    // console.log(this._router.url);

    
    this.getEvent();
  }
  
  getEvent(): void {
    const eventId = this._aRoute.snapshot.paramMap.get('id');
    this._eventService.retrieveEventsId(eventId).subscribe((result: any) => {
      this.events = result.events;      
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
    });
  }

}
