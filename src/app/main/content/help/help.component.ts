import { Component, OnInit, ViewChild } from '@angular/core';
import { Message, HelpService } from './help.service';
@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: any;
  currentTime: Date = new Date();
  messages: Message[] = [];
  value: any;
  constructor(
    public _helpService: HelpService
  ) {
    setInterval(() => {
      this.currentTime = new Date();
    })
  }

  ngOnInit() {
    this._helpService.conversation.subscribe((val) => {
      this.messages = this.messages.concat(val);
      setTimeout(() => {
        this.scrollToBottom();
      }, 0);
    });
  }
  sendMessage() {
    this._helpService.getBotAnswer(this.value);
    this.value = '';
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
