import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { SnotifyService } from 'ng-snotify';
import { ModalService } from '../_modal';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  @ViewChild('screenShort') screenShort: any;
  @ViewChild('canvas') canvas: any;
  @ViewChild('downloadLink') downloadLink: any;

  constructor(
    private _sNotify: SnotifyService,
    private _router: Router,
    private _modalService: ModalService
  ) { }

  ngOnInit(): void {

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
}
