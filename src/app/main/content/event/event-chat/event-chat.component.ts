import { Component, ElementRef, OnInit, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, NavigationStart, Event as NavigationEvent, NavigationEnd } from '@angular/router';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { EventService } from '../event.service';
import { ModalService } from 'src/app/main/_modal';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-event-chat',
  templateUrl: './event-chat.component.html',
  styleUrls: ['./event-chat.component.scss']
})
export class EventChatComponent implements OnInit {
  constants: any = CONSTANTS;
  isLoadingUser: boolean = false;
  isLoadingMessages: boolean = false;
  eventId: any = '';
  users: any = [];
  messages: any = [];
  selectedIndex: number | null = null;
  selectedUser: any = {};

  constructor(
      public _globalFunctions: GlobalFunctions,
      private _activatedRoute: ActivatedRoute,
      private _eventService: EventService,
      private datePipe: DatePipe,
      private _modalService: ModalService,
      private _router: Router,
      private elementRef: ElementRef,
      private _sNotify: SnotifyService
  ) { }

  ngOnInit(): void {
    this.eventId = this._activatedRoute.snapshot.paramMap.get('id');
    this.getEventUserList();
  }

  getEventUserList(event: any = ''): void {
    this.isLoadingUser = true;
    const page = event ? (event.page + 1) : 1;
    const filter: any = {
        eventid: this.eventId,
        page : page || '1',
        limit : event?.rows || '10',
        search: ""
    };
    this._eventService.getEventUserList(filter).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        console.log(result);
        this.users = result.Data;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoadingUser = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoadingUser = false;
    });
  }

  formatDate(timestamp: number): string {
    return this.datePipe.transform(timestamp, 'yyyy-MM-dd HH:mm:ss');
  }

  selectUser(index: number, user: any): void {
    this.selectedIndex = index;
    this.selectedUser = user;
    console.log(this.selectedUser);
    this.messages = [];
    this.getChatListForUser();
  }

  getChatListForUser(event: any = ''): void {
    this.isLoadingMessages = true;
    const page = event ? (event.page + 1) : 1;
    const data: any = {
         eventid: this.eventId,
         userid: this.selectedUser?.userid?._id,
         page : page || '1',
         limit : event?.rows || '10'
   };
    this._eventService.getChatMessagesByUser(data).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        console.log(result);
        this.messages = result.Data;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoadingMessages = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoadingMessages = false;
    });
  }
}
