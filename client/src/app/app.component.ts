import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AuthService} from './common/auth/auth.service';
import {Store} from '@ngrx/store';
import {SideBarComponent} from "./layout/side-bar/side-bar.component";

// import {LoadAuth} from './common/auth/store/actions/auth.actions';

@Component({
    selector: 'kz-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild(SideBarComponent) sidebar: SideBarComponent;
    @ViewChild('content') content: ElementRef;
    isCollapsed = false;

    constructor(private authService: AuthService,
                private renderer: Renderer2,
                private cdr: ChangeDetectorRef,
                private store: Store<any>) {
        console.log('app component');

    }

    ngOnInit() {}

    ngAfterViewInit() {
        console.log(this.sidebar.el.nativeElement.offsetWidth);
        this.renderer.setStyle(this.content.nativeElement, 'margin-left', this.sidebar.el.nativeElement.offsetWidth + 'px');
        this.cdr.detectChanges();
    }

    logout() {
        this.authService.logout();
    }

}
