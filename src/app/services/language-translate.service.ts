import { Injectable } from '@angular/core';
import { CONSTANTS } from "../main/common/constants";
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageTranslateService {

  constructor(
    public translate: TranslateService
  ) {
    // this.translate.setDefaultLang('us-english');
    // this.translate.use('us-english');
  }

  setLanguageCode(code: any = CONSTANTS.languagesJSONFileName.US_ENGLISH) {
    this.translate.setDefaultLang(code);
    this.translate.use(code);
  }
 
}
