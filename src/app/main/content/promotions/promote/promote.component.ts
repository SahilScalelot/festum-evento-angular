import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-promote',
  templateUrl: './promote.component.html',
  styleUrls: ['./promote.component.scss']
})
export class PromoteComponent implements OnInit {
  items: MenuItem[] | any;

  constructor(private _router: Router) { }

  ngOnInit(): void {
    localStorage.removeItem('selectAll');
    if (!localStorage.getItem('nId') || localStorage.getItem('nId') == '') {
      this._router.navigate(['/promotions']);
    }

    this.items = [
      {
        label: 'Select User Type',
        routerLink: 'user-type'
      },
      {
        label: 'User',
        routerLink: 'users'
      },
      {
        label: 'Publish Date & Time',
        routerLink: 'publish-date-and-time'
      },
      {
        label: 'Bill Details',
        routerLink: 'bill-details'
      },
      {
        label: 'Payment',
        routerLink: 'bill-details'
      }
    ];
  }

}
