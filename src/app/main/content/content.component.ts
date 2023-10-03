import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SafeUrl } from "@angular/platform-browser";
import { GlobalService } from 'src/app/services/global.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { LanguageTranslateService } from "../../services/language-translate.service";
import { CONSTANTS } from '../common/constants';
import { SnotifyService } from 'ng-snotify';
import { Router, NavigationEnd } from '@angular/router';
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
  channelId: string = '7778009509_64ace2b44a72668d4a558e1f';
  
  @ViewChild('searchInput') searchInput: any;
  @ViewChild('screenShort') screenShort: any;
  @ViewChild('canvas') canvas: any;
  @ViewChild('downloadLink') downloadLink: any;

  public qrCodeData: string = "";
  public qrCodeDownloadLink: SafeUrl = "";
  public isNotification: boolean = false;
  public messages: string[] = [];

  constructor(
    private _sNotify: SnotifyService,
    private _router: Router,
    private _contentService: ContentService,
    private _globalService: GlobalService,
    private SocketioService: SocketioService,
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
        //this.channelId = this.loginUser.channelID;
        //console.log(this.loginUser);
        //this.messageToSend = ''; // Clear the input field
      }
    });
    //this.SocketioService.connect();
    //this.SocketioService.joinChannel(this.channelId);

    // this.SocketioService.listenToChannel(this.channelId, (message: string) => {
    //   console.log(message);
    //   this.messages.push(message);
    // });
    // this.SocketioService.sendMessage(this.channelId, 'test');

    this.SocketioService.setupSocketConnection();
    this.SocketioService.listenToAnyEvent((eventName: string, data: any) => {
      // Handle the event here
      console.log(`Received event: ${eventName}`);
      console.log('Data:', data);

      // You can push the received data to the messages array for display
      this.messages.push(`Received event: ${eventName}, Data: ${JSON.stringify(data)}`);
    });
    this.SocketioService.listen(this.channelId).subscribe((data: any) => {
      console.log(data);
      //this.messages.push(data.message);
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
    this._router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        console.log(event);
        this._router.navigate([event.url]);
        location.reload();
      }
    })
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

  toggleNotification() {
    this.isNotification = !this.isNotification;
    //this.SocketioService.sendMessage(this.channelId, 'test');
  }
}
