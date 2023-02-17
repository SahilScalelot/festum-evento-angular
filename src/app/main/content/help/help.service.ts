import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class Message {
  constructor(
    public author: any,
    public content: any
  ) {}
}

@Injectable()

export class HelpService {
  constructor() {}
  conversation = new Subject<Message[]>();
  messageMap: any = {
    "Hi": "Hello",
    "Who are you": "My name is Test Sat Bot",
    "What is your role": "Just guide for the user",
    "Lorem": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus rerum dolorum iste eos aspernatur ducimus nisi quam commodi ipsam quo, perspiciatis, ratione est vitae voluptatem voluptates quos debitis tenetur vel.",
    "defaultmsg": "I can't understand your text. Can you please repeat"
  }
  getBotAnswer(msg: any) {
    const userMessage = new Message('user', msg);
    this.conversation.next([userMessage]);
    const botMessage = new Message('bot', this.getBotMessage(msg));
    setTimeout(()=>{
      this.conversation.next([botMessage]);
    }, 1500);
  }
  getBotMessage(question: any){
    let answer = this.messageMap[question];
    return answer || this.messageMap['defaultmsg'];
  }
}