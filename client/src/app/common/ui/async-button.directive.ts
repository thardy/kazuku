import { Directive, OnInit, Input, OnChanges, ElementRef, Renderer2 } from '@angular/core';

// Example usage:
// <button class="ui button" pd-async-button [asyncInProgress]="loading" [asyncText]="'Saving...'" [asyncType]="'save'" (click)="testClick()"></button>

@Directive({
    selector: '[kzAsyncButton]'
})
export class AsyncButtonDirective implements OnInit, OnChanges {
    @Input() asyncInProgress: boolean;
    @Input() asyncText: string;
    @Input() asyncType: string;
    // original html content of the element
    private originalHtml: string;
    private initialized = false;
    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngOnInit() {
        // BEWARE - ngOnChanges gets called BEFORE ngOnInit, so if you are using ngOnChanges at all, you should only
        //  use that, and take care of whether or not it's the first time it has been called by yourself.
    }

    ngOnChanges(changes) {
        if (!this.initialized) {
            this.initialized = true;
            this.originalHtml = this.el.nativeElement.innerHTML;
            this.renderer.addClass(this.el.nativeElement, 'ui');
            this.renderer.addClass(this.el.nativeElement, 'button');

            if (this.asyncType === 'save') {
                this.renderer.addClass(this.el.nativeElement, 'positive');
                this.asyncText = 'Saving...';
            }
            else if (this.asyncType === 'cancel') {
                this.renderer.addClass(this.el.nativeElement, 'negative');
                this.asyncText = 'Cancelling...';
            }
            else if (this.asyncType === 'delete') {
                this.renderer.addClass(this.el.nativeElement, 'secondary');
                this.asyncText = 'Deleting...';
            }

            return;
        }

        if (changes['asyncInProgress']) {
            if (changes['asyncInProgress'].currentValue) {
                this.showAsyncInProgressState();
            } else {
                this.showNormalState();
            }
        }
    }

    showAsyncInProgressState() {
        if (this.asyncText) {
            this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.asyncText);
        }
        this.renderer.addClass(this.el.nativeElement, 'loading');
        this.renderer.setProperty(this.el.nativeElement, 'disabled', true);
    }

    showNormalState() {
        if (this.asyncText) {
            this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.originalHtml);
        }
        this.renderer.removeClass(this.el.nativeElement, 'loading');
        this.renderer.setProperty(this.el.nativeElement, 'disabled', false);
    }
}

