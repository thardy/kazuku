import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Component({
    selector: 'kz-base-component',
    template: ''
})
export class BaseComponent implements OnDestroy {
    protected ngUnsubscribe: Subject<void> = new Subject<void>();

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
