import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
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

    constructor(private setupService: SetupService, private router: Router) {
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
            .subscribe((result) => {
                this.router.navigate(['dashboard']);
            });
    }
}
