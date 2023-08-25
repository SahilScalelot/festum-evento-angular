import {Component, Inject, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute, Router, NavigationStart, Event as NavigationEvent} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {DOCUMENT} from '@angular/common';
import {SnotifyService} from 'ng-snotify';
import {CONSTANTS} from 'src/app/main/common/constants';
import {GlobalFunctions} from 'src/app/main/common/global-functions';
import {LiveStreamService} from '../live-stream.service';

declare const navigator: any;
declare const window: any;


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
    isStreamStarted: boolean = false;
    isMicroPhone: boolean = true;
    isVideo: boolean = true;
    broadcastClient = window.IVSBroadcastClient;
    mediaStream: any;

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
        this.handlePermissions();
    }

    async ngOnInit() {
        this.videoDevices = await this.getVideoDevices();
        this.audioDevices = await this.getAudioDevices();
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
                ingestEndpoint: 'rtmps://' + this.liveStreamObj.awsivschannelconfig.channel.ingestEndpoint + ':443/app/',
                streamConfig: this.broadcastClient.BASIC_LANDSCAPE,
                logLevel: this.broadcastClient.LOG_LEVEL.DEBUG,
                streamKey: this.liveStreamObj.awsivschannelconfig.streamKey.value
            };

            this.client = this.broadcastClient.create({
                ingestEndpoint: this.config.ingestEndpoint,
                streamConfig: (window as any).IVSBroadcastClient.BASIC_LANDSCAPE
            });
            const previewEl = this.document.getElementById("preview");
            this.client.attachPreview(previewEl);
            this.handlePermissions();
            this.handleVideoDeviceSelect(event);
            this.handleAudioDeviceSelect(event);
            this.isLoading = false;
        }, (error: any) => {
            this._globalFunctions.errorHanding(error, this, true);
            this.isLoading = false;
        });
    }

    async startBroadcast() {
        console.log(this.client);
        if (this.newBroadCastForm.invalid) {
            Object.keys(this.newBroadCastForm.controls).forEach((key) => {
                this.newBroadCastForm.controls[key].touched = true;
                this.newBroadCastForm.controls[key].markAsDirty();
            });
            return;
        } else {
            if (this.client) {
                let resolution = this.getStreamConfig(this.newBroadCastForm.value.channel_config);
                this.client = this.broadcastClient.create({
                    ingestEndpoint: this.config.ingestEndpoint,
                    streamConfig: resolution
                });
                this.isStreamStarted = true;
                this.client.startBroadcast(this.config.streamKey, this.config.ingestEndpoint).then((result: any) => {
                    console.log('I am successfully broadcasting!');
                }).catch((error: any) => {
                    this.isStreamStarted = false;
                    console.error('Something drastically failed while broadcasting!', error);
                });
            }
        }
    }
    getStreamConfig(channelConfig: any) {
        switch (channelConfig) {
            case 'BASIC_LANDSCAPE':
                return (window as any).IVSBroadcastClient.BASIC_LANDSCAPE;
                break;
            case 'BASIC_PORTRAIT':
                return (window as any).IVSBroadcastClient.BASIC_PORTRAIT;
                break;
            case 'STANDARD_LANDSCAPE':
                return (window as any).IVSBroadcastClient.STANDARD_LANDSCAPE;
                break;
            case 'STANDARD_PORTRAIT':
                return (window as any).IVSBroadcastClient.STANDARD_PORTRAIT;
                break;
            default:
                return (window as any).IVSBroadcastClient.STANDARD_LANDSCAPE;
                break;
        }
    }

    stopBroadcast() {
        this.client.stopBroadcast();
        this.isStreamStarted = false;
    }

    async handleVideoDeviceSelect(event: any) {
        const id = "camera";
        const devices = await this.getVideoDevices();
        if (this.client.getVideoInputDevice(id)) {
            this.client.removeVideoInputDevice(id);
        }

        const selectedDevice = devices.find(
            (device: any) => device.deviceId === event.target.value
        );

        const deviceId = selectedDevice ? selectedDevice.deviceId : null;
        const {width, height} = this.config.streamConfig.maxResolution;
        const cameraStream = await this.getCamera(deviceId, width, height);

        await this.client.addVideoInputDevice(cameraStream, id, {
            index: 0
        });
    }

    async handleAudioDeviceSelect(event: any) {
        const id = "microphone";
        const devices = await this.getAudioDevices();
        if (this.client.getAudioInputDevice(id)) {
            this.client.removeAudioInputDevice(id);
        }
        if (event.target.value === "none") return;
        const selectedDevice = devices.find(
            (device: any) => device.deviceId === event.target.value
        );

        if (selectedDevice) {
            const microphoneStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: selectedDevice.deviceId
                }
            });
            await this.client.addAudioInputDevice(microphoneStream, id);
        }
    }

    async getCamera(deviceId: any, maxWidth: any, maxHeight: any) {
        let media;
        let videoConstraints: any = {
            deviceId: deviceId ? {exact: deviceId} : null,
            width: {
                max: maxWidth
            },
            height: {
                max: maxHeight
            }
        };
        try {
            media = await navigator.mediaDevices.getUserMedia({
                video: videoConstraints,
                audio: true
            });
        } catch (e) {
            console.log('error' + e);
            delete videoConstraints.width;
            delete videoConstraints.height;
            media = await navigator.mediaDevices.getUserMedia({
                video: videoConstraints
            });
        }
        return media;
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

    setMicrophone() {
       this.isMicroPhone = !this.isMicroPhone;
    }

    setWebCam() {
       this.isVideo = !this.isVideo;
       //this.client.mediaStreamManager.mediaTracks = this.isVideo;
       //  console.log(this.client);
       //  console.log(typeof this.client.mediaStreamManager);
       //  console.log(Object.entries(this.client.mediaStreamManager.mediaTracks));
       //  Object.keys(this.client.mediaStreamManager.mediaTracks).forEach(function(key, index) {
       //     console.log(key)
       //  });
       //  Object.entries(this.client.mediaStreamManager).forEach(([key, value]) => {
       //      console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
       //      console.log(value); // "a 5", "b 7", "c 9"
       //  });
        // const previewEl = this.document.getElementById("preview");
        // this.client.detachPreview(previewEl);
        //const videoTrack = this.client.mediaStreamManager.mediaTracks.getVideoTracks()[0];
        //videoTrack.enabled = !videoTrack.enabled
    }

    openSetting() {

    }

    async handlePermissions() {
        try {
            navigator.permissions.query({ name: 'camera' }, { name: 'microphone' }
            ).then(function(permissionStatus: any){
                console.log(permissionStatus.state); // granted, denied, prompt

                permissionStatus.onchange = function(){
                    permissionStatus.state = 'granted';
                    console.log("Permission changed to " + this.state);
                }

            })
        } catch (error) {
            console.error('Error requesting camera permission:', error);
        }

    }

}
