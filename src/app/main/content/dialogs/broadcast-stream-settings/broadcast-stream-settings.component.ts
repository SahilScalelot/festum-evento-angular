import { Component, Inject, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { SnotifyService } from 'ng-snotify';
//import IVSBroadcastClient from 'amazon-ivs-web-broadcast';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { CONSTANTS } from "../../../common/constants";

declare const navigator: any;
declare const window: any;

@Component({
  selector: 'app-broadcast-stream-settings',
  templateUrl: './broadcast-stream-settings.component.html',
  styleUrls: ['./broadcast-stream-settings.component.scss']
})
export class BroadcastStreamSettingsComponent implements OnInit {
  @Input() popClass: any;
  @ViewChild('newBroadCastNgForm') newBroadCastNgForm: any;
  @Output() isBroadcastStreamChange = new EventEmitter<boolean>();
  @Output() saveSettingEvent = new EventEmitter<boolean>();
  broadcastCategories: any;
  constants: any = CONSTANTS;
  newBroadCastForm: any;
  videoDevices: any;
  audioDevices: any;
  isLoading: boolean = false;
  constructor(private _formBuilder: FormBuilder,
              private _sNotify: SnotifyService,
              @Inject(DOCUMENT) private document: any,
              private _globalFunctions: GlobalFunctions) { }

  async ngOnInit() {
    this.newBroadCastForm = this._formBuilder.group({
      webcam: ['', Validators.required],
      microphone: ['', Validators.required],
      channel_config: ['', Validators.required]
    });
    this.videoDevices = await this.getVideoDevices();
    this.audioDevices = await this.getAudioDevices();
  }

  async getVideoDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((d: any) => d.kind === "videoinput");
    if (!videoDevices.length) {
      console.log("No video devices found.");
    }
    return videoDevices;
  }

  async getAudioDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter((d: any) => d.kind === "audioinput");
    if (!audioDevices.length) {
      console.log("No audio devices found.");
    }
    return audioDevices;
  }

  saveSettings() {
    if (this.newBroadCastForm.invalid) {
      Object.keys(this.newBroadCastForm.controls).forEach((key) => {
        this.newBroadCastForm.controls[key].touched = true;
        this.newBroadCastForm.controls[key].markAsDirty();
      });
      return;
    } else {
      this.saveSettingEvent.emit(this.newBroadCastForm.value);
      this.closePopup();
    }
  }
  closePopup(): void {
    this.isBroadcastStreamChange.emit(false);
  }

}
