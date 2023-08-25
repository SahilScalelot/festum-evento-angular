import { Component, Inject, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { SnotifyService } from 'ng-snotify';
import { CONSTANTS } from 'src/app/main/common/constants';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { LiveStreamService } from '../live-stream.service';
declare const navigator: any;  // This is the declaration you add


@Component({
  selector: 'app-broadcast-stream',
  templateUrl: './broadcast-stream.component.html',
  styleUrls: ['./broadcast-stream.component.scss']
})
export class BroadcastStreamComponent implements OnInit {

  liveStreamObj: any = [];
  broadcastCategories: any;
  constants: any = CONSTANTS;
  newBroadCastForm: any;
  videoDevices: any;
  audioDevices: any;
  client: any;
  config: any;
  isLoading: boolean = false;
  broadcastClient = (window as any).IVSBroadcastClient;
  constructor(
    private _formBuilder: FormBuilder,
    private _sNotify: SnotifyService,
    @Inject(DOCUMENT) private document: any,
    public _globalFunctions: GlobalFunctions,
    private _activatedRoute: ActivatedRoute,
    private elementRef: ElementRef,
    private _router: Router,
    private _liveStreamService: LiveStreamService,
  ) {
    this._prepareBroadCastLiveStreamForm();
    this.getLiveStreamObj();
  }

  async ngOnInit() {
    this.videoDevices = await this.getVideoDevices();
    this.audioDevices = await this.getAudioDevices();
    //this.handlePermissions();
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
      this.config = {
        ingestEndpoint: 'rtmps://'+this.liveStreamObj.awsivschannelconfig.channel.ingestEndpoint+':443/app/',
        streamConfig: this.broadcastClient.BASIC_LANDSCAPE,
        logLevel: this.broadcastClient.LOG_LEVEL.DEBUG,
        streamKey: this.liveStreamObj.awsivschannelconfig.streamKey.value
      };

      this.client = this.broadcastClient.create({
        ingestEndpoint: this.config.ingestEndpoint,
        streamConfig: (window as any).IVSBroadcastClient.BASIC_LANDSCAPE
      });
      const previewEl = this.document.getElementById("preview");
      console.log(previewEl);
      console.log(this.client);
      this.client.attachPreview(previewEl);
       this.handleVideoDeviceSelect(event);
       this.handleAudioDeviceSelect(event);
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
      let streamKey = this.config.streamKey;
      this.client.startBroadcast(streamKey).then((result: any) => {
        console.log('I am successfully broadcasting!');
      })
        .catch((error: any) => {
          console.error('Something drastically failed while broadcasting!', error);
        });

    }
  }
  stopBroadcast() {
     this.client.stopBroadcast();
  }
  async handleVideoDeviceSelect(event: any){
    console.log(event.target.value);
    const id = "camera";
    const  devices = await this.getVideoDevices();
    if (this.client.getVideoInputDevice(id)) {
      this.client.removeVideoInputDevice(id);
    }

    // Get the option's video
    const selectedDevice = devices.find(
        (device: any) => device.deviceId === event.target.value
    );
    console.log(selectedDevice);
    const deviceId = selectedDevice ? selectedDevice.deviceId : null;
    const { width, height } = this.config.streamConfig.maxResolution;
    const cameraStream = await this.getCamera(deviceId, width, height);
    console.log(this.client);
    // Add the camera to the top
    await this.client.addVideoInputDevice(cameraStream, id, {
      index: 0
    });
  }

  handleAudioDeviceSelect(event: any){
    console.log(event.target.value);
  }

  async getCamera(deviceId: any, maxWidth: any, maxHeight: any) {
    let media;
    let videoConstraints: any = {
      deviceId: deviceId ? { exact: deviceId } : null,
      width: {
        max: maxWidth
      },
      height: {
        max: maxHeight
      }
    };
    try {
      // Let's try with max width and height constraints
      media = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: true
      });
    } catch (e) {
      console.log('error'+e);
      this.handlePermissions();
      // and fallback to unconstrained result
      delete videoConstraints.width;
      delete videoConstraints.height;
      media = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints
      });
    }
    console.log(media);
    return media;
  }
  prepareEventObj(eventObj: any = {}, isForUpdateEvent: boolean = false): any {
    const preparedEventObj: any = this._globalFunctions.copyObject(eventObj);
    return preparedEventObj;
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

  async handlePermissions() {
    try {
      const permissionsStatus = await navigator.permissions.query({ name: 'camera' });
      console.log(permissionsStatus)
      if (permissionsStatus.state === 'granted') {
        console.log('Camera permission already granted.');
      } else if (permissionsStatus.state === 'prompt') {
        const newPermissionsStatus = await navigator.permissions.request({ name: 'camera' });
        if (newPermissionsStatus.state === 'granted') {
          console.log('Camera permission granted.');
        } else {
          console.log('Camera permission denied.');
        }
      } else {
        console.log('Camera permission denied.');
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
    }

  }

}
