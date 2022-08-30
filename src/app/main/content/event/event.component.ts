import { Component, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { GlobalService } from 'src/app/services/global.service';
import { CONSTANTS } from '../../common/constants';
import { EventService } from './event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  events: any = [];
  constants: any = CONSTANTS;

  constructor(
    private _eventService: EventService,
    private _sNotify: SnotifyService,
    private _globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    this.getEvent();
  }

  getEvent(): void {
    this._eventService.retrieveEvents().subscribe((result: any) => {
      this.events = result.events;
      console.log(this.events);
      
    });
  }

}
