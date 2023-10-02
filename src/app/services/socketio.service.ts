import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SocketioService {
    private socket: any;

    constructor() {
        this.socket = io(environment.SOCKET_ENDPOINT, {
            reconnectionAttempts: 5, // Maximum number of reconnection attempts
        });
        this.socket.on('connect', () => {
            console.log('successfull')
        });
    }
    joinChannel(channelId: string) {
        console.log(channelId);
        this.socket.emit('join', channelId);
        console.log(this.socket);
        console.log(this.socket.connected);
    }

    listenToChannel(channelId: string, callback: (message: string) => void) {
        console.log(channelId);
        this.socket.on(`message:${channelId}`, callback);
        // this.socket.on(`message:${channelId}`, (data: any) => {
        //     console.log(data);
        //     //observer.next(data);
        // });
        // this.socket.on(channelId, (message: any) => {
        //    console.log(message);
        // });
    }

    sendMessage(channelId: string, message: string) {
        console.log(channelId);
        this.socket.emit('message', { channelId, text: message });
    }

    // Emit an event
    // public sendMessage(message: string): void {
    //     this.socket.emit('notification', { message });
    // }

    // Receive notifications
    public receiveMessage(): Observable<any> {
        return new Observable<any>((observer) => {
            this.socket.on('notification', (data: any) => {
                console.log(data);
                observer.next(data);
            });
        });
    }
    listenToAnyEvent(callback: (eventName: string, data: any) => void) {
        this.socket.onAny((eventName: string, data: any) => {
            callback(eventName, data);
        });
    }
    connect() {
        this.socket.connect();
    }
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}