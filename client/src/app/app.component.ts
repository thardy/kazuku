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
    // pageTitle$: Observable<any> = this.route.data.pipe(
    //     switchMap((data) => {
    //         return data.mainPageTitle;
    //     })
    // );
    isCollapsed = false;
    cogIcon = faCogs;
    title = 'kz works!';

    constructor(private router: Router,
                private route: ActivatedRoute) {

    }

    ngOnInit() {
        console.log('test');
        this.route.data.subscribe((data: any) => {
            console.log(data);
        });
        console.log(this.route);
    }

}
