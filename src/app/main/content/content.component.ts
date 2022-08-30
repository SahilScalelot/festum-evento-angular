import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor(private _sNotify: SnotifyService, private _router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    localStorage.removeItem('accessToken');    
    this._router.navigate(['login']);
    this._sNotify.success('Logged Out Successfully!', 'Success');
  }
}
