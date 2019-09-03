import {Component} from '@angular/core';
import {faCogs} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'kz-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    cogIcon = faCogs;
    title = 'kz works!';
}
