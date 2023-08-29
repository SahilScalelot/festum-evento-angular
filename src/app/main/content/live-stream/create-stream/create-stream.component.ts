import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-create-stream',
  templateUrl: './create-stream.component.html',
  styleUrls: ['./create-stream.component.scss']
})
export class CreateStreamComponent implements OnInit {
  items: MenuItem[] | any;
  streamId: any = '';
  activeIndex: number = 0;

  constructor(private _router: Router) { }

  ngOnInit(): void {
    if (!localStorage.getItem('lsId') || localStorage.getItem('lsId') == '') {
      // this._router.navigate(['/live-stream']);
    } else {
      this.streamId = localStorage.getItem('lsId') || '';
    }
    this.reloadMenuData();

  }

  private reloadMenuData() {
    this.items = [
      {
        label: 'Create Live Stream',
        tabindex: -1,
        //command: () => this.getSteps('stream'),
        routerLink: 'stream'
      },
      {
        label: 'Photos & Videos',
        tabindex: -1,
        //command: () => this.getSteps('photos-and-videos'),
        routerLink: 'photos-and-videos'
      },
      {
        label: 'Company Details',
        tabindex: -1,
        //command: () => this.getSteps('company-details'),
        routerLink: 'company-details'
      },
      {
        label: 'Personal Details',
        tabindex: -1,
        //command: () => this.getSteps('personal-details'),
        routerLink: 'personal-details'
      },
      {
        label: 'Terms & Conditions',
        tabindex: -1,
        //command: () => this.getSteps('terms-and-condition'),
        routerLink: 'terms-and-condition'
      }
    ];
  }
  onActiveIndexChange(event: number) {
    this.activeIndex = event;
    this.reloadMenuData();
  }
  onActivate(event:any){
    // console.log(event)
  }
  // getSteps(step: string) {
  //   console.log(step)
  //   this._router.navigate(['/live-stream/create/'+ step])
  // }

}
