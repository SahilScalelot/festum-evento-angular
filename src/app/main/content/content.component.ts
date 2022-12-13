import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { SnotifyService } from 'ng-snotify';
import { GlobalService } from 'src/app/services/global.service';
import { CONSTANTS } from '../common/constants';
import { ModalService } from '../_modal';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  loginUser: any = {};
  selectedLanguage: any = 'us-english';
  languageModel: boolean = false;
  constants: any = CONSTANTS;

  @ViewChild('screenShort') screenShort: any;
  @ViewChild('canvas') canvas: any;
  @ViewChild('downloadLink') downloadLink: any;

  constructor(
    private _sNotify: SnotifyService,
    private _router: Router,
    private _globalService: GlobalService,
    private _modalService: ModalService
  ) { }

  ngOnInit(): void {
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

  closeLanguageModel() {
    console.log(this.selectedLanguage);
    this.languageModel = false;
  }
}
