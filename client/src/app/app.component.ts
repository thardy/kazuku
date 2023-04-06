import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AuthService} from '@common/auth/auth.service';
import {Store} from '@ngrx/store';
import {SideBarComponent} from "./layout/side-bar/side-bar.component";
import {AuthActions} from '@common/auth/store';
import {tap} from 'rxjs/operators';

@Component({
    selector: 'kz-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild(SideBarComponent) sidebar: SideBarComponent;
    @ViewChild('content') content: ElementRef;
    isCollapsed = false;
    isAuthenticated = false;

    constructor(private authService: AuthService,
                private renderer: Renderer2,
                private cdr: ChangeDetectorRef,
                private store: Store<any>) {
        console.log('app component');

    }

    ngOnInit() {
        this.authService.authState$
            .pipe(
                tap((authState) => {
                    if (authState.isAuthenticated) {
                        // todo: auth - if we want to skip the api call to getUserContext when using KazukuAuth, this is where we would
                        //  handle that.  We would check for the presence of authState.userContext, and we could pass it as a parameter
                        //  to this action.  We would have to edit the effect to conditionally call getUserContext only if the parameter
                        //  is null/undefined.  We would also need to add a reducer for userAuthenticatedWithIdentityProvider that
                        //  only changed state if the parameter was not null/undefined.  That would allow the store code to remain the same
                        //  for KazukuAuth and Okta or Auth0, but we would skip the getUserContext api call if KazukuAuth is being used.
                        this.store.dispatch(AuthActions.userAuthenticatedWithIdentityProvider());
                    }
                    else {
                        // handle unplanned logout here
                        this.store.dispatch(AuthActions.userLoggedOut());
                    }
                    this.isAuthenticated = authState.isAuthenticated;
                })
            )
            .subscribe();
    }

    ngAfterViewInit() {
        console.log(this.sidebar.el.nativeElement.offsetWidth);
        this.renderer.setStyle(this.content.nativeElement, 'margin-left', this.sidebar.el.nativeElement.offsetWidth + 'px');
        this.cdr.detectChanges();
    }

    logout() {
        this.store.dispatch(AuthActions.logoutButtonClicked());
    }
}
