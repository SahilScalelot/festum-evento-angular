import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalFunctions } from '../../common/global-functions';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  entertainmentObj: any;
  isLoading: boolean = false;

  constructor(
    public _globalFunctions: GlobalFunctions,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getEntertainment();
  }

  getEntertainment(): void {
    this.isLoading = true;
    this.getEntertainmentApi().subscribe((result: any) => {
      this.entertainmentObj = result.Data;
      console.log(result);
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  // Get Live Stream By Id Api
  getEntertainmentApi(): any {
    return this.http.post(environment.appURL + 'organizer/entertainment', this._globalFunctions.getAuthorizationHeader());
  }


}
