import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANTS } from './constants';
import { HttpHeaders } from "@angular/common/http";
import { SnotifyService } from 'ng-snotify';
import * as _ from 'lodash';

declare let $: any;

@Injectable()
export class GlobalFunctions {

  constructor(
    private _router: Router,
    private _sNotifyService: SnotifyService
  ) {
  }

  //Header Functions
  getHeader(): any {
    return {
      headers: new HttpHeaders({
        'content-Type': 'application/json'
      })
    };
  }

  getFileAuthorizationHeader(): any {
    return {
      headers: new HttpHeaders({
        'authorization': 'Token ' + localStorage.getItem('accessToken')
      })
    };
  }

  getAuthorizationHeader(): any {
    return {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'authorization': 'Token ' + localStorage.getItem('accessToken')
        // 'token': localStorage.getItem('accessToken'),
      })
    };
  }

  copyObject(dataObj: any): any {
    return JSON.parse(JSON.stringify(dataObj));
  }

  convertArrToJSON(arr: any, field: any): any {
    const obj: any = {};
    _.each(arr, (dataObj: any, index: any) => {
      if (index !== undefined && dataObj[field] && dataObj[field] !== undefined) {
        obj[dataObj[field]] = dataObj;
      }
    });
    return obj;
  }

  successErrorHandling(response: any, that: any, messageVariable: any): any {
    this._sNotifyService.clear();
    let messageText = '';
    messageText = response.message || CONSTANTS.message.INTERNAL_ERROR;
    if (response.code === CONSTANTS.errorCodes.UNAUTHORIZED ||
      response.code === CONSTANTS.errorCodes.TOKEN_EXPIRED ||
      response.code === CONSTANTS.errorCodes.TOKEN_REQUIRED) {
      localStorage.removeItem('accessToken');
      this._sNotifyService.error(messageText, 'Oops..!');
      // window.location.href = '/login';
      this._router.navigate(['/login'], { queryParams: { redirectURL: this._router.url } });
    } else {
      this._sNotifyService.error(messageText, 'Oops..!');
    }
    if (messageVariable) {
      messageVariable = messageText;
    }
  }

  errorHanding(errorResponse: any, that: any, messageVariable: any, isSingleErrorReturn: boolean = false): any {
    // let error = errorResponse.json();
    const error = errorResponse.error;
    this._sNotifyService.clear();

    let messageText = '';
    messageText = errorResponse.message || CONSTANTS.message.INTERNAL_ERROR;
    if (error && error.error) {
      messageText = error.error;
    }
    if (errorResponse.status === CONSTANTS.errorCodes.UNAUTHORIZED ||
      errorResponse.status === CONSTANTS.errorCodes.TOKEN_EXPIRED ||
      errorResponse.status === CONSTANTS.errorCodes.TOKEN_REQUIRED) {
      localStorage.removeItem('accessToken');
      this._sNotifyService.error(messageText, 'Oops..!');
      // window.location.href = '/login';
      this._router.navigate(['/login'], { queryParams: { redirectURL: this._router.url } });
    } else if (errorResponse.status === CONSTANTS.errorCodes.ERROR_CODE_VALIDATION_FAILED ||
      errorResponse.status === CONSTANTS.errorCodes.ALREADY_EXISTS) {
      if (error.error && Object.keys(error.error).length) {
        messageText = '';
        _.each(error.error, (message: any, key: any) => {
          messageText = messageText + ' ' + message;
          if (isSingleErrorReturn) {
            if (messageVariable) {
              messageVariable = messageText;
            }
            that.message.error = messageText;
            $('#' + key).focus();
            return;
          }
        });
        this._sNotifyService.error(messageText, 'Oops..!');
      }
    } else if (errorResponse.status === CONSTANTS.errorCodes.BAD_REQUEST ||
      errorResponse.status === CONSTANTS.errorCodes.NOT_FOUND_HTTP_EXCEPTION ||
      errorResponse.status === CONSTANTS.errorCodes.PERMISSION_DENIED ||
      errorResponse.status === CONSTANTS.errorCodes.METHOD_NOT_FOUND ||
      // errorResponse.status === CONSTANTS.errorCodes.ALREADY_EXISTS ||
      errorResponse.status === CONSTANTS.errorCodes.DATABASE_INITIALIZATION_FAIL ||
      errorResponse.status === CONSTANTS.errorCodes.INVALID_DOMAIN) {
      this._sNotifyService.error(messageText, 'Oops..!');
    } else {
      this._sNotifyService.error(messageText, 'Oops..!');
    }
    if (!messageVariable) {
      if (that.message && that.message) {
        that.message.error = messageText;
      }
    } else {
      messageVariable = messageText;
    }
    if (that.isLoading) {
      that.isLoading = false;
    }
  }

}
