import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private router:Router) {}
  conversation = new Subject<Message[]>();
  messageMap: any = {
    "hi": "Hello",
    "how are you": " I don't have feelings or states of well-being, but I'm here and ready to assist you. How can I help you today?",
    "who are you": "My name is Srivalli",
    "what is your role": "Just guide for the user",
    "publish an offer": "Please talk me type of business 1. Online Store 2. Shop",
    "defaultmsg": "I can't understand your text. Can you please repeat"
  }
  getBotAnswer(msg: any) {    
    var userMessage = new Message('user', msg, new Date());
    this.conversation.next([userMessage]);
    const botMessage = new Message('bot', this.getBotMessage(msg), new Date());
    if (this.shouldRedirect(msg)) {
      setTimeout(() => {
        this.redirectToAnotherPage(msg);
      }, 500);
    }else {
      setTimeout(()=>{
        this.conversation.next([botMessage]);
      }, 500);
    }
  }
  getBotMessage(question: any = ''){
    question = question.toLowerCase();
    let answer = this.messageMap[question];
    return answer || this.messageMap['defaultmsg'];
  }

  shouldRedirect(question: any) {
    const msg = question.toLowerCase();

    if (msg == "login") {
      return msg;
    } else if (msg == "promote my event") {
      return msg;
    } else if (msg == "online Store") {
      return msg;
    }else if (msg == "shop") {
      return msg;
    }else if (msg == "livestream my event") {
      return msg;
    }else if (msg == "promote my event") {
      return msg;
    } else if (msg == "online Store") {
      return msg;
    }else if (msg == "shop") {
      return msg;
    }else if (msg == "livestream my event") {
      return msg;
    }else if (msg == "promote my event") {
      return msg;
    } else if (msg == "online Store") {
      return msg;
    }else if (msg == "shop") {
      return msg;
    }else if (msg == "livestream my event") {
      return msg;
    }else if (msg == "promote my event") {
      return msg;
    } else if (msg == "online Store") {
      return msg;
    }else if (msg == "shop") {
      return msg;
    }else if (msg == "livestream my event") {
      return msg;
    }else if (msg == "promote my event") {
      return msg;
    } else if (msg == "online Store") {
      return msg;
    }

  }

  redirectToAnotherPage(msg:any) {
    this.router.navigate(['/faq/' + msg]); 
  }
}