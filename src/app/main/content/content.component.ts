import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { LanguageTranslateService } from "../../services/language-translate.service";
import { CONSTANTS } from '../common/constants';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import { ModalService } from '../_modal';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  loginUser: any = {};
  selectedLanguage: any = '';
  languageModel: boolean = false;
  constants: any = CONSTANTS;

  @ViewChild('screenShort') screenShort: any;
  @ViewChild('canvas') canvas: any;
  @ViewChild('downloadLink') downloadLink: any;

  constructor(
    private _sNotify: SnotifyService,
    private _router: Router,
    private _globalService: GlobalService,
    private _modalService: ModalService,
    private _translateLanguage: LanguageTranslateService
  ) { }

  ngOnInit(): void {
    this.selectedLanguage = localStorage.getItem('lang');
    if (!this.selectedLanguage || this.selectedLanguage == '') {
      this.selectedLanguage = this.constants.languagesJSONFileName.US_ENGLISH;
    }
    this._globalService.loginUser$.subscribe((user: any) => {
      if (user) {
        this.loginUser = user;
      }
    });
  }

  screenCapture() {
    html2canvas(this.screenShort.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'marble-diagram.png';
      this.downloadLink.nativeElement.click();
    });
  }

  logout() {
    localStorage.removeItem('accessToken');
    this._router.navigate(['login']);
    this._sNotify.success('Logged Out Successfully!', 'Success');
  }
  openBarcode() {
    this._modalService.open('Barcode');
  }

  openLanguageModel() {
    this.languageModel = true;
  }

  onLanguageChange(languageCode: string = '') {
    localStorage.setItem('lang', languageCode);
    this.selectedLanguage = languageCode;
    this._translateLanguage.setLanguageCode(languageCode);
  }

  closeLanguageModel() {
    this.languageModel = false;
  }
}
