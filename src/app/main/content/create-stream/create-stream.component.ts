import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router} from '@angular/router';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { MenuItem } from 'primeng/api';
import { CreateStreamService } from "./create-stream.service";

@Component({
  selector: 'app-create-stream',
  templateUrl: './create-stream.component.html',
  styleUrls: ['./create-stream.component.scss']
})
export class CreateStreamComponent implements OnInit {
  items: MenuItem[] | any;
  streamId: any = '';
  liveStreamObj: any = {};
  activeIndex: number = 0;

  constructor(private _router: Router,
              private _globalFunctions: GlobalFunctions,
              private _createStreamService: CreateStreamService) {
  }

  ngOnInit(): void {
    if (!localStorage.getItem('lsId') || localStorage.getItem('lsId') == '') {
      //this._router.navigate(['/live-stream']);
    } else {
      this.streamId = localStorage.getItem('lsId') || '';
      if (this.streamId && this.streamId != '') {
        this.getLiveStreamById(this.streamId);
      }
    }
    this.reloadMenuData();
  }

  private reloadMenuData() {
    this.items = [
      {
        label: 'Create Live Stream',
        tabindex: -1,
        routerLink: 'stream'
      },
      {
        label: 'Photos & Videos',
        tabindex: -1,
        routerLink: 'photos-and-videos'
      },
      // {
      //   label: 'Company Details',
      //   tabindex: -1,
      //   routerLink: 'company-details'
      // },
      // {
      //   label: 'Personal Details',
      //   tabindex: -1,
      //   routerLink: 'personal-details'
      // },
      {
        label: 'Terms & Conditions',
        tabindex: -1,
        routerLink: 'terms'
      }
    ];
  }
  onActiveIndexChange(event: number) {
    this.activeIndex = event;
    this.reloadMenuData();
  }

  getLiveStreamById(liveStreamId: any = ''): void {
    this._createStreamService.getLiveStreamById(liveStreamId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.liveStreamObj = result?.Data || {};
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
    });
  }

}
