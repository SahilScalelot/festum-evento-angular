import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
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
import { AuthService } from 'src/app/main/auth/auth.service';
import { GlobalFunctions } from '../common/global-functions';
import * as _ from 'lodash';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, OnDestroy {
  loginUser: any = {};
  scanUser: any = {};
  selectedLanguage: any = '';
  isLoading: boolean = false;
  languageModel: boolean = false;
  isOpenQrScanner: boolean = false;
  constants: any = CONSTANTS;
  searchObj: any;
  transferCoinForm: any;
  maxTransferCoinValue: any;
  isTransferLoading: boolean = false;
  //channelId: string = '7778009509_64ace2b44a72668d4a558e1f';

  @ViewChild('searchInput') searchInput: any;
  @ViewChild('screenShort') screenShort: any;
  @ViewChild('canvas') canvas: any;
  @ViewChild('downloadLink') downloadLink: any;

  public qrCodeData: string = "";
  public qrCodeDownloadLink: SafeUrl = "";
  public isNotification: boolean = false;
  public messages: any = [];
  public chatMessages: any = [];
  public organiser: any;
  public notificationLength: any = [];
  public chatNotificationLength: any = [];

  constructor(
    private _sNotify: SnotifyService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _contentService: ContentService,
    private _authService: AuthService,
    private _globalService: GlobalService,
    private SocketioService: SocketioService,
    private _globalFunctions: GlobalFunctions,
    private _modalService: ModalService,
    private _translateLanguage: LanguageTranslateService
  ) { 
    // this.getSearch = _.debounce(this.getSearch, 1000)
    this.transferCoinForm = this._formBuilder.group({
      to: ['', [Validators.required]],
      amount: [null, [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.max(this.maxTransferCoinValue)]],
    });
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
        this.maxTransferCoinValue = user.f_coins;
        this.transferCoinForm.get('amount').setValidators([
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          Validators.max(this.maxTransferCoinValue)
        ]);

        // Trigger a revalidation of the form control
        this.transferCoinForm.get('amount').updateValueAndValidity();
        this.SocketioService.onMessage(user.channelID).subscribe((data) => {
            if (Notification.permission === 'granted') {
              if (data.event === 'onNewChatMessage') {
                const notification = new Notification(data.data.title, {
                  body: data.data.message,
                  icon: this.constants.baseImageURL + data.data.banner,
                  data: data.data
                });
                notification.onclick = (event: any) => {
                  event.preventDefault();
                  let type = event.target.data.type;
                  let entityId = event.target.data.entityid;
                  window.open(`https://festumevento.com/#/events/chat/${entityId}`, "_blank");
                };
                this.getChatNotificationList();
                this.chatNotificationLength.push(data.data);
              } else {
                const notification = new Notification(data.data.title, {
                  body: data.data.message,
                  icon: this.constants.baseImageURL + data.data.banner,
                  data: data.data
                });
                notification.onclick = (event: any) => {
                  event.preventDefault();
                  let type = event.target.data.type;
                  let entityId = event.target.data.entityid;

                  if (type === "event") {
                    window.open(`https://festumevento.com/#/events/${entityId}`, "_blank");
                  } else if (type === "livestrem") {
                    window.open(`https://festumevento.com/#/live-stream/${entityId}`, "_blank");
                  } else if (type === "shop") {
                    window.open(`https://festumevento.com/#/offline-shops/${entityId}`, "_blank");
                  } else if (type === "onlineoffer") {
                    window.open(`https://festumevento.com/#/online-offers/${entityId}`, "_blank");
                  } else if (type === "offlineoffer") {
                    let shopId = event.target.data.shopid;
                    window.open(`https://festumevento.com/#/offline-shops/${shopId}/offer-overview/${entityId}`, "_blank");
                  } else if (type === "fcoin") {
                    window.open("https://festumevento.com", "_blank");
                  } else {
                    window.open("https://festumevento.com", "_blank");
                  }

                };
                this.getNotificationListData();
                this.notificationLength.push(data.data);
              }

            }

        });
        //this.channelId = this.loginUser.channelID;
        //console.log(this.loginUser);
        //this.messageToSend = ''; // Clear the input field
      }
    });

    this.getNotificationListData();
    this.getChatNotificationList();
    //this.SocketioService.joinChannel(this.channelId);

    // this.SocketioService.listenToAnyEvent((eventName: string, data: any) => {
    //   console.log('Data:', data.data);
    //   if (Notification.permission === 'granted') {
    //     const notification = new Notification(data.data.title, {
    //       body: data.data.message,
    //       icon: this.constants.baseImageURL + data.data.banner
    //     });
    //     notification.onclick = (event) => {
    //       console.log(event);
    //       event.preventDefault();
    //       window.open("https://festumevento.com/#/events", "_blank");
    //     };
    //   }
    //   this.getNotificationListData();
    //   this.notificationLength.push(data.data);
    // });
  }

  ngOnDestroy(): void {
    // this._globalService.loginUser$.complete();
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

  openScannerModel() {
    this.isOpenQrScanner = true;
  }
  closeScannerModel(event: any) {
    this.isOpenQrScanner = false;
  }
  qrCodeResult(event: any) {
    let str = event.replace(/ /g, "");
    if (str.length !== 0) {
      const data: any = {
        userid: str
      };
      this._contentService.getScannedFCoinUser(data).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.scanUser = result.Data;
          this.transferCoinForm.get('to').setValue(result.Data._id);
          this._sNotify.success('User get successfully.');
          this._modalService.open('FCoinTransfer');
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
          //this.isLoading = false;
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
      });
    } else {
      this._sNotify.error('QR Code is Wrong.', 'Oops');
    }
  }

  transferCoin(): void {
    if (this.transferCoinForm.valid) {
      this.transferCoinForm.value.amount = Number(this.transferCoinForm.value.amount);
      this.isTransferLoading = true;
      this._contentService.transferFCoin(this.transferCoinForm.value).subscribe((result: any) => {
        console.log(result);
        if (result && result.IsSuccess) {
          this._sNotify.success('FCoin transfered successfully.');
          this._modalService.close('FCoinTransfer');
          this.isTransferLoading = false;
          this.transferCoinForm.reset();
          this.refreshProfile();
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
          this._modalService.close('FCoinTransfer');
          this.isTransferLoading = false;
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this._modalService.close('FCoinTransfer');
        this.isTransferLoading = false;
      });
    } else {
      return;
    }
  }

  refreshProfile() {
      this._authService.getLoginUser().subscribe((result: any) => {
          if (result.IsSuccess) {
              const user = _.clone(result.Data);
              this._globalService.loginUser$.next(user);
          } else {
              this._globalFunctions.successErrorHandling(result, this, true);
              //this.isLoading = false;
          }
      }, (error: any) => {
          this._globalFunctions.errorHanding(error, this, true);
      });
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

  getNotificationListData() {
    let data = {page: 1, limit: 5};
    this.messages = [];
    this._contentService.getNotificationList(data).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.messages = this._globalFunctions.copyObject(result.Data.docs);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
    });
  }

  getChatNotificationList() {
    let data = {page: 1, limit: 5};
    this.chatMessages = [];
    this._contentService.getChatNotificationList(data).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.chatMessages = this._globalFunctions.copyObject(result.Data.docs);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
    });
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
  }
}
