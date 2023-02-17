import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class Message {
  constructor(
    public author: any,
    public content: any,
    public date: Date
  ) {}
}

@Injectable()

export class HelpService {
  constructor() {}
  conversation = new Subject<Message[]>();
  messageMap: any = {
    "hi": "Hello",
    "who are you": "My name is Test Sat Bot",
    "what is your role": "Just guide for the user",
    "lorem": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus rerum dolorum iste eos aspernatur ducimus nisi quam commodi ipsam quo, perspiciatis, ratione est vitae voluptatem voluptates quos debitis tenetur vel.",
    "defaultmsg": "I can't understand your text. Can you please repeat"
  }
  getBotAnswer(msg: any) {    
    const userMessage = new Message('user', msg, new Date());
    this.conversation.next([userMessage]);
    const botMessage = new Message('bot', this.getBotMessage(msg), new Date());
    setTimeout(()=>{
      this.conversation.next([botMessage]);
    }, 1500);
  }
  getBotMessage(question: any = ''){
    question = question.toLowerCase();
    let answer = this.messageMap[question];
    return answer || this.messageMap['defaultmsg'];
  }
}