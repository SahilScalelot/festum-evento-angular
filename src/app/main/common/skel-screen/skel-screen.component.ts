import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skel-screen',
  templateUrl: './skel-screen.component.html',
  styleUrls: ['./skel-screen.component.scss']
})
export class SkelScreenComponent implements OnInit {
  @Input() objectType: any;
  skeletonItems = new Array(5);
  constructor() { }

  ngOnInit(): void {
  }

}
