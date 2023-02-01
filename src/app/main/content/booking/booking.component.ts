import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';
import { CONSTANTS } from '../../common/constants';
import { GlobalFunctions } from '../../common/global-functions';
import { CreateEventService } from '../create-event/create-event.service';
import { BookingService } from './booking.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  bookings: any = [];
  categories: any = [];
  isLoading: boolean = false;
  isCategoryLoading: boolean = false;
  filterObj: any = {};
  tempFilterObj: any = {};
  constants: any = CONSTANTS;
  date: any = [];
  startTime: any = '';
  endTime: any = '';
  entities: any = [];
  
  constructor(
    private _formBuilder: FormBuilder,
    private _globalFunctions: GlobalFunctions,
    private _bookingService: BookingService,
    private _createEventService: CreateEventService,
    private _sNotify: SnotifyService,
  ) {
    this.getEventCategories();
    this.search = _.debounce(this.search, 1000)
  }

  ngOnInit(): void {
    this.filterObj = {
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      entity: 'event',
      category: '',
      search: ''
    };
    this.getBookings();
  }

  getBookings(): void {
    this.isLoading = true;
    this.tempFilterObj = this._globalFunctions.copyObject(this.filterObj);
    this._bookingService.getBookings(this.filterObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.bookings = result.Data;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  getEventCategories(): void {
    this.isCategoryLoading = true;
    this._createEventService.getEventCategories({event_type: ''}).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.categories = result.Data;
        this.isCategoryLoading = false;
      }
    }, (error: any) => {
      // this._globalFunctions.errorHanding(error, this, true);
      this.isCategoryLoading = false;
    });
  }

  filterChange(isDate: boolean = false, isTime: boolean = false): void {
    if (isDate) {
      this.filterObj.start_date = (this.date && this.date[0] && this.date[0] != '') ? moment(this.date[0]).format('YYYY-MM-DD') : '';
      this.filterObj.end_date = (this.date && this.date[1] && this.date[1] != '') ? moment(this.date[1]).format('YYYY-MM-DD') : '';
      if (this.tempFilterObj.start_date !== this.filterObj.start_date || this.tempFilterObj.end_date !== this.filterObj.end_date) {
        this.getBookings();
      }
    }
    if (isTime) {
      this._sNotify.clear();
      this.filterObj.start_time = (this.startTime && this.startTime != '') ? this.prepareTime(this.startTime) : '';
      this.filterObj.end_time = (this.endTime && this.endTime != '') ? this.prepareTime(this.endTime) : '';
      if (this.tempFilterObj.start_time !== this.filterObj.start_time || this.tempFilterObj.end_time !== this.filterObj.end_time) {
        if (this.filterObj.start_time && this.filterObj.start_time != '' && this.filterObj.end_time && this.filterObj.end_time != '') {
          const startTime = moment(this.filterObj.start_time, 'hh:mm');
          const endTime = moment(this.filterObj.end_time, 'hh:mm');
          if (!startTime.isBefore(endTime) || startTime.isSame(endTime)) {
            this._sNotify.error('Start time is must before End time Or Both time should not same', 'Oops');
            return;
          }
        }

        this.getBookings();
      }
    }
    if (!isDate && !isTime) {
      this.getBookings();
    }
  }

  prepareTime(dateWithTime: any): any {
    const date: any = new Date(dateWithTime);
    if (date != 'Invalid Date') {
      return moment(dateWithTime).format('HH') + ':' + moment(dateWithTime).format('mm');
    }
    return dateWithTime;
  }

  search(event: any) {
    this.filterObj.search = event.target.value;
    this.getBookings();
  }

}
