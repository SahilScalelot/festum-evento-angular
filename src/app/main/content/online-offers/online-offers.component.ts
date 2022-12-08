import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-online-offers',
  templateUrl: './online-offers.component.html',
  styleUrls: ['./online-offers.component.scss']
})
export class OnlineOffersComponent implements OnInit {

  constructor(
    private _router: Router,
  ) { }

  ngOnInit(): void {
  }
  offerOverview(offerId: string = ''): void {
    console.log(offerId);
    
    localStorage.setItem('oOId', offerId);
    this._router.navigate(['/offer-overview']);
  }
}
