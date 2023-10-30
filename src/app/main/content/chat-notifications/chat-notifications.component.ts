import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CONSTANTS} from '../../common/constants';
import {GlobalFunctions} from '../../common/global-functions';
import {ChatNotificationsService} from './chat-notifications.service';

@Component({
  selector: 'app-chat-notifications',
  templateUrl: './chat-notifications.component.html',
  styleUrls: ['./chat-notifications.component.scss']
})
export class ChatNotificationsComponent implements OnInit {
  chatNotificationObj: any = [];
  constants: any = CONSTANTS;
  isLoading: boolean = false;
  paging: any;
  constructor(private _router: Router,
              private _globalFunctions: GlobalFunctions,
              private _chatNotificationsService: ChatNotificationsService) { }

  ngOnInit(): void {
    this.getChatNotificationList();
  }

  getChatNotificationList(event: any = {}): void {
    this.isLoading = true;
    const page = event ? (event.page + 1) : 1;
    const filter: any = {
          page: page || '1',
          limit: event?.rows || '10'
  };
    this._chatNotificationsService.getChatNotificationList(filter).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        console.log(result);
        this.chatNotificationObj = this._globalFunctions.copyObject(result.Data.docs);
        this.paging = result.Data;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

}
