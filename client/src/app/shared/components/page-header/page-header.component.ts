import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'kz-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {
    @Input() pageTitle: string;

    constructor() {
    }

    ngOnInit(): void {
    }

}
