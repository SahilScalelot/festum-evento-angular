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
    @ViewChild('canvasElement', { static: true }) canvasElement: any;
    private videoStream: any;
    liveStreamObj: any = [];
    broadcastCategories: any;
    constants: any = CONSTANTS;
    newBroadCastForm: any;
    videoDevices: any;
    audioDevices: any;
    client: any;
    config: any;
    isLoading: boolean = false;
    isOpenSettings: boolean = false;
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
            channel_config: ['', Validators.required]
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
                streamConfig: (window as any).IVSBroadcastClient.STANDARD_LANDSCAPE
            });
            const previewEl = this.document.getElementById("preview");
            this.client.attachPreview(previewEl);
            this.handlePermissions();
            this.handleVideoDeviceSelect();
            this.handleAudioDeviceSelect();
            this.isLoading = false;
        }, (error: any) => {
            this._globalFunctions.errorHanding(error, this, true);
            this.isLoading = false;
        });
    }

    async startBroadcast() {

            if (this.client) {
                this.handleVideoDeviceSelect();
                this.handleAudioDeviceSelect();
                let resolution = this.getStreamConfig('STANDARD_LANDSCAPE');
                this.client = this.broadcastClient.create({
                    ingestEndpoint: this.config.ingestEndpoint,
                    streamConfig: resolution
                });
                this.isStreamStarted = true;
                this.client.startBroadcast(this.config.streamKey, this.config.ingestEndpoint).then((result: any) => {
                    this._sNotify.success('Streaming Started Successfully', 'Success');
                }).catch((error: any) => {
                    this.isStreamStarted = false;
                    this._sNotify.error(error, 'error');
                });
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
        this._sNotify.success('Streaming Stopped Successfully', 'Success');
    }

    async handleVideoDeviceSelect(videoDeviceId?: any) {
        let cameraStream;
        const id = "camera";
        const devices = await this.getVideoDevices();
        if (this.client.getVideoInputDevice(id)) {
            this.client.removeVideoInputDevice(id);
        }

        const selectedDevice = devices.find(
            (device: any) => device.deviceId === videoDeviceId
        );

        const deviceId = selectedDevice ? selectedDevice.deviceId : null;
        const {width, height} = this.config.streamConfig.maxResolution;
        if (deviceId !== null) {
            cameraStream = await this.getCamera(deviceId, width, height);
        } else {
            cameraStream = await this.getCamera(deviceId, width, height);
        }
        await this.client.addVideoInputDevice(cameraStream, id, {
            index: 0
        });
    }

    async handleAudioDeviceSelect(audioDeviceId?: any) {
        let microphoneStream;
        const id = "microphone";
        const devices = await this.getAudioDevices();
        if (this.client.getAudioInputDevice(id)) {
            this.client.removeAudioInputDevice(id);
        }

        //if (audioDeviceId === "none") return;
        let selectedDevice = devices.find(
            (device: any) => device.deviceId === audioDeviceId
        );

        if (selectedDevice !== undefined) {
            microphoneStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: selectedDevice.deviceId
                }
            });
            await this.client.addAudioInputDevice(microphoneStream, id);
        } else {
            microphoneStream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            await this.client.addAudioInputDevice(microphoneStream, id);
        }
    }

    async getCamera(deviceId: any, maxWidth: any, maxHeight: any) {
       // let media;
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
            this.videoStream = await navigator.mediaDevices.getUserMedia({
                video: videoConstraints,
                audio: true
            });
        } catch (e) {
            this._sNotify.error('Permission denied.');
            delete videoConstraints.width;
            delete videoConstraints.height;
            this.videoStream = await navigator.mediaDevices.getUserMedia({
                video: videoConstraints
            });
        }
        return this.videoStream;
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

    async setMicrophone() {
        if (this.isMicroPhone) {
            this.stopMicrophone();
        } else {
            this.handleAudioDeviceSelect(event);
        }
        this.isMicroPhone = !this.isMicroPhone;
    }

    setWebCam() {
        if (this.isVideo) {
            this.stopCamera();
        } else {
            this.handleVideoDeviceSelect(event);
        }
        this.isVideo = !this.isVideo;
    }
    stopCamera() {
         if (this.videoStream) {
             const tracks = this.videoStream.getTracks();
             tracks.forEach((track: any)  => track.stop());
         }
    }
    stopMicrophone() {
        if (this.videoStream) {
            this.videoStream.getAudioTracks().forEach((track: any) => track.stop());
        }
    }

    openSetting(event: any): void {
        event.stopPropagation();
        this.isOpenSettings = true;
    }

    async handlePermissions() {
        try {
            navigator.permissions.query({ name: 'camera' }, { name: 'microphone' }
            ).then(function(permissionStatus: any){
                permissionStatus.onchange = function(){
                    console.log("Permission changed to " + this.state);
                }
            })
        } catch (error) {
            console.error('Error requesting camera permission:', error);
        }

    }

    saveSettings(settingObj: any): void {
        let resolution = this.getStreamConfig(settingObj.channel_config);
        this.handleVideoDeviceSelect(settingObj.webcam);
        this.handleAudioDeviceSelect(settingObj.microphone);
        this.config.streamConfig = resolution;
    }
    closeSettingModal(flag: boolean): void {
        this.isOpenSettings = false;
    }

}
