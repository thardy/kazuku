import {Component, OnInit} from '@angular/core';
import {faCogs} from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
    selector: 'kz-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    isCollapsed = false;
    cogIcon = faCogs;
    title = 'kz works!';

    constructor(private router: Router,
                private route: ActivatedRoute) {

    }

    ngOnInit() {}

}
