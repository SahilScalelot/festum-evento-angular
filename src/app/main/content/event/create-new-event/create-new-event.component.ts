import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-new-event',
  templateUrl: './create-new-event.component.html',
  styleUrls: ['./create-new-event.component.scss']
})
export class CreateNewEventComponent implements OnInit {
  popClass: string = 'active';
  
  isAddEvent: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
}
