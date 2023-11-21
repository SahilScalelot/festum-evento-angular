import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANTS } from '../../common/constants';
import { GlobalFunctions } from '../../common/global-functions';
import { PromotionsService } from './promotions.service';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent implements OnInit {
  sourceId: any;
  sourceType: any;
  notificationObj: any = [];
  constants: any = CONSTANTS;
  isLoading: boolean = false;
  paging: any;

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _promotionsService: PromotionsService,
  ) { }

  ngOnInit(): void {
    this._globalFunctions.removeIdsFromLocalStorage();
    this.route.queryParams.subscribe(params => {
      this.sourceId = params['id'];
      this.sourceType = params['type'];
    });
    this.getPromotionsList();
    //console.log(this.sourceType)
  }

  promoteNotification(notificationId: any = ''): void {
    localStorage.setItem('nId', notificationId);
    this._router.navigate(['/promotions/promote']);
  }

  getPromotionsList(event: any = {}): void {
    this.isLoading = true;
    const page = event ? (event.page + 1) : 1;
    const filter: any = {
      page : page || '1',
      limit : event?.rows || '10',
      search: ""
    };
    this._promotionsService.getNotificationList(filter).subscribe((result: any) => {
      if (result && result.IsSuccess) {        
        this.notificationObj = this._globalFunctions.copyObject(result.Data.docs);
        // this.paging = this._globalFunctions.copyObject(result.Data);
        this.paging = result.Data;
        // delete this.paging.docs;
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
