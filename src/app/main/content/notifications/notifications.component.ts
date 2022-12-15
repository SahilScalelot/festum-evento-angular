import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit(): void {
    localStorage.removeItem('nId');
  }

  promoteNotification(notificationId: any = ''): void {
    localStorage.setItem('nId', notificationId);
    this._router.navigate(['/notifications/promote/user-type']);
  }

}
