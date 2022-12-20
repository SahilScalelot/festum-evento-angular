import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { GlobalFunctions } from "../../../../common/global-functions";
import { GlobalService } from "../../../../../services/global.service";
import { CONSTANTS } from "../../../../common/constants";
import { PromoteService } from "../promote.service";
import { SnotifyService } from "ng-snotify";
import { Router } from "@angular/router";
import * as _ from 'lodash';

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
  allImportedUsers: any = [];
  isAllUserSelected: boolean = false;
  isExistingUserSelected: boolean = false;
  isUploadCSVLoading: boolean = false;
  isLoading: boolean = false;
  constants: any = CONSTANTS;
  tmpSelectedPlan: any = '';
  totalUsersCount: any = 0;
  pageObj: any = {};

  get totalOptions() {
    return new Array(Math.ceil(this.totalUsersCount / 100));
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _sNotify: SnotifyService,
    private _promoteService: PromoteService,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _globalService: GlobalService
  ) { }

  ngOnInit(): void {
    this.nId = localStorage.getItem('nId');
    if (this.nId && this.nId != '') {
      this._prepareUsersForm();
      this.notificationObj = this._globalService.promoteNotification$.getValue();
      if (this.notificationObj && this.notificationObj._id && this.notificationObj._id != '') {
        this._prepareVariables(this.notificationObj);
        this._prepareUsersForm(this.notificationObj);
      } else {
        this.getNotificationById();
      }
    } else {
      this._router.navigate(['notifications']);
    }
  }

  private _prepareVariables(notificationObj: any = {}): void {
    if (notificationObj && notificationObj.usertype) {
      if (notificationObj.usertype == CONSTANTS.userTypeArr[CONSTANTS.userType.ALL_USERS].value) {
        this.isAllUserSelected = true;
        this.getPromotionPlans();
      } else if (notificationObj.usertype == CONSTANTS.userTypeArr[CONSTANTS.userType.EXISTING_USERS].value) {
        this.isExistingUserSelected = true;
        this.getImportedUsersList();
      }
    }
  }

  getNotificationById(): void {
    this.isLoading = true;
    this._promoteService.getNotificationById(this.nId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.notificationObj = this._globalFunctions.copyObject(result.Data);
        this._globalService.promoteNotification$.next(result.Data);
        this._prepareVariables(result.Data);
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

  getImportedUsersList(): any {
    this.isLoading = true;
    const filterObj: any = {
      "notificationid" : this.nId,
      page : this.pageObj?.nextPage || 1,
      limit : this.pageObj?.limit || 6,
      "search" : ""
    }
    this._promoteService.getImportedUsersList(filterObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        if (this.allImportedUsers && this.allImportedUsers.length) {
          this.allImportedUsers = _.concat(...this.allImportedUsers, result.Data.docs);
        } else {
          this.allImportedUsers = this._globalFunctions.copyObject(result.Data.docs);
        }
        this.pageObj = this._globalFunctions.copyObject(result.Data);
        this.totalUsersCount = this.pageObj.totalDocs;
        delete this.pageObj.docs;
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
      // if ((!userFormObj.is_selected_all || userFormObj.is_selected_all == 'false' || userFormObj.is_selected_all == false) &&
      //   (!userFormObj.selected_users || !userFormObj.selected_users.length)) {
      //   this._sNotify.error('Please select at least one user', 'Oops');
      //   return false;
      // }
    }
    return true;
  }

  prepareUsersObj(usersObj: any = {}): any {
    const preparedUsersObj = this._globalFunctions.copyObject(usersObj);
    if (this.isAllUserSelected) {
      preparedUsersObj.published_location = '';
      preparedUsersObj.selected_plan = '';
      preparedUsersObj.is_selected_all = '';
    } else if (this.isExistingUserSelected) {
      preparedUsersObj.numberofusers = '';
      preparedUsersObj.published_location = '';
      preparedUsersObj.selected_plan = '';
    }
    return preparedUsersObj;
  }

  onNextClick(): any {
    if (this.isLoading || !this.validateUsersObj(this.usersForm.value)) {
      return false;
    }
    const preparedUsersObj: any = this.prepareUsersObj(this.usersForm.value);
    this.isLoading = true;
    this._promoteService.saveUsers(preparedUsersObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this._globalService.promoteNotification$.next(result.Data);
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
    });
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
          if (result.Data.rejectedCount && result.Data.importCount > 0) {
            this._sNotify.success(result.Data.importCount + ' Number of user records uploaded successfully.', 'Success');
          }
          if (result.Data.rejectedCount && result.Data.rejectedCount > 0) {
            this._sNotify.error(result.Data.rejectedCount + ' Number of user records rejected.', 'Oops');
          }
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

  onSelectAllChecked(event: any): void {
    if (this.allImportedUsers && this.allImportedUsers.length) {
      if (event && event.target && event.target.checked) {
        this.isLoading = true;
        const prepareCheckAllUserObj: any = {
          notificationid: this.nId,
          is_selected_all: true,
        };
        this._promoteService.checkAllUser(prepareCheckAllUserObj).subscribe((result: any) => {
          if (result && result.IsSuccess) {
            this.allImportedUsers = _.map(this.allImportedUsers, (importedUser: any) => {
              return {...importedUser, selected: true};
            });
            this.isLoading = false;
          } else {
            this._globalFunctions.successErrorHandling(result, this, true);
            this.isLoading = false;
          }
        }, (error: any) => {
          this._globalFunctions.errorHanding(error, this, true);
          this.isLoading = false;
        });
      } else {
        this.allImportedUsers = _.map(this.allImportedUsers, (importedUser: any) => {
          return {...importedUser, selected: false};
        });
      }
    }
  }

  onCheckboxChange(importedUser: any, index: number): void {
    if (importedUser && importedUser._id) {
      this.isLoading = true;
      const prepareCheckUserObj: any = {
        notificationid: this.nId,
        userid: importedUser._id,
        selected: !(importedUser.selected)
      };
      this._promoteService.checkUser(prepareCheckUserObj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          const allImportedUsers: any = this._globalFunctions.copyObject(this.allImportedUsers);
          allImportedUsers[index].selected = !(importedUser.selected);
          this.allImportedUsers = this._globalFunctions.copyObject(allImportedUsers);
          if (!prepareCheckUserObj.selected) {
            this.usersForm.get('is_selected_all').setValue(false);
          }
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
      numberofusers: [usersObj?.numberofusers || (this.totalUsersCount).toString()],
      published_location: [usersObj?.published_location || ''],
      selected_plan: [usersObj?.selected_plan || ''],
      is_selected_all: [usersObj?.is_selected_all || false],
      // selected_users: [usersObj?.selected_users || []],
    });
  }

}
