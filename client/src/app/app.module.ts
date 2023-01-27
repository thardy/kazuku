import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavBarComponent} from './layout/nav-bar/nav-bar.component';
import {CustomDataListComponent} from './custom-data/custom-data-list.component';
import {OrganizationService} from './organizations/shared/organization.service';
import {SiteService} from './sites/site.service';
import {LoginComponent} from './login/login.component';
import {UserListComponent} from './users/user-list.component';
import {QueryService} from './queries/query.service';
import {AuthService} from './common/auth/auth.service';
import {SetupComponent} from './setup/setup.component';
import {SetupService} from './setup/setup.service';
import {SetupGuardService} from './setup/setup-guard.service';
import {AuthGuardService} from './common/auth/auth-guard.service';
import {CustomDataComponent} from './custom-data/custom-data.component';
import {CustomDataService} from './custom-data/custom-data.service';
import {UnAuthenticatedResponseInterceptor} from './common/interceptors/unauthenticated-response.interceptor';
import {HttpService} from './common/http.service';
import {ContextComponent} from './layout/context/context.component';
import {AutofocusDirective} from './common/ui/autofocus.directive';
import {BaseComponent} from './common/base-component';
import {WorkspaceActionsComponent} from './layout/workspace-actions/workspace-actions.component';
import {DashboardModule} from './dashboard/dashboard.module';
import {OrganizationsModule} from './organizations/organizations.module';
import {SitesModule} from './sites/sites.module';
import {PagesModule} from './pages/pages.module';
import {SharedModule} from './shared/shared.module';
import {SchemaModule} from './custom-schemas/schema.module';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {EffectsModule} from '@ngrx/effects';
import {StoreRouterConnectingModule} from '@ngrx/router-store';

import {effects, reducers} from './store';
import {IdbService} from './common/indexed-db/idb.service';
import {AuthTokenCacheService} from './common/auth/auth-token-cache.service';
import {AuthRequestInterceptor} from './common/interceptors/auth-request.interceptor';
import {KazukuAuthProviderService} from './common/auth/kazuku-auth-provider.service';
import * as fromAuth from './common/auth/store/reducers/auth.reducer';
import {AuthEffects} from './common/auth/store/effects/auth.effects';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {FormsModule} from '@angular/forms';
import {SideBarComponent} from './layout/side-bar/side-bar.component';

registerLocaleData(en);

@NgModule({
    declarations: [
        AppComponent,
        BaseComponent,
        NavBarComponent,
        CustomDataListComponent,
        LoginComponent,
        UserListComponent,
        SetupComponent,
        CustomDataComponent,
        ContextComponent,
        AutofocusDirective,
        WorkspaceActionsComponent,
        SideBarComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        SharedModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        // SchemaFormModule.forRoot(),
        DashboardModule,
        OrganizationsModule,
        SitesModule,
        PagesModule,
        SchemaModule,
        StoreModule.forRoot(reducers, {}),
        StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
        EffectsModule.forRoot(effects),
        StoreRouterConnectingModule.forRoot(),
        StoreModule.forFeature(fromAuth.authFeatureKey, fromAuth.reducer),
        EffectsModule.forFeature([AuthEffects]),
        FormsModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthRequestInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: UnAuthenticatedResponseInterceptor, multi: true },
        HttpService,
        IdbService,
        OrganizationService,
        SiteService,
        QueryService,
        AuthService,
        AuthTokenCacheService,
        KazukuAuthProviderService,
        SetupService,
        SetupGuardService,
        AuthGuardService,
        CustomDataService,
        // {provide: WidgetRegistry, useClass: DefaultWidgetRegistry},
        {
            provide: APP_INITIALIZER,
            useFactory: idbProviderFactory,
            deps: [IdbService],
            multi: true
        },
        // { provide: NZ_I18N, useValue: en_US }
    ],
    entryComponents: [],
    bootstrap: [AppComponent]
})

export class AppModule {
}

export function idbProviderFactory(provider: IdbService) {
    // this is the sequence of events we need to complete before initializing the application.
    //  these things need to happen before ANYTHING else in order to guarantee smooth operation.
    return () => {
        return provider.connectToIDB()
            .then(() => {
                // if we have a service that needs to use idb before anything else happens, initialize it here (and add as
                //  a parameter to this factory function as well as to "deps" in the provider above).
                console.log(`Connected to indexed-db`);
            });
    };
}
