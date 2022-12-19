import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {SnotifyService} from "ng-snotify";
import {PromoteService} from "../promote.service";
import {Router} from "@angular/router";
import {GlobalFunctions} from "../../../../common/global-functions";
import {CONSTANTS} from "../../../../common/constants";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  nId: any;
  usersForm: any;
  notificationObj: any = {};
  allPromotionPlans: any = [];
  existingUsers: any = [];
  isAllUserSelected: boolean = false;
  isExistingUserSelected: boolean = false;
  isUploadCSVLoading: boolean = false;
  isLoading: boolean = false;
  tmpSelectedPlan: any = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _sNotify: SnotifyService,
    private _promoteService: PromoteService,
    private _router: Router,
    private _globalFunctions: GlobalFunctions
  ) { }

  ngOnInit(): void {
    this.nId = localStorage.getItem('nId');
    if (this.nId && this.nId != '') {
      this._prepareUsersForm();
      this.getNotificationById();
    } else {
      this._router.navigate(['notifications']);
    }
  }

  getNotificationById(): void {
    this.isLoading = true;
    this._promoteService.getNotificationById(this.nId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.notificationObj = result.Data;
        if (this.notificationObj && this.notificationObj.usertype) {
          if (this.notificationObj.usertype == CONSTANTS.userTypeArr[CONSTANTS.userType.ALL_USERS].value) {
            this.isAllUserSelected = true;
            this.getPromotionPlans();
          } else if (this.notificationObj.usertype == CONSTANTS.userTypeArr[CONSTANTS.userType.EXISTING_USERS].value) {
            this.isExistingUserSelected = true;
          }
        }
        this._prepareUsersForm(result.Data);
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

  getPromotionPlans(): any {
    this.isLoading = true;
    this._promoteService.getPromotionPlans().subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.allPromotionPlans = result.Data;
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

  validateUsersObj(userFormObj: any = {}): any {
    if (this.isAllUserSelected) {
      if (!userFormObj.selected_plan && !userFormObj.numberofusers && !userFormObj.published_location) {
        this._sNotify.error('You have to select plan or select app users and ads publish location', 'Oops');
        return false;
      }

      if (!userFormObj.selected_plan && userFormObj.numberofusers && !userFormObj.published_location) {
        this._sNotify.error('Ads publish location is required', 'Oops');
        return false;
      }

      if (!userFormObj.selected_plan && !userFormObj.numberofusers && userFormObj.published_location) {
        this._sNotify.error('Please select app users', 'Oops');
        return false;
      }
    } else if (this.isExistingUserSelected) {
      if ((!userFormObj.is_selected_all || userFormObj.is_selected_all == 'false' || userFormObj.is_selected_all == false) &&
        (!userFormObj.selected_users || !userFormObj.selected_users.length)) {
        this._sNotify.error('Please select at least one user', 'Oops');
        return false;
      }
    }
    return true;
  }

  // prepareUsersObj(usersObj: any = {}): any {
  //   const preparedUsersObj = this._globalFunctions.copyObject(usersObj);
  //
  //   return preparedUsersObj;
  // }

  onNextClick(): any {
    if (this.isLoading || !this.validateUsersObj(this.usersForm.value)) {
      return false;
    }
    // const preparedUsersObj: any = this.prepareUsersObj(this.usersForm.value);
    // console.log(preparedUsersObj);
    console.log(this.usersForm.value);
    this._router.navigate(['/notifications/promote/publish-date-and-time']);
    /*this.isLoading = true;
    this._promoteService.saveUserType(this.usersForm.value).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this._sNotify.success('User Selected Successfully.', 'Success');
        this._router.navigate(['/notifications/promote/publish-date-and-time']);
        this.isLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });*/
  }

  uploadUserCSV(event: any): any {
    if (event.target.files && event.target.files[0]) {
      this.isUploadCSVLoading = true;
      const file = event.target.files[0];
      if (file.type != 'text/csv' && file.type != 'text/xml' && file.type != 'text/xls' && file.type != 'text/xlsx') {
        this._sNotify.error('File type is Invalid.', 'Oops!');
        return false;
      }

      const importCSVObj: any = new FormData();
      importCSVObj.append('file', file);
      importCSVObj.append('notificationid', this.nId);
      this._promoteService.importUsersCSV(importCSVObj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.existingUsers = result.Data;
          this._sNotify.success('User Uploaded Successfully.', 'Success');
          this.isUploadCSVLoading = false;
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
          this.isUploadCSVLoading = false;
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isUploadCSVLoading = false;
      });
    }
  }

  onBackClick(): void {
    this._router.navigate(['/notifications/promote/user-type']);
  }

  onPromotionPlanClick(): void {
    setTimeout(() => {
      if (this.usersForm.value.selected_plan && this.usersForm.value.selected_plan == this.tmpSelectedPlan) {
        this.usersForm.get('selected_plan').setValue('');
        this.tmpSelectedPlan = '';
      } else {
        this.tmpSelectedPlan = this.usersForm.value.selected_plan;
        this.usersForm.get('numberofusers').setValue('');
        this.usersForm.get('published_location').setValue('');
      }
    }, 0);
  }

  onChangeUserSelection(): void {
    this.usersForm.get('selected_plan').setValue('');
    this.tmpSelectedPlan = '';
  }

  private _prepareUsersForm(usersObj: any = {}): void {
    this.usersForm = this._formBuilder.group({
      notificationid: [this.nId, [Validators.required]],
      numberofusers: [usersObj?.numberofusers || ''],
      published_location: [usersObj?.published_location || ''],
      selected_plan: [usersObj?.selected_plan || ''],
      is_selected_all: [usersObj?.is_selected_all || false],
      selected_users: [usersObj?.selected_users || []],
    });
  }

}
