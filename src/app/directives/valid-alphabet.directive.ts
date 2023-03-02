import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[fuseValidAlphabet]'
})

export class ValidAlphabetDirective {
  key: any;
  @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
    this.key = event.keyCode;
    if ((this.key >= 15 && this.key <= 34) || (this.key >= 47 && this.key <= 64) || (this.key >= 123) || (this.key >= 96 && this.key <= 111)) {
      event.preventDefault();
    }
  }
}