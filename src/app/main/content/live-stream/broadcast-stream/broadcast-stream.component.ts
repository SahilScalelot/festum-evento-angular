import { Component, Inject, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { SnotifyService } from 'ng-snotify';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { LiveStreamService } from '../live-stream.service';

@Component({
  selector: 'app-broadcast-stream',
  templateUrl: './broadcast-stream.component.html',
  styleUrls: ['./broadcast-stream.component.scss']
})
export class BroadcastStreamComponent implements OnInit {
  //@ViewChild('newBroadCastNgForm') newBroadCastNgForm: any;
  // @Output() isBroadcastStreamChange = new EventEmitter<boolean>();
  liveStreamObj: any = [];
  broadcastCategories: any;
  constants: any = CONSTANTS;
  newBroadCastForm: any;
  videoDevices: any;
  audioDevices: any;
  isLoading: boolean = false;
  broadcastClient = (window as any).IVSBroadcastClient;
  constructor(
    private _formBuilder: FormBuilder,
    private _sNotify: SnotifyService,
    @Inject(DOCUMENT) private document: any,
    public _globalFunctions: GlobalFunctions,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _liveStreamService: LiveStreamService,
  ) {
    this._prepareBroadCastLiveStreamForm();
  }

  async ngOnInit() {
    this.videoDevices = await this.getVideoDevices();
    this.audioDevices = await this.getAudioDevices();
    this.getLiveStreamObj();
  }
  _prepareBroadCastLiveStreamForm() {
    this.newBroadCastForm = this._formBuilder.group({
      webcam: ['', Validators.required],
      microphone: ['', Validators.required],
      channel_config: ['', Validators.required],
    });
  }
  getLiveStreamObj(): void {
    this.isLoading = true;
    const liveStreamId = this._activatedRoute.snapshot.paramMap.get('id');
    this._liveStreamService.getLiveStreamById(liveStreamId).subscribe((result: any) => {
      this.liveStreamObj = result.Data;
      this.isLoading = false;
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  async startBroadcast() {

    if (this.newBroadCastForm.invalid) {
      Object.keys(this.newBroadCastForm.controls).forEach((key) => {
        this.newBroadCastForm.controls[key].touched = true;
        this.newBroadCastForm.controls[key].markAsDirty();
      });
      return;
    } else {
      console.log(this.broadcastClient);
      const client = this.broadcastClient.create({
        streamConfig: this.broadcastClient.BASIC_LANDSCAPE,
        ingestEndpoint: 'rtmps://76a988f0fedf.global-contribute.live-video.net:443/app/',
      });
      let streamKey = 'sk_ap-south-1_JwHGxlTjDqRt_lPH5lL3Y2umbCVpEl7nLeoOTBwZkVM';
      client.startBroadcast(streamKey).then((result: any) => {
        console.log('I am successfully broadcasting!');
      })
        .catch((error: any) => {
          console.error('Something drastically failed while broadcasting!', error);
        });

    }
  }
  stopBroadcast() {

  }
  prepareEventObj(eventObj: any = {}, isForUpdateEvent: boolean = false): any {
    const preparedEventObj: any = this._globalFunctions.copyObject(eventObj);
    return preparedEventObj;
  }

  async getVideoDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((d) => d.kind === "videoinput");
    if (!videoDevices.length) {

    }
    console.log(videoDevices);
    return videoDevices;
  }

  async getAudioDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter((d) => d.kind === "audioinput");
    if (!audioDevices.length) {
      console.log("No audio devices found.");
    }
    console.log(audioDevices);
    return audioDevices;
  }

}
