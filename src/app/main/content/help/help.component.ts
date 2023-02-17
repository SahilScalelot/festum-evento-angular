import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Message, HelpService } from './help.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer: any;

  messages: Message[] = [];
  value: any;
  constructor(
    public _helpService: HelpService
  ) { }

  ngOnInit() {
    this.scrollToBottom();
    this._helpService.conversation.subscribe((val) => {
      this.messages = this.messages.concat(val);
    });
  }
  sendMessage() {
    this._helpService.getBotAnswer(this.value);
    this.value = '';
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
