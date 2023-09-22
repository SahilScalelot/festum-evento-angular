import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SafeUrl } from "@angular/platform-browser";
import { GlobalService } from 'src/app/services/global.service';
import { LanguageTranslateService } from "../../services/language-translate.service";
import { CONSTANTS } from '../common/constants';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import { ModalService } from '../_modal';
import html2canvas from 'html2canvas';
import { ContentService } from './content.service';
import { GlobalFunctions } from '../common/global-functions';
import * as _ from 'lodash';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, OnDestroy {
  loginUser: any = {};
  selectedLanguage: any = '';
  isLoading: boolean = false;
  languageModel: boolean = false;
  constants: any = CONSTANTS;
  searchObj: any;
  
  @ViewChild('searchInput') searchInput: any;
  @ViewChild('screenShort') screenShort: any;
  @ViewChild('canvas') canvas: any;
  @ViewChild('downloadLink') downloadLink: any;

  public qrCodeData: string = "";
  public qrCodeDownloadLink: SafeUrl = "";

  constructor(
    private _sNotify: SnotifyService,
    private _router: Router,
    private _contentService: ContentService,
    private _globalService: GlobalService,
    private _globalFunctions: GlobalFunctions,
    private _modalService: ModalService,
    private _translateLanguage: LanguageTranslateService
  ) { 
    // this.getSearch = _.debounce(this.getSearch, 1000)
  }
    
  ngOnInit(): void {
    this.selectedLanguage = localStorage.getItem('lang');
    if (!this.selectedLanguage || this.selectedLanguage == '') {
      this.selectedLanguage = this.constants.languagesJSONFileName.US_ENGLISH;
    }
    this._globalService.loginUser$.subscribe((user: any) => {
      if (user) {
        this.loginUser = user;
        this.qrCodeData = this.loginUser._id;
      }
    });
  }

  ngOnDestroy(): void {
    this._globalService.loginUser$.complete();
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

  onQrCodeChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
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

  getSearch(event: any = ''): void {
    // const searchWord = event.target.value;
    const searchWord = event;
    if (searchWord != "") {
      this._router.navigate(['/search']);
      this._globalService.searchValue$.next(searchWord);
    }
  }

  openUrl(event: any, type: any = ''): void {
    this.searchObj = '';
    switch (type) {
      case 'events':
        this._router.navigate(['/events/'+event?._id]);
        break;
      case 'shops':
        this._router.navigate(['/offline-shops/'+event?._id]);
        break;
      case 'offlineoffer':
        this._router.navigate(['/offline-shops/'+event?.shopid?._id+'/offer-overview/'+event?._id]);
        break;
      case 'onlineoffer':
        this._router.navigate(['/online-offers/'+event?._id]);
        break;
      case 'livestreams':
        this._router.navigate(['/live-stream/'+event?._id]);
        break;
    }
    this.searchInput.nativeElement.value = '';
  }
}
