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

  constructor(private _router: Router) { }

  ngOnInit(): void {
    
    if (!localStorage.getItem('lsId') || localStorage.getItem('lsId') == '') {
      this._router.navigate(['/live-stream']);
      console.log('rout');
    }

    this.items = [
      {
        label: 'Create Live Stream',
        routerLink: 'stream'
      },
      {
        label: 'Photos & Videos',
        routerLink: 'photos-and-videos'
      },
      {
        label: 'Company Details',
        routerLink: 'company-details'
      },
      {
        label: 'Personal Details',
        routerLink: 'personal-details'
      },
      {
        label: 'Terms & Conditions',
        routerLink: 'terms-and-condition'
      }
    ];
  }

}
