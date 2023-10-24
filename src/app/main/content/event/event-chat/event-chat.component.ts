import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
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
  @ViewChild('scrollMessage') private messageScrollContainer: any;
  @ViewChild('messageInput') messageInput: any;

  constants: any = CONSTANTS;
  isLoadingUser: boolean = false;
  isLoadingMessages: boolean = false;
  isLoading: boolean = false;
  eventId: any = '';
  users: any = [];
  messages: any = [];
  selectedIndex: number | null = null;
  selectedUser: any = {};

  showEmojiPicker: boolean = false;

  currentPage: number = 1;
  pageSize: number = 20;
  hasMoreRecords: boolean = true;

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

  formatDate(timestamp: number): any {
    if (timestamp) {
      const currentDate = new Date();
      const targetDate = new Date(timestamp);

      const timeDifference = currentDate.getTime() - targetDate.getTime();

      const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));
      const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
      const weeks = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7));
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor(timeDifference / (1000 * 60));
      const seconds = Math.floor(timeDifference / 1000);

      if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''} ago`;
      } else if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''} ago`;
      } else if (weeks > 0) {
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
      } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
      } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else {
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
      }
    }
    //return this.datePipe.transform(timestamp, 'yyyy-MM-dd HH:mm:ss');
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
        this.messages = result.Data.docs;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoadingMessages = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoadingMessages = false;
    });
  }

  blockUser(user: any) {
    this.isLoading = true;
    const data: any = {
        eventid : this.eventId,
        userid : user?.userid?._id
    };
    this._eventService.blockChatUser(data).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        console.log(result);
        this.isLoading = false;
        this.selectedUser.blockthisuserforchat = !this.selectedUser.blockthisuserforchat;
        this._sNotify.success(result.Message, 'Success');
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    let message = '';
    if (this.messageInput.nativeElement.value && this.messageInput.nativeElement.value != '') {
      message = this._globalFunctions.copyObject(this.messageInput.nativeElement.value);
    }
    const text = `${message}${event.emoji.native}`;
    this.messageInput.nativeElement.value = text;
    // this.showEmojiPicker = false;
  }

  onFocus() {
    this.showEmojiPicker = false;
  }
  onBlur() {
    this.showEmojiPicker = false;
  }

  sendChatMessage(message: any = ''): void {
    if (message && message != '' && message.trim() != '') {
      this.isLoading = true;
      const data: any = {
        eventid: this.eventId,
        userid: this.selectedUser.userid._id,
        message: message.trim(),
        file: ""
      };
      this._eventService.sendChatMessage(data).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          console.log(result?.Data);
          this.messages.push(result?.Data);
          this.messageInput.nativeElement.value = "";
          this.isLoading = false;
          setTimeout(() => {
            this.scrollToBottom();
            this._sNotify.success(result?.Message, 'Success');
          }, 0);
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

  scrollToBottom(): void {
    try {
      this.messageScrollContainer.nativeElement.scrollTop = this.messageScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
