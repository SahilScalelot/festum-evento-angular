import {Directive, ElementRef, OnInit} from '@angular/core';

declare let jQuery: any;

@Directive({
  selector: '[fuseValidNumber]'
})

export class ValidNumberDirective implements OnInit {

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    jQuery(this.el.nativeElement).bind('keypress', function (event: any) {
      if (event.keyCode === 32) {
        event.preventDefault();
      }
      if ((event.keyCode <= 47 || event.keyCode >= 58) && event.keyCode != 13) {
        event.preventDefault();
      }
    });
  }

}
