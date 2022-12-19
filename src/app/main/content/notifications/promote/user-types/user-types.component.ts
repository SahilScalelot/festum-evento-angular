import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { PromoteService } from '../promote.service';
import {CONSTANTS} from "../../../../common/constants";

@Component({
  selector: 'app-user-types',
  templateUrl: './user-types.component.html',
  styleUrls: ['./user-types.component.scss']
})
export class UserTypesComponent implements OnInit {
  nId: any;
  constants: any = CONSTANTS;
  userTypesForm: any;
  isLoading: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _sNotify: SnotifyService,
    private _promoteService: PromoteService,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
  ) { }

  ngOnInit(): void {
    this.nId = localStorage.getItem('nId');
    if (this.nId && this.nId != '') {
      this._prepareUserTypesForm();
      this.getNotificationById();
    } else {
      this._router.navigate(['notifications']);
    }
  }

  getNotificationById(): void {
    this.isLoading = true;
    this._promoteService.getNotificationById(this.nId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this._prepareUserTypesForm(result.Data);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  validateNotificationObj(): boolean {
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
    if (this.isLoading || !this.validateNotificationObj()) {
      return false;
    }
    this.isLoading = true;
    this._promoteService.saveUserType(this.userTypesForm.value).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this._sNotify.success('User Type Selected Successfully.', 'Success');
        this._router.navigate(['/notifications/promote/users']);
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

  private _prepareUserTypesForm(userTypesObj: any = {}): void {
    this.userTypesForm = this._formBuilder.group({
      notificationid: [this.nId, [Validators.required]],
      usertype: [userTypesObj?.usertype || '', [Validators.required]],
    });
  }

}
