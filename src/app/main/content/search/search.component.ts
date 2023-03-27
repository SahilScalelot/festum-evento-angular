import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { CONSTANTS } from '../../common/constants';
import { GlobalFunctions } from '../../common/global-functions';
import { SearchBoxService } from './search.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  isLoading: boolean = true;
  redeemCoinHistory: any = [];
  searchObj: any;
  searchWord: any;
  constants: any = CONSTANTS;
  @ViewChild('searchInput') searchInput: any;

  constructor(
    private _globalService: GlobalService,
    private _globalFunctions: GlobalFunctions,
    private _router: Router,
    public _searchBoxService: SearchBoxService,
  ) { 
    // this.getSearch = _.debounce(this.getSearch, 1000)
  }

  ngOnInit(): void {
    this._globalService.searchValue$.subscribe((searchWord: any) => {
      if (searchWord && searchWord != '') {
        this.searchWord = searchWord;
        this.getSearch();
      } else {
        this._router.navigate(['/events']);
        this.searchWord = '';
      }
    });
  }

  getSearch(): void {
    const searchWord = this.searchWord;
    if (searchWord != "") {
      this.isLoading = true;
      this._searchBoxService.searchList(searchWord).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.searchObj = result.Data;
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
        }
        this.isLoading = false;
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isLoading = false;
      });
    } else {
      this.searchObj = '';
    }
  }

  openUrl(event: any, type: any = ''): void {
    this.searchObj = '';
    switch (type) {
      case 'events':
        this._router.navigate(['/events/' + event?._id]);
        break;
      case 'shops':
        this._router.navigate(['/offline-shops/' + event?._id]);
        break;
      case 'offlineoffer':
        this._router.navigate(['/offline-shops/' + event?.shopid?._id + '/offer-overview/' + event?._id]);
        break;
      case 'onlineoffer':
        this._router.navigate(['/online-offers/' + event?._id]);
        break;
      case 'livestreams':
        this._router.navigate(['/live-stream/' + event?._id]);
        break;
    }
    // this.searchInput.nativeElement.value = '';
  }

}