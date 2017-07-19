import {Component, OnInit, OnDestroy} from '@angular/core';
import {SetupService} from "./setup.service";
import {SetupConfig} from "./setup-config.model";
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'kz-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.less']
})
export class SetupComponent implements OnInit, OnDestroy {
    setupConfig: SetupConfig;
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(private setupService: SetupService) {
        this.setupConfig = new SetupConfig();
        this.setupConfig.metaOrgCode = 'admin';
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }


    save(form) {
        this.setupService.initialSetup(this.setupConfig)
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }
}
