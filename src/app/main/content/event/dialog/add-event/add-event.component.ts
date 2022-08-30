import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  @Input() popClass: any;
  @Output() isAddEventChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  closePopup(): void {
    this.isAddEventChange.emit(false);
  }

  eventType = [
    "Conference",
    "Seminar",
    "Company Meeting",
    "Leadership Event",
    "Products Lunch",
  ]
}
