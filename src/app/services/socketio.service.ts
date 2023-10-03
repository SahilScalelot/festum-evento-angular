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
        this.socket = io(environment.SOCKET_ENDPOINT);
    }
    joinChannel(channelId: string) {
        this.socket.emit('join', channelId);
    }

    listenToChannel(channelId: string, callback: (message: string) => void) {
        this.socket.on(`message:${channelId}`, callback);
    }
    // Listen for a specific event
    public listen(event: string): Observable<any> {
        return new Observable<any>((observer) => {
            this.socket.on(event, (data: any) => {
                observer.next(data);
            });
        });
    }
    sendMessage(channelId: string, message: string) {
        console.log(channelId);
        this.socket.emit(channelId, { message: 'Hello from client' });
    }

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
    setupSocketConnection() {
        this.socket = io(environment.SOCKET_ENDPOINT);
        this.socket.on('connect', () => {
            console.log('successfull');
            console.log(this.socket);
            this.socket.emit('my message', 'Hello there from Angular.');

            this.socket.on('my broadcast', (data: string) => {
                console.log(data);
            });
            this.socket.on('onEditEvent', (data: any) => {
                console.log(data)
                //observer.next(data);
            });
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