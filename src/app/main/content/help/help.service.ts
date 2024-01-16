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
    "who are you": "My name is Srivalli",
    "what is your role": "Just guide for the user",
    "login": "If you did not receive OTP by email or mobile number, then please contact us and send your complaint via email on the email address info@festumevento.com",
    "promote my event": "After saving the details of your upcoming event, wait for your event to be verified. Once verified, click on the “Live” toggle at the right corner of your listing. Your event listing will now be visible to viewers and they can make bookings.",
    "defaultmsg": "I can't understand your text. Can you please repeat"
  }
  getBotAnswer(msg: any) {    
    const userMessage = new Message('user', msg, new Date());
    this.conversation.next([userMessage]);
    const botMessage = new Message('bot', this.getBotMessage(msg), new Date());
    setTimeout(()=>{
      this.conversation.next([botMessage]);
    }, 500);
  }
  getBotMessage(question: any = ''){
    question = question.toLowerCase();
    let answer = this.messageMap[question];
    return answer || this.messageMap['defaultmsg'];
  }
}