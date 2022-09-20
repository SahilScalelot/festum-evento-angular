import {Directive, ElementRef, OnInit} from '@angular/core';

declare let jQuery: any;

@Directive({
  selector: '[fuseValidNumberWithDecimal]'
})
export class ValidNumberWithDecimalDirective implements OnInit {

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    jQuery(this.el.nativeElement).bind('keypress', function (event: any) {
      if (event.keyCode === 32) {
        event.preventDefault();
      }
      if ((event.keyCode <= 47 || event.keyCode >= 58) && event.keyCode != 46 && event.keyCode != 13) {
        event.preventDefault();
      }
    });
  }

}
