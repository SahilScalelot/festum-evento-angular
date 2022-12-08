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
    localStorage.removeItem('oOId');
    localStorage.removeItem('eId');
  }

  editOffer(event: any, offerId: any): void {
    event.stopPropagation();
    localStorage.setItem('oOId', offerId);
    this._router.navigate(['/online-offers/create-offer']);
  }
  
  offerOverview(event: any, offerObj: any): void {
    event.stopPropagation();
    this._router.navigate(['/online-offers/' + offerObj ]);
  }
}
