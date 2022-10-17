import { Component } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'festum-evento';
  loginUser: any = {};
  previousUrl: any = {};
  currentUrl: any = {};

  constructor(private router: Router) {
    localStorage.removeItem('newEventObj');
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = localStorage.getItem('currentUrl');
        this.currentUrl = event.url;
        localStorage.setItem('previousUrl', this.previousUrl);
        localStorage.setItem('currentUrl', this.currentUrl);
      }
    });
  }
}
