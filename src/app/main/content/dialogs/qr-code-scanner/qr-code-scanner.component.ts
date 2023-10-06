import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-qr-code-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.scss']
})
export class QrCodeScannerComponent implements OnInit {
  @Input() popClass: any;
  @Output() close = new EventEmitter<boolean>();
  @Output() onScanSuccess = new EventEmitter<any>();

  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;

  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ];

  hasDevices: boolean;
  hasPermission: boolean;

  qrResultString: string;

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;
  constructor() { }

  ngOnInit(): void {
  }
  closePopup(): void {
    this.close.emit(true);
  }
  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }
  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    this.closePopup();
    this.onScanSuccess.emit(resultString);
  }
  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }
  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);
  }
  onDeviceSelectChange(event: any) {
    const device = this.availableDevices.find(x => x.deviceId === event.target.value);
    this.currentDevice = device || null;
  }
}
