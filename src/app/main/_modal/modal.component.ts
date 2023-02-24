import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

import { ModalService } from './modal.service';
import { trigger, transition, style, animate, state } from '@angular/animations';


@Component({ 
    selector: 'modal', 
    templateUrl: 'modal.component.html', 
    styleUrls: ['modal.component.scss'],
    encapsulation: ViewEncapsulation.None,

    animations: [
        trigger('fade', [
            state('out', style({                
                transform: 'scale3d(0.9, 0.9, 0.9)'
            })),          
            state('in', style({                
                transform: 'scale3d(1, 1, 1)'
            })),
            transition('*=>*', [animate('0.2s')]),
        ])
    ]
})
export class ModalComponent implements OnInit, OnDestroy {
    @Input() id: any;
    @Input() title: any;
    @Input() maxWidth: any;
    @Input() isCloseHidden: boolean = false;
    @Input() isTitleHidden: boolean = false;
    // @Input() title: string;
    @Input() class: any;
    // @Input() class: string;
    private element: any;
     
    state="out";

    constructor(private modalService: ModalService, private el: ElementRef) {
        this.element = el.nativeElement;
    }

    ngOnInit(): void {
        // ensure id attribute exists
        if (!this.id) {
            console.error('modal must have an id');
            return;
        }

        // move element to bottom of page (just before </body>) so it can be displayed above everything else
        document.body.appendChild(this.element);

        // close modal on background click
        
        this.element.addEventListener('click', (el: { target: { className: string; }; }) => {
            if (el.target.className === 'modal') {
                this.close();
            }
        });

        // add self (this modal instance) to the modal service so it's accessible from controllers
        this.modalService.add(this);
    }

    // remove self from modal service when component is destroyed
    ngOnDestroy(): void {
        this.modalService.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(): void {
        this.state = "in";        
        this.element.style.display = 'table';                
        document.body.classList.add('modal-open');
    }

    // close modal
    close(): void {
        this.state = "out";
        this.element.style.display = 'none';        
        document.body.classList.remove('modal-open');
    }
}