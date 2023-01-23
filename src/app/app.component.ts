import { Component } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { LanguageTranslateService } from "./services/language-translate.service";
import { CONSTANTS } from "./main/common/constants";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'festum-evento';
  // previousUrl: any = {};
  // currentUrl: any = {};

  constructor(private router: Router, private _translateLanguage: LanguageTranslateService) {
    // this.router.events.subscribe((event: any) => {
    //   if (event instanceof NavigationEnd) {
    //     this.previousUrl = localStorage.getItem('currentUrl');
    //     this.currentUrl = event.url;
    //     localStorage.setItem('previousUrl', this.previousUrl);
    //     localStorage.setItem('currentUrl', this.currentUrl);
    //   }
    // });
    let selectedLanguage = localStorage.getItem('lang');
    if (!selectedLanguage || selectedLanguage == '') {
      localStorage.setItem('lang', CONSTANTS.languagesJSONFileName.US_ENGLISH);
      selectedLanguage = CONSTANTS.languagesJSONFileName.US_ENGLISH;
    }
    this._translateLanguage.setLanguageCode(selectedLanguage || CONSTANTS.languagesJSONFileName.US_ENGLISH);
  }
}
