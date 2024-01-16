import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  param: any;
  login: boolean = false;
  location: boolean = false;
  app: boolean = false;
  event: boolean = false;
  offer: boolean = false;
  referral: boolean = false;
  ratings: boolean = false;
  language: boolean = false;
  currency: boolean = false;
  customer: boolean = false;
  redemption: boolean = false;
  share: boolean = false;
  invoice: boolean = false;
  notification: boolean = false;
  reminder: boolean = false;
  promotion: boolean = false;
  gift: boolean = false;
  wishlist: boolean = false;
  any: boolean = false;

  constructor(private _activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.param = this._activatedRoute.snapshot.paramMap.get('msg');

    if (this.param == "login") {
      this.login = true;
    } else if (this.param == "promote my event") {
      this.event = true;
    } else if (this.param == "online Store") {
      this.offer = true;
    }else if (this.param == "shop") {
      this.offer = true;
    }
  
  }
}
