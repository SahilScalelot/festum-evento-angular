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
  butten = [
    {btnName: 'Log In', btnValue: 'login', isSelected : false},
    {btnName: 'Event', btnValue: 'event', isSelected : false},
    {btnName: 'Offer', btnValue: 'offer', isSelected : false},
    {btnName: 'Livestream', btnValue: 'livestream', isSelected : false},
    {btnName: 'About Deposit', btnValue: 'aboutdeposit', isSelected : false},
    {btnName: 'Something Else', btnValue: 'somethingelse', isSelected : false},
  ]
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

  itemvalue(item:any) {

    this.butten.map((value:any) => {
      if (item.btnValue == value.btnValue) {
        item.isSelected = true;
        this.value = item.btnValue;
        this.sendMessage();
      } else {
        value.isSelected = false;
      }
    });
  }

  sendMessage() {
    if (this.value != '' && this.value && this.value.length > 0) {      
      this._helpService.getBotAnswer(this.value);
      this.value = '';
      setTimeout(() => {
        this.scrollToBottom();
      }, 0);
    } else {
      this.value = '';
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
