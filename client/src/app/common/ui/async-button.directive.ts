import {Directive, OnInit, Input, OnChanges, ElementRef, Renderer} from '@angular/core';

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
    constructor(private el: ElementRef, private renderer: Renderer) { }

    ngOnInit() {
        // BEWARE - ngOnChanges gets called BEFORE ngOnInit, so if you are using ngOnChanges at all, you should only
        //  use that, and take care of whether or not it's the first time it has been called by yourself.
    }

    ngOnChanges(changes) {
        if (!this.initialized) {
            this.initialized = true;
            this.originalHtml = this.el.nativeElement.innerHTML;
            this.renderer.setElementClass(this.el.nativeElement, 'ui', true);
            this.renderer.setElementClass(this.el.nativeElement, 'button', true);

            if (this.asyncType === 'save') {
                this.renderer.setElementClass(this.el.nativeElement, 'positive', true);
                this.asyncText = 'Saving...';
            }
            else if (this.asyncType === 'cancel') {
                this.renderer.setElementClass(this.el.nativeElement, 'negative', true);
                this.asyncText = 'Cancelling...';
            }
            else if (this.asyncType === 'delete') {
                this.renderer.setElementClass(this.el.nativeElement, 'secondary', true);
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
            this.renderer.setElementProperty(this.el.nativeElement, 'innerHTML', this.asyncText);
        }
        this.renderer.setElementClass(this.el.nativeElement, 'loading', true);
        this.renderer.setElementProperty(this.el.nativeElement, 'disabled', true);
    }

    showNormalState() {
        if (this.asyncText) {
            this.renderer.setElementProperty(this.el.nativeElement, 'innerHTML', this.originalHtml);
        }
        this.renderer.setElementClass(this.el.nativeElement, 'loading', false);
        this.renderer.setElementProperty(this.el.nativeElement, 'disabled', false);
    }
}

