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
        this.socket = io(environment.SOCKET_ENDPOINT,{ multiplex: false });
        // this.socket = io.of(environment.SOCKET_ENDPOINT)
        //     .on("connection", (socket: any) => {
        //         socket.join('7778009509_64ace2b44a72668d4a558e1f', () => {
        //             console.log(socket.rooms);
        //             //io.sockets.in("room1").emit('connectedToRoom1', { message: "You connected room 1" });
        //         });
        //     });
        // io.of(environment.SOCKET_ENDPOINT).adapter.on("7778009509_64ace2b44a72668d4a558e1f", (room:any, id:any) => {
        //     console.log(`socket ${id} has joined room ${room}`);
        // });
        //this.socket.join('7778009509_64ace2b44a72668d4a558e1f');
        // this.socket.on("7778009509_64ace2b44a72668d4a558e1f", () => {
        //     console.log("A new user has joined room1");
        // });
        // this.socket.on("connect", () => {
        //     console.log('successfull');
        //     this.socket.emit('join', '7778009509_64ace2b44a72668d4a558e1f');
        //     console.log(this.socket.rooms);
        //     this.socket.on('7778009509_64ace2b44a72668d4a558e1f' , () => {
        //         console.log('successfull-test');
        //     });
        // });


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
        this.socket.emit(channelId, { message: 'Hello from client' });
    }

    onMessage(channelId: any): Observable<any> {
        return new Observable<any>((observer) => {
            this.socket.on(channelId, (message: any) => {
                observer.next(message);
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
            // console.log('successfull');
            // console.log(this.socket);
            // this.socket.emit('my message', 'Hello there from Angular.');
            //
            // this.socket.on('my broadcast', (data: string) => {
            //     console.log(data);
            // });
            // this.socket.on('onEditEvent', (data: any) => {
            //     console.log(data)
            //     //observer.next(data);
            // });
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