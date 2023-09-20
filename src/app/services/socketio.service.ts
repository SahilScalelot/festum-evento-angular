import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SocketioService {
    private socket: any;

    constructor() {
        this.socket = io(environment.SOCKET_ENDPOINT)
    }

    // Emit an event
    public sendMessage(message: string): void {
        this.socket.emit('notification', { message });
    }

    // Receive notifications
    public receiveMessage(): Observable<any> {
        return new Observable<any>((observer) => {
            this.socket.on('notification', (data: any) => {
                observer.next(data);
            });
        });
    }

    setupSocketConnection() {
        this.socket = io(environment.SOCKET_ENDPOINT, {
            auth: {
                token: "abc"
            }
        });

        this.socket.emit('my message', 'Hello there from Angular.');

        this.socket.on('my broadcast', (data: string) => {
            console.log(data);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}