import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { result } from 'lodash';
import { SnotifyService } from 'ng-snotify';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { PromoteService } from '../promote.service';

@Component({
  selector: 'app-user-types',
  templateUrl: './user-types.component.html',
  styleUrls: ['./user-types.component.scss']
})
export class UserTypesComponent implements OnInit {
  userTypesForm: any;
  nId: any;
  notificationObj: any;

  isLoading: boolean = false;

  userTypes: any = [
    {value: 'eventusers', url: '/assets/images/event-user.png', type: 'Event User'},
    {value: 'shopusers', url: '/assets/images/shope-user.png', type: 'Shop User'},
    {value: 'onlineofferusers', url: '/assets/images/online-shop-user.png', type: 'online shop offers user'},
    {value: 'livestreamusers', url: '/assets/images/live-streaming-user.png', type: 'live streaming user'},
    {value: 'allusers', url: '/assets/images/all-user.png', type: 'All User'},
    {value: 'existingusers', url: '/assets/images/existing-user.png', type: 'Existing User'}
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private _sNotify: SnotifyService,
    private _promoteService: PromoteService,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
  ) { }

  ngOnInit(): void {
    this.nId = localStorage.getItem('nId');
    this._prepareUserTypesForm(this.notificationObj);
    this.getNotificationById();
  }

  getNotificationById(): void {
    this.isLoading = true;
    this._promoteService.getNotificationById(this.nId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        console.log(result);
        this.notificationObj = this._globalFunctions.copyObject(result.Data);
        console.log(this.notificationObj);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  validate(): boolean {
    if (!this.userTypesForm.value.notificationid || this.userTypesForm.value.notificationid === "") {
      this._sNotify.error('Notification Id is required!', 'Oops!');
      return false;
    }
    if (!this.userTypesForm.value.usertype || this.userTypesForm.value.usertype === "") {
      this._sNotify.error('Select Business Type!', 'Oops!');
      return false;
    }
    return true;
  }
  
  next(): any {
    if (!this.validate()) {
      return;
    }
    console.log(this.userTypesForm.value);
    this._promoteService.saveUserType(this.userTypesForm.value).subscribe((result: any) => {
      console.log(result);
    })
  }

  private _prepareUserTypesForm(userTypesObj: any = {}): void {
    this.userTypesForm = this._formBuilder.group({
      notificationid: [this.nId, [Validators.required]],
      usertype: [userTypesObj?.usertype || '', [Validators.required]],
    });
  }

}
