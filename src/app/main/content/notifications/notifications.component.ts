import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CONSTANTS} from '../../common/constants';
import {GlobalFunctions} from '../../common/global-functions';
import {NotificationsService} from './notifications.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
    notificationObj: any = [];
    constants: any = CONSTANTS;
    isLoading: boolean = false;
    paging: any;

    constructor(private _router: Router,
                private _globalFunctions: GlobalFunctions,
                private _notificationsService: NotificationsService) {
    }

    ngOnInit(): void {
        this.getNotificationList();
    }

    getNotificationList(event: any = {}): void {
        this.isLoading = true;
        const page = event ? (event.page + 1) : 1;
        const filter: any = {
                    page: page || '1',
                    limit: event?.rows || '10'
        };
        this._notificationsService.getNotificationList(filter).subscribe((result: any) => {
            if (result && result.IsSuccess) {
                console.log(result);
                
                this.notificationObj = this._globalFunctions.copyObject(result.Data.docs);
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
