webpackJsonp([1],{

/***/ "../../../../../src async recursive":
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "../../../../../src async recursive";

/***/ }),

/***/ "../../../../../src/app/app-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__("../../../router/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dashboard_dashboard_component__ = __webpack_require__("../../../../../src/app/dashboard/dashboard.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__sites_site_list_component__ = __webpack_require__("../../../../../src/app/sites/site-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__sites_site_component__ = __webpack_require__("../../../../../src/app/sites/site.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_page_list_component__ = __webpack_require__("../../../../../src/app/pages/page-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__templates_template_list_component__ = __webpack_require__("../../../../../src/app/templates/template-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__templates_template_component__ = __webpack_require__("../../../../../src/app/templates/template.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__organizations_organization_list_component__ = __webpack_require__("../../../../../src/app/organizations/organization-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__organizations_organization_component__ = __webpack_require__("../../../../../src/app/organizations/organization.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__login_login_component__ = __webpack_require__("../../../../../src/app/login/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__setup_setup_component__ = __webpack_require__("../../../../../src/app/setup/setup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__setup_setup_guard_service__ = __webpack_require__("../../../../../src/app/setup/setup-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__common_auth_auth_guard_service__ = __webpack_require__("../../../../../src/app/common/auth/auth-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_page_component__ = __webpack_require__("../../../../../src/app/pages/page.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__queries_query_list_component__ = __webpack_require__("../../../../../src/app/queries/query-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__queries_query_component__ = __webpack_require__("../../../../../src/app/queries/query.component.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppRoutingModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

















// This is where we setup our routes!
var APP_ROUTES = [
    { path: 'login', component: __WEBPACK_IMPORTED_MODULE_10__login_login_component__["a" /* LoginComponent */] },
    { path: 'dashboard', component: __WEBPACK_IMPORTED_MODULE_2__dashboard_dashboard_component__["a" /* DashboardComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_13__common_auth_auth_guard_service__["a" /* AuthGuardService */]] },
    { path: 'organizations', component: __WEBPACK_IMPORTED_MODULE_8__organizations_organization_list_component__["a" /* OrganizationListComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_13__common_auth_auth_guard_service__["a" /* AuthGuardService */]] },
    { path: 'organizations/create', component: __WEBPACK_IMPORTED_MODULE_9__organizations_organization_component__["a" /* OrganizationComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_13__common_auth_auth_guard_service__["a" /* AuthGuardService */]] },
    { path: 'organizations/:id', component: __WEBPACK_IMPORTED_MODULE_9__organizations_organization_component__["a" /* OrganizationComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_13__common_auth_auth_guard_service__["a" /* AuthGuardService */]] },
    { path: 'sites', component: __WEBPACK_IMPORTED_MODULE_3__sites_site_list_component__["a" /* SiteListComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_13__common_auth_auth_guard_service__["a" /* AuthGuardService */]] },
    { path: 'sites/create', component: __WEBPACK_IMPORTED_MODULE_4__sites_site_component__["a" /* SiteComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_13__common_auth_auth_guard_service__["a" /* AuthGuardService */]] },
    { path: 'sites/:id', component: __WEBPACK_IMPORTED_MODULE_4__sites_site_component__["a" /* SiteComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_13__common_auth_auth_guard_service__["a" /* AuthGuardService */]] },
    { path: 'pages', component: __WEBPACK_IMPORTED_MODULE_5__pages_page_list_component__["a" /* PageListComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_13__common_auth_auth_guard_service__["a" /* AuthGuardService */]] },
    { path: 'pages/create', component: __WEBPACK_IMPORTED_MODULE_14__pages_page_component__["a" /* PageComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_13__common_auth_auth_guard_service__["a" /* AuthGuardService */]] },
    { path: 'pages/:id', component: __WEBPACK_IMPORTED_MODULE_14__pages_page_component__["a" /* PageComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_13__common_auth_auth_guard_service__["a" /* AuthGuardService */]] },
    { path: 'setup', component: __WEBPACK_IMPORTED_MODULE_11__setup_setup_component__["a" /* SetupComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_12__setup_setup_guard_service__["a" /* SetupGuardService */]] },
    { path: 'templates', component: __WEBPACK_IMPORTED_MODULE_6__templates_template_list_component__["a" /* TemplateListComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_13__common_auth_auth_guard_service__["a" /* AuthGuardService */]] },
    { path: 'templates/create', component: __WEBPACK_IMPORTED_MODULE_7__templates_template_component__["a" /* TemplateComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_13__common_auth_auth_guard_service__["a" /* AuthGuardService */]] },
    { path: 'templates/:id', component: __WEBPACK_IMPORTED_MODULE_7__templates_template_component__["a" /* TemplateComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_13__common_auth_auth_guard_service__["a" /* AuthGuardService */]] },
    { path: 'queries', component: __WEBPACK_IMPORTED_MODULE_15__queries_query_list_component__["a" /* QueryListComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_13__common_auth_auth_guard_service__["a" /* AuthGuardService */]] },
    { path: 'queries/create', component: __WEBPACK_IMPORTED_MODULE_16__queries_query_component__["a" /* QueryComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_13__common_auth_auth_guard_service__["a" /* AuthGuardService */]] },
    { path: 'queries/:id', component: __WEBPACK_IMPORTED_MODULE_16__queries_query_component__["a" /* QueryComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_13__common_auth_auth_guard_service__["a" /* AuthGuardService */]] },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_router__["b" /* RouterModule */].forRoot(APP_ROUTES, { useHash: true })
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_router__["b" /* RouterModule */]
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppRoutingModule);
    return AppRoutingModule;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/app-routing.module.js.map

/***/ }),

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<kz-nav-bar></kz-nav-bar>\r\n<h1>\r\n  {{title}}\r\n</h1>\r\n\r\n<router-outlet></router-outlet>\r\n"

/***/ }),

/***/ "../../../../../src/app/app.component.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(true);
// imports


// module
exports.push([module.i, "", "", {"version":3,"sources":[],"names":[],"mappings":"","file":"app.component.less","sourceRoot":""}]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AppComponent = (function () {
    function AppComponent() {
        this.title = 'kz works!';
    }
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'kz-root',
            template: __webpack_require__("../../../../../src/app/app.component.html"),
            styles: [__webpack_require__("../../../../../src/app/app.component.less")]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/app.component.js.map

/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("../../../forms/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__("../../../http/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angular_in_memory_web_api__ = __webpack_require__("../../../../angular-in-memory-web-api/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_routing_module__ = __webpack_require__("../../../../../src/app/app-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__organizations_organization_list_component__ = __webpack_require__("../../../../../src/app/organizations/organization-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__organizations_organization_component__ = __webpack_require__("../../../../../src/app/organizations/organization.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__sites_site_list_component__ = __webpack_require__("../../../../../src/app/sites/site-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__sites_site_component__ = __webpack_require__("../../../../../src/app/sites/site.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_page_list_component__ = __webpack_require__("../../../../../src/app/pages/page-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__dashboard_dashboard_component__ = __webpack_require__("../../../../../src/app/dashboard/dashboard.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__layout_nav_bar_nav_bar_component__ = __webpack_require__("../../../../../src/app/layout/nav-bar/nav-bar.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__templates_template_list_component__ = __webpack_require__("../../../../../src/app/templates/template-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__templates_template_component__ = __webpack_require__("../../../../../src/app/templates/template.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__custom_schemas_custom_schema_list_component__ = __webpack_require__("../../../../../src/app/custom-schemas/custom-schema-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__custom_data_custom_data_list_component__ = __webpack_require__("../../../../../src/app/custom-data/custom-data-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__queries_query_list_component__ = __webpack_require__("../../../../../src/app/queries/query-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__queries_query_component__ = __webpack_require__("../../../../../src/app/queries/query.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__in_memory_data_service__ = __webpack_require__("../../../../../src/app/in-memory-data.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__templates_template_service__ = __webpack_require__("../../../../../src/app/templates/template.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__organizations_organization_service__ = __webpack_require__("../../../../../src/app/organizations/organization.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__sites_site_service__ = __webpack_require__("../../../../../src/app/sites/site.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__login_login_component__ = __webpack_require__("../../../../../src/app/login/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__users_user_list_component__ = __webpack_require__("../../../../../src/app/users/user-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__queries_query_service__ = __webpack_require__("../../../../../src/app/queries/query.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__users_user_service__ = __webpack_require__("../../../../../src/app/users/user.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__setup_setup_component__ = __webpack_require__("../../../../../src/app/setup/setup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__setup_setup_service__ = __webpack_require__("../../../../../src/app/setup/setup.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__setup_setup_guard_service__ = __webpack_require__("../../../../../src/app/setup/setup-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__common_auth_auth_guard_service__ = __webpack_require__("../../../../../src/app/common/auth/auth-guard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__common_ui_async_button_directive__ = __webpack_require__("../../../../../src/app/common/ui/async-button.directive.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__pages_page_component__ = __webpack_require__("../../../../../src/app/pages/page.component.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


































var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_7__organizations_organization_list_component__["a" /* OrganizationListComponent */],
                __WEBPACK_IMPORTED_MODULE_8__organizations_organization_component__["a" /* OrganizationComponent */],
                __WEBPACK_IMPORTED_MODULE_9__sites_site_list_component__["a" /* SiteListComponent */],
                __WEBPACK_IMPORTED_MODULE_10__sites_site_component__["a" /* SiteComponent */],
                __WEBPACK_IMPORTED_MODULE_11__pages_page_list_component__["a" /* PageListComponent */],
                __WEBPACK_IMPORTED_MODULE_33__pages_page_component__["a" /* PageComponent */],
                __WEBPACK_IMPORTED_MODULE_12__dashboard_dashboard_component__["a" /* DashboardComponent */],
                __WEBPACK_IMPORTED_MODULE_13__layout_nav_bar_nav_bar_component__["a" /* NavBarComponent */],
                __WEBPACK_IMPORTED_MODULE_14__templates_template_list_component__["a" /* TemplateListComponent */],
                __WEBPACK_IMPORTED_MODULE_15__templates_template_component__["a" /* TemplateComponent */],
                __WEBPACK_IMPORTED_MODULE_16__custom_schemas_custom_schema_list_component__["a" /* CustomSchemaListComponent */],
                __WEBPACK_IMPORTED_MODULE_17__custom_data_custom_data_list_component__["a" /* CustomDataListComponent */],
                __WEBPACK_IMPORTED_MODULE_18__queries_query_list_component__["a" /* QueryListComponent */],
                __WEBPACK_IMPORTED_MODULE_19__queries_query_component__["a" /* QueryComponent */],
                __WEBPACK_IMPORTED_MODULE_24__login_login_component__["a" /* LoginComponent */],
                __WEBPACK_IMPORTED_MODULE_25__users_user_list_component__["a" /* UserListComponent */],
                __WEBPACK_IMPORTED_MODULE_28__setup_setup_component__["a" /* SetupComponent */],
                __WEBPACK_IMPORTED_MODULE_32__common_ui_async_button_directive__["a" /* AsyncButtonDirective */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["b" /* ReactiveFormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_5__app_routing_module__["a" /* AppRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_4_angular_in_memory_web_api__["a" /* InMemoryWebApiModule */].forRoot(__WEBPACK_IMPORTED_MODULE_20__in_memory_data_service__["a" /* InMemoryDataService */], { apiBase: 'api/', passThruUnknownUrl: true })
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_22__organizations_organization_service__["a" /* OrganizationService */],
                __WEBPACK_IMPORTED_MODULE_23__sites_site_service__["a" /* SiteService */],
                __WEBPACK_IMPORTED_MODULE_21__templates_template_service__["a" /* TemplateService */],
                __WEBPACK_IMPORTED_MODULE_26__queries_query_service__["a" /* QueryService */],
                __WEBPACK_IMPORTED_MODULE_27__users_user_service__["a" /* UserService */],
                __WEBPACK_IMPORTED_MODULE_29__setup_setup_service__["a" /* SetupService */],
                __WEBPACK_IMPORTED_MODULE_30__setup_setup_guard_service__["a" /* SetupGuardService */],
                __WEBPACK_IMPORTED_MODULE_31__common_auth_auth_guard_service__["a" /* AuthGuardService */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/app.module.js.map

/***/ }),

/***/ "../../../../../src/app/common/auth/auth-guard.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__("../../../../rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__users_user_service__ = __webpack_require__("../../../../../src/app/users/user.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthGuardService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AuthGuardService = (function () {
    function AuthGuardService(userService, router) {
        this.userService = userService;
        this.router = router;
    }
    AuthGuardService.prototype.canActivate = function (route, state) {
        var _this = this;
        if (!this.userService.isLoggedIn()) {
            // check for logged-in user.  If we already have a cookie, don't make the user log in again
            this.userService.getUserContext()
                .catch(function (error) {
                if (error.status === 401) {
                    _this.router.navigate(['login']);
                }
                return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(null);
            })
                .subscribe(function (userContext) {
                if (!userContext) {
                    // need to redirect to login screen
                    _this.router.navigateByUrl("login?returnUrl=" + state.url);
                }
                else {
                    // take them where they wanted to go
                    _this.router.navigateByUrl(state.url);
                }
            });
            return false;
        }
        return true;
    };
    AuthGuardService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__users_user_service__["a" /* UserService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__users_user_service__["a" /* UserService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _b) || Object])
    ], AuthGuardService);
    return AuthGuardService;
    var _a, _b;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/auth-guard.service.js.map

/***/ }),

/***/ "../../../../../src/app/common/base-component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__ = __webpack_require__("../../../../rxjs/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BaseComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var BaseComponent = (function () {
    function BaseComponent() {
        this.ngUnsubscribe = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
    }
    BaseComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    BaseComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'kz-base-component',
            template: ''
        }), 
        __metadata('design:paramtypes', [])
    ], BaseComponent);
    return BaseComponent;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/base-component.js.map

/***/ }),

/***/ "../../../../../src/app/common/generic.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__("../../../../rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of__ = __webpack_require__("../../../../rxjs/add/observable/of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_throw__ = __webpack_require__("../../../../rxjs/add/observable/throw.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_throw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_throw__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__ = __webpack_require__("../../../../rxjs/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_catch__ = __webpack_require__("../../../../rxjs/add/operator/catch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__utils_json_utils__ = __webpack_require__("../../../../../src/app/common/utils/json-utils.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GenericService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var GenericService = (function () {
    function GenericService(resourceName, http) {
        this.baseUrl = __WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].kazukuApiUrl + "/" + resourceName;
        this.http = http;
    }
    GenericService.prototype.getAll = function () {
        var _this = this;
        return this.http.get(this.baseUrl)
            .map(function (response) { return _this.extractDataList(response); })
            .catch(function (error) { return _this.handleError(error); });
    };
    GenericService.prototype.getById = function (id) {
        var _this = this;
        return this.http.get(this.baseUrl + "/" + id)
            .map(function (response) { return _this.extractData(response); })
            .catch(function (error) { return _this.handleError(error); });
    };
    GenericService.prototype.create = function (item) {
        var _this = this;
        return this.http.post("" + this.baseUrl, item)
            .map(function (response) { return _this.extractData(response); })
            .catch(function (error) { return _this.handleError(error); });
    };
    GenericService.prototype.update = function (id, item) {
        var _this = this;
        return this.http.put(this.baseUrl + "/" + id, item)
            .map(function (response) { return _this.extractData(response); })
            .catch(function (error) { return _this.handleError(error); });
    };
    GenericService.prototype.extractDataList = function (response) {
        var data = response.json();
        return data || [];
    };
    GenericService.prototype.extractData = function (response) {
        var data = response.json();
        return data || {};
    };
    GenericService.prototype.handleError = function (error) {
        console.error(error);
        var jsonBody = __WEBPACK_IMPORTED_MODULE_8__utils_json_utils__["a" /* default */].tryParseJSON(error._body);
        if (error.json && jsonBody) {
            return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].throw(jsonBody || 'Server error');
        }
        else {
            return __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].throw(error || 'Server error');
        }
    };
    GenericService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [String, (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === 'function' && _a) || Object])
    ], GenericService);
    return GenericService;
    var _a;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/generic.service.js.map

/***/ }),

/***/ "../../../../../src/app/common/ui/async-button.directive.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AsyncButtonDirective; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

// Example usage:
// <button class="ui button" pd-async-button [asyncInProgress]="loading" [asyncText]="'Saving...'" [asyncType]="'save'" (click)="testClick()"></button>
var AsyncButtonDirective = (function () {
    function AsyncButtonDirective(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.initialized = false;
    }
    AsyncButtonDirective.prototype.ngOnInit = function () {
        // BEWARE - ngOnChanges gets called BEFORE ngOnInit, so if you are using ngOnChanges at all, you should only
        //  use that, and take care of whether or not it's the first time it has been called by yourself.
    };
    AsyncButtonDirective.prototype.ngOnChanges = function (changes) {
        if (!this.initialized) {
            this.initialized = true;
            this.originalHtml = this.el.nativeElement.innerHTML;
            this.renderer.setElementClass(this.el.nativeElement, 'ui', true);
            this.renderer.setElementClass(this.el.nativeElement, 'button', true);
            if (this.asyncType === "save") {
                this.renderer.setElementClass(this.el.nativeElement, 'positive', true);
                this.asyncText = "Saving...";
            }
            else if (this.asyncType === "cancel") {
                this.renderer.setElementClass(this.el.nativeElement, 'negative', true);
                this.asyncText = "Cancelling...";
            }
            else if (this.asyncType === "delete") {
                this.renderer.setElementClass(this.el.nativeElement, 'secondary', true);
                this.asyncText = "Deleting...";
            }
            return;
        }
        if (changes['asyncInProgress']) {
            if (changes['asyncInProgress'].currentValue) {
                this.showAsyncInProgressState();
            }
            else {
                this.showNormalState();
            }
        }
    };
    AsyncButtonDirective.prototype.showAsyncInProgressState = function () {
        if (this.asyncText) {
            this.renderer.setElementProperty(this.el.nativeElement, 'innerHTML', this.asyncText);
        }
        this.renderer.setElementClass(this.el.nativeElement, 'loading', true);
        this.renderer.setElementProperty(this.el.nativeElement, 'disabled', true);
    };
    AsyncButtonDirective.prototype.showNormalState = function () {
        if (this.asyncText) {
            this.renderer.setElementProperty(this.el.nativeElement, 'innerHTML', this.originalHtml);
        }
        this.renderer.setElementClass(this.el.nativeElement, 'loading', false);
        this.renderer.setElementProperty(this.el.nativeElement, 'disabled', false);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Input */])(), 
        __metadata('design:type', Boolean)
    ], AsyncButtonDirective.prototype, "asyncInProgress", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Input */])(), 
        __metadata('design:type', String)
    ], AsyncButtonDirective.prototype, "asyncText", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Input */])(), 
        __metadata('design:type', String)
    ], AsyncButtonDirective.prototype, "asyncType", void 0);
    AsyncButtonDirective = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Directive */])({
            selector: '[kz-async-button]'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* ElementRef */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* ElementRef */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["N" /* Renderer */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["N" /* Renderer */]) === 'function' && _b) || Object])
    ], AsyncButtonDirective);
    return AsyncButtonDirective;
    var _a, _b;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/async-button.directive.js.map

/***/ }),

/***/ "../../../../../src/app/common/utils/json-utils.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// This class is kept simple for easier consumption.  You must not add any dependencies here.  If you need anything
//  injected, you need to change this to a service and provide it in the app module, inject into constructors, etc, etc.
var JsonUtils = (function () {
    function JsonUtils() {
    }
    // this method is a cheap, halfway-decent way to convert a string to json without blowing up if it's not json
    // Usage: const jsonBody = JsonUtils.tryParseJSON(error._body);
    JsonUtils.tryParseJSON = function (jsonString) {
        try {
            var o = JSON.parse(jsonString);
            // Handle non-exception-throwing cases:
            // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
            // but... JSON.parse(null) returns null, and typeof null === "object",
            // so we must check for that, too. Thankfully, null is falsey, so this suffices:
            if (o && typeof o === 'object') {
                return o;
            }
        }
        catch (e) { }
        return false;
    };
    ;
    return JsonUtils;
}());
/* harmony default export */ __webpack_exports__["a"] = (JsonUtils);
//# sourceMappingURL=D:/dev/kazuku/client/src/json-utils.js.map

/***/ }),

/***/ "../../../../../src/app/custom-data/custom-data-list.component.html":
/***/ (function(module, exports) {

module.exports = "<h1>Content</h1>\r\n<ul>\r\n    <li *ngFor=\"let content of contentItems\">\r\n        <a [routerLink]=\"['/content/' + content.id]\">{{content.name}}</a>\r\n    </li>\r\n</ul>\r\n\r\n<button class=\"btn primary\" (click)=\"create()\">Add</button>\r\n"

/***/ }),

/***/ "../../../../../src/app/custom-data/custom-data-list.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomDataListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var CustomDataListComponent = (function () {
    function CustomDataListComponent() {
    }
    CustomDataListComponent.prototype.ngOnInit = function () {
    };
    CustomDataListComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'kz-custom-data',
            template: __webpack_require__("../../../../../src/app/custom-data/custom-data-list.component.html")
        }), 
        __metadata('design:paramtypes', [])
    ], CustomDataListComponent);
    return CustomDataListComponent;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/custom-data-list.component.js.map

/***/ }),

/***/ "../../../../../src/app/custom-schemas/custom-schema-list.component.html":
/***/ (function(module, exports) {

module.exports = "<h1>Custom Schemas</h1>\r\n<ul>\r\n    <li *ngFor=\"let schema of schemas\">\r\n        <a [routerLink]=\"['/custom-models/' + schema.id]\">{{schema.name}}</a>\r\n    </li>\r\n</ul>\r\n\r\n<button class=\"btn primary\" (click)=\"create()\">Add</button>\r\n"

/***/ }),

/***/ "../../../../../src/app/custom-schemas/custom-schema-list.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomSchemaListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var CustomSchemaListComponent = (function () {
    function CustomSchemaListComponent() {
    }
    CustomSchemaListComponent.prototype.ngOnInit = function () {
    };
    CustomSchemaListComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'kz-custom-schemas',
            template: __webpack_require__("../../../../../src/app/custom-schemas/custom-schema-list.component.html")
        }), 
        __metadata('design:paramtypes', [])
    ], CustomSchemaListComponent);
    return CustomSchemaListComponent;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/custom-schema-list.component.js.map

/***/ }),

/***/ "../../../../../src/app/dashboard/dashboard.component.html":
/***/ (function(module, exports) {

module.exports = "<p>\r\n  dashboard works!\r\n</p>\r\n"

/***/ }),

/***/ "../../../../../src/app/dashboard/dashboard.component.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(true);
// imports


// module
exports.push([module.i, "", "", {"version":3,"sources":[],"names":[],"mappings":"","file":"dashboard.component.less","sourceRoot":""}]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/dashboard/dashboard.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DashboardComponent = (function () {
    function DashboardComponent() {
    }
    DashboardComponent.prototype.ngOnInit = function () {
    };
    DashboardComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'kz-dashboard',
            template: __webpack_require__("../../../../../src/app/dashboard/dashboard.component.html"),
            styles: [__webpack_require__("../../../../../src/app/dashboard/dashboard.component.less")]
        }), 
        __metadata('design:paramtypes', [])
    ], DashboardComponent);
    return DashboardComponent;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/dashboard.component.js.map

/***/ }),

/***/ "../../../../../src/app/in-memory-data.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__templates_template_model__ = __webpack_require__("../../../../../src/app/templates/template.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sites_site_model__ = __webpack_require__("../../../../../src/app/sites/site.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__organizations_organization_model__ = __webpack_require__("../../../../../src/app/organizations/organization.model.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InMemoryDataService; });



//import {Resource} from "./resources/resource.model";
var InMemoryDataService = (function () {
    function InMemoryDataService() {
    }
    InMemoryDataService.prototype.createDb = function () {
        var organizations = ORGS;
        var sites = SITES;
        var templates = TEMPLATES;
        // let organizations = SITES;
        // let queries = QUERIES;
        // let orgs = ORGS;
        //return {organizations, sites, templates};
        return {};
    };
    return InMemoryDataService;
}());
var ORGS = [
    new __WEBPACK_IMPORTED_MODULE_2__organizations_organization_model__["a" /* Organization */]({ id: '1', name: 'Designer X', code: 'designerx', statusId: 1, description: 'D X is the coolext' }),
    new __WEBPACK_IMPORTED_MODULE_2__organizations_organization_model__["a" /* Organization */]({ id: '2', name: 'Another Designer', code: 'another', statusId: 1, description: 'Yet another designer' }),
];
var SITES = [
    new __WEBPACK_IMPORTED_MODULE_1__sites_site_model__["a" /* Site */]({ id: '1', name: 'Acme Corp', domainName: 'acme.com', orgId: '1', code: 'acme' }),
    new __WEBPACK_IMPORTED_MODULE_1__sites_site_model__["a" /* Site */]({ id: '2', name: 'Super Church', domainName: 'superchurch.com', orgId: '1', code: 'superchurch' }),
    new __WEBPACK_IMPORTED_MODULE_1__sites_site_model__["a" /* Site */]({ id: '3', name: 'Apartments R Us', domainName: 'apartmentsrus.com', orgId: '1', code: 'apartmentsrus' }),
    new __WEBPACK_IMPORTED_MODULE_1__sites_site_model__["a" /* Site */]({ id: '4', name: 'My Blog', domainName: 'designerx.com', orgId: '1', code: 'designerx' }),
];
var TEMPLATES = [
    new __WEBPACK_IMPORTED_MODULE_0__templates_template_model__["a" /* Template */]({ id: '1', name: 'master', orgId: '1', siteId: '1', template: '{% include "header" %}<div>{{ content }}</div>% include "footer" %}' }),
    new __WEBPACK_IMPORTED_MODULE_0__templates_template_model__["a" /* Template */]({ id: '2', name: 'header', orgId: '1', siteId: '1', template: '<header>This is the header</header>' }),
    new __WEBPACK_IMPORTED_MODULE_0__templates_template_model__["a" /* Template */]({ id: '3', name: 'footer', orgId: '1', siteId: '1', template: '<footer>This is the footer</footer>' }),
    new __WEBPACK_IMPORTED_MODULE_0__templates_template_model__["a" /* Template */]({ id: '4', name: 'home', orgId: '1', siteId: '1', layout: 'master', template: '<h1>Home Page</h1>' }),
    new __WEBPACK_IMPORTED_MODULE_0__templates_template_model__["a" /* Template */]({ id: '5', name: 'blog-list', orgId: '1', siteId: '1', template: '<h1>Blog List</h1>' }),
    new __WEBPACK_IMPORTED_MODULE_0__templates_template_model__["a" /* Template */]({ id: '6', name: 'blog-detail', orgId: '1', siteId: '1', template: '<h1>Blog Detail</h1>' }),
];
//const RESOURCES = [
//  new Resource({id: 11, title: 'How to kill a mule.'}),
//  new Resource({id: 12, title: 'Septic Maintenance: The Definitive Guide.'}),
//  new Resource({id: 13, title: 'Ten ways to anger a badger.'}),
//  new Resource({id: 14, title: 'Things you should never say to your wife.'})
//];
// const LOOKUPS = new Lookups({
//
//
//     orderTypes: [
//         new IdValue({id: 1, value: 'show'}),
//         new IdValue({id: 2, value: 'yo mamas show'}),
//     ],
//     resourceTypes: [
//         new IdValue({id: 1, value: 'image'}),
//         new IdValue({id: 2, value: 'video'}),
//     ]
//
// });
//# sourceMappingURL=D:/dev/kazuku/client/src/in-memory-data.service.js.map

/***/ }),

/***/ "../../../../../src/app/layout/nav-bar/nav-bar.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\r\n    <div class=\"row\">\r\n        <div class=\"col\">\r\n            <ul class=\"nav nav-pills flex-column text-md-left\">\r\n                <li *ngFor=\"let navItem of navItems\" class=\"nav-item\">\r\n                    <a class=\"nav-link\" routerLinkActive=\"active\" [routerLink]=\"['/' + navItem.destination]\">\r\n                        {{navItem.name | uppercase}}\r\n                    </a>\r\n                </li>\r\n                <li class=\"nav-item\" style=\"cursor: pointer\">\r\n                    <a class=\"nav-link\" routerLinkActive=\"active\" (click)=\"logout()\">\r\n                        Logout\r\n                    </a>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n"

/***/ }),

/***/ "../../../../../src/app/layout/nav-bar/nav-bar.component.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(true);
// imports


// module
exports.push([module.i, "", "", {"version":3,"sources":[],"names":[],"mappings":"","file":"nav-bar.component.less","sourceRoot":""}]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/layout/nav-bar/nav-bar.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__ = __webpack_require__("../../../../rxjs/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__users_user_service__ = __webpack_require__("../../../../../src/app/users/user.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__users_user_context_model__ = __webpack_require__("../../../../../src/app/users/user-context.model.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NavBarComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var NavBarComponent = (function () {
    function NavBarComponent(userService, router) {
        this.userService = userService;
        this.router = router;
        this.ngUnsubscribe = new __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__["Subject"]();
        this.userContext = new __WEBPACK_IMPORTED_MODULE_4__users_user_context_model__["a" /* UserContext */]();
    }
    NavBarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.navItems = this.getNavItems();
        this.userService.currentUserContext
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (userContext) {
            _this.userContext = userContext;
            // add extra navItems for metaOrg
            if (userContext.org.isMetaOrg) {
                _this.navItems.push({ name: 'Orgs', destination: 'organizations' });
            }
        });
    };
    NavBarComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    NavBarComponent.prototype.logout = function () {
        var _this = this;
        this.userService.logout()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function () {
            _this.router.navigate(['login']);
        }, function (error) {
            _this.router.navigate(['login']);
        });
    };
    NavBarComponent.prototype.getNavItems = function () {
        var navItems = [];
        navItems.push({ name: 'Dashboard', destination: 'dashboard' });
        navItems.push({ name: 'Sites', destination: 'sites' });
        navItems.push({ name: 'Pages', destination: 'pages' });
        navItems.push({ name: 'Templates', destination: 'templates' });
        navItems.push({ name: 'Queries', destination: 'queries' });
        return navItems;
    };
    NavBarComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'kz-nav-bar',
            template: __webpack_require__("../../../../../src/app/layout/nav-bar/nav-bar.component.html"),
            styles: [__webpack_require__("../../../../../src/app/layout/nav-bar/nav-bar.component.less")]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__users_user_service__["a" /* UserService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__users_user_service__["a" /* UserService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _b) || Object])
    ], NavBarComponent);
    return NavBarComponent;
    var _a, _b;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/nav-bar.component.js.map

/***/ }),

/***/ "../../../../../src/app/login/login.component.html":
/***/ (function(module, exports) {

module.exports = "<h1>Login</h1>\r\n\r\n<!--<div class=\"loginButton\">-->\r\n    <!--<a href=\"/api/users/google\">-->\r\n        <!--<img id=\"googleLoginBtnImg\" src=\"/assets/images/googleLoginBtn.png\" alt=\"Sign-In with Google\">-->\r\n    <!--</a>-->\r\n\r\n    <!--<a href=\"/api/users/facebook\">-->\r\n        <!--<img id=\"facebookLoginBtnImg\" src=\"/assets/images/fbLoginBtn.png\" alt=\"Sign-In with Facebook\">-->\r\n    <!--</a>-->\r\n\r\n    <!--<hr>-->\r\n    <!--<div id=\"or\">or</div>-->\r\n\r\n    <form #loginForm=\"ngForm\" (ngSubmit)=\"login(loginForm)\" novalidate>\r\n        <label for=\"email\">Email</label>\r\n        <input type=\"email\" id=\"email\" name=\"email\" [(ngModel)]=\"user.email\" size=\"30\" maxlength=\"100\" placeholder=\"your@email.com\">\r\n\r\n        <label for=\"email\">Password</label>\r\n        <input type=\"password\" id=\"password\" name=\"password\" [(ngModel)]=\"user.password\" placeholder=\"********\">\r\n        <a href=\"#\">forgot?</a>\r\n\r\n        <button type=\"submit\" kz-async-button [asyncInProgress]=\"loggingIn\" class=\"ui button\">Login</button>\r\n    </form>\r\n<!--</div>-->\r\n"

/***/ }),

/***/ "../../../../../src/app/login/login.component.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(true);
// imports


// module
exports.push([module.i, "hr {\n  display: block;\n  position: relative;\n  margin-bottom: 0;\n  top: 19px;\n  height: 0;\n  border: 0;\n  border-top: 1px solid #e4e6e8;\n  color: #9fa6ad;\n  background-color: #9fa6ad;\n}\n#or {\n  display: inline-block;\n  position: relative;\n  margin: 0;\n  text-align: center;\n  padding: 10px;\n  color: #6a737c;\n  background-color: #fff;\n  vertical-align: baseline;\n}\n", "", {"version":3,"sources":["D:/dev/kazuku/client/src/app/login/D:/dev/kazuku/client/src/app/login/login.component.less","D:/dev/kazuku/client/src/app/login/login.component.less"],"names":[],"mappings":"AAEA;EACI,eAAA;EACA,mBAAA;EACA,iBAAA;EACA,UAAA;EACA,UAAA;EACA,UAAA;EACA,8BAAA;EACA,eAAA;EACA,0BAAA;CCDH;ADID;EACI,sBAAA;EACA,mBAAA;EACA,UAAA;EACA,mBAAA;EACA,cAAA;EACA,eAAA;EACA,uBAAA;EACA,yBAAA;CCFH","file":"login.component.less","sourcesContent":["@import \"../../colors\";\n\nhr {\n    display: block;\n    position: relative;\n    margin-bottom: 0;\n    top: 19px;\n    height: 0;\n    border: 0;\n    border-top: 1px solid @lightGrey;\n    color: @mediumGrey;\n    background-color: @mediumGrey;\n}\n\n#or {\n    display: inline-block;\n    position: relative;\n    margin: 0;\n    text-align: center;\n    padding: 10px;\n    color: @darkGrey;\n    background-color: #fff;\n    vertical-align: baseline;\n}\n","hr {\n  display: block;\n  position: relative;\n  margin-bottom: 0;\n  top: 19px;\n  height: 0;\n  border: 0;\n  border-top: 1px solid #e4e6e8;\n  color: #9fa6ad;\n  background-color: #9fa6ad;\n}\n#or {\n  display: inline-block;\n  position: relative;\n  margin: 0;\n  text-align: center;\n  padding: 10px;\n  color: #6a737c;\n  background-color: #fff;\n  vertical-align: baseline;\n}\n"],"sourceRoot":""}]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/login/login.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__users_user_service__ = __webpack_require__("../../../../../src/app/users/user.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__ = __webpack_require__("../../../../rxjs/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__users_user_model__ = __webpack_require__("../../../../../src/app/users/user.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_takeUntil__ = __webpack_require__("../../../../rxjs/add/operator/takeUntil.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_takeUntil___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_takeUntil__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_router__ = __webpack_require__("../../../router/index.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var LoginComponent = (function () {
    function LoginComponent(userService, router, route) {
        this.userService = userService;
        this.router = router;
        this.route = route;
        this.user = new __WEBPACK_IMPORTED_MODULE_3__users_user_model__["a" /* User */]();
        this.loggingIn = false;
        this.ngUnsubscribe = new __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__["Subject"]();
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    };
    LoginComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    LoginComponent.prototype.login = function (form) {
        var _this = this;
        this.loggingIn = true;
        if (!form.invalid) {
            this.userService.login(this.user.email, this.user.password)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (result) {
                if (_this.returnUrl) {
                    _this.router.navigate([_this.returnUrl]);
                }
                else {
                    _this.router.navigate(['dashboard']);
                }
                _this.loggingIn = false;
            }, function (error) {
                _this.loggingIn = false;
            }, function () {
                _this.loggingIn = false;
            });
        }
    };
    LoginComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'kz-login',
            template: __webpack_require__("../../../../../src/app/login/login.component.html"),
            styles: [__webpack_require__("../../../../../src/app/login/login.component.less")]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__users_user_service__["a" /* UserService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__users_user_service__["a" /* UserService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_5__angular_router__["c" /* ActivatedRoute */]) === 'function' && _c) || Object])
    ], LoginComponent);
    return LoginComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/login.component.js.map

/***/ }),

/***/ "../../../../../src/app/organizations/organization-list.component.html":
/***/ (function(module, exports) {

module.exports = "<h1>Organizations</h1>\r\n<ul>\r\n    <li *ngFor=\"let organization of organizations\">\r\n        <a [routerLink]=\"['/organizations/' + organization.id]\">{{organization.name}}</a>\r\n    </li>\r\n</ul>\r\n\r\n<button class=\"btn primary\" (click)=\"create()\">Add</button>\r\n"

/***/ }),

/***/ "../../../../../src/app/organizations/organization-list.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__organization_service__ = __webpack_require__("../../../../../src/app/organizations/organization.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("../../../router/index.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrganizationListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var OrganizationListComponent = (function () {
    function OrganizationListComponent(organizationService, router) {
        this.organizationService = organizationService;
        this.router = router;
        this.organizations = [];
    }
    OrganizationListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.organizationService.getAll()
            .subscribe(function (organizations) {
            _this.organizations = organizations;
        });
    };
    OrganizationListComponent.prototype.create = function () {
        this.router.navigateByUrl('organizations/create');
    };
    OrganizationListComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'kz-organization-list',
            template: __webpack_require__("../../../../../src/app/organizations/organization-list.component.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__organization_service__["a" /* OrganizationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__organization_service__["a" /* OrganizationService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */]) === 'function' && _b) || Object])
    ], OrganizationListComponent);
    return OrganizationListComponent;
    var _a, _b;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/organization-list.component.js.map

/***/ }),

/***/ "../../../../../src/app/organizations/organization.component.html":
/***/ (function(module, exports) {

module.exports = "<form #form=\"ngForm\" (submit)=\"save(form)\" novalidate class=\"ui form content\">\r\n    <div>\r\n        <div class=\"field\">\r\n            <label>Name</label>\r\n            <input type=\"text\"\r\n                   pattern=\"[\\D]*\"\r\n                   name=\"name\"\r\n                   [(ngModel)]=\"organization.name\">\r\n        </div>\r\n\r\n        <div class=\"field\">\r\n            <label>Code</label>\r\n            <input type=\"text\"\r\n                   name=\"code\"\r\n                   [(ngModel)]=\"organization.code\">\r\n        </div>\r\n\r\n        <div class=\"field\">\r\n            <label>Description</label>\r\n            <textarea type=\"text\" rows=\"4\" cols=\"50\"\r\n                   name=\"description\"\r\n                   [(ngModel)]=\"organization.description\">\r\n            </textarea>\r\n        </div>\r\n\r\n        <div class=\"extra content\">\r\n            <button type=\"submit\" class=\"ui positive button\" [disabled]=\"form.invalid\"\r\n                    kz-async-button [asyncInProgress]=\"saving\" [asyncType]=\"'save'\" [ngClass]=\"{'labeled': !saving, 'icon': !saving}\">\r\n                <i class=\"checkmark icon\"></i> Save\r\n            </button>\r\n            <button type=\"button\" class=\"ui negative button\" (click)=\"cancel(form)\">Cancel</button>\r\n        </div>\r\n\r\n    </div>\r\n</form>\r\n"

/***/ }),

/***/ "../../../../../src/app/organizations/organization.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_base_component__ = __webpack_require__("../../../../../src/app/common/base-component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__organization_model__ = __webpack_require__("../../../../../src/app/organizations/organization.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__organization_service__ = __webpack_require__("../../../../../src/app/organizations/organization.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__ = __webpack_require__("../../../../rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_mergemap__ = __webpack_require__("../../../../rxjs/add/operator/mergemap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_mergemap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_mergemap__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrganizationComponent; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var OrganizationComponent = (function (_super) {
    __extends(OrganizationComponent, _super);
    function OrganizationComponent(route, orgService, router) {
        _super.call(this);
        this.route = route;
        this.orgService = orgService;
        this.router = router;
        this.organization = new __WEBPACK_IMPORTED_MODULE_3__organization_model__["a" /* Organization */]();
        this.saving = false;
        this.original = {};
        this.isCreate = false;
    }
    OrganizationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params
            .flatMap(function (params) {
            var id = params['id'] || '';
            if (id) {
                _this.orgId = id;
                return _this.orgService.getById(_this.orgId);
            }
            else {
                return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(null);
            }
        })
            .subscribe(function (org) {
            if (org) {
                _this.organization = org;
                _this.original = Object.assign({}, _this.organization);
            }
            else {
                _this.isCreate = true;
                _this.organization = new __WEBPACK_IMPORTED_MODULE_3__organization_model__["a" /* Organization */]();
            }
        });
    };
    OrganizationComponent.prototype.save = function (form) {
        var _this = this;
        // validate form
        if (!form.valid) {
            return;
        }
        this.saving = true;
        if (this.isCreate) {
            this.orgService.create(form.value)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (result) {
                _this.saving = false;
                _this.router.navigateByUrl('organizations');
            });
        }
        else {
            this.orgService.update(this.orgId, form.value)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (result) {
                _this.saving = false;
                _this.original = Object.assign({}, _this.organization);
                form.form.markAsPristine();
            });
        }
    };
    OrganizationComponent.prototype.cancel = function (form) {
        if (this.isCreate) {
            this.router.navigateByUrl('organizations');
        }
        else {
            this.organization = Object.assign({}, new __WEBPACK_IMPORTED_MODULE_3__organization_model__["a" /* Organization */](this.original));
            form.form.markAsPristine();
        }
    };
    OrganizationComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'kz-organization',
            template: __webpack_require__("../../../../../src/app/organizations/organization.component.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4__organization_service__["a" /* OrganizationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__organization_service__["a" /* OrganizationService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _c) || Object])
    ], OrganizationComponent);
    return OrganizationComponent;
    var _a, _b, _c;
}(__WEBPACK_IMPORTED_MODULE_2__common_base_component__["a" /* BaseComponent */]));
//# sourceMappingURL=D:/dev/kazuku/client/src/organization.component.js.map

/***/ }),

/***/ "../../../../../src/app/organizations/organization.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Organization; });
var Organization = (function () {
    function Organization(options) {
        if (options === void 0) { options = {}; }
        this.id = options.id;
        this.name = options.name || '';
        this.code = options.code || '';
        this.description = options.description || '';
        this.statusId = options.statusId || 0;
        this.isMetaOrg = options.isMetaOrg || false;
    }
    return Organization;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/organization.model.js.map

/***/ }),

/***/ "../../../../../src/app/organizations/organization.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of__ = __webpack_require__("../../../../rxjs/add/observable/of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_throw__ = __webpack_require__("../../../../rxjs/add/observable/throw.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_throw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_throw__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__("../../../../rxjs/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch__ = __webpack_require__("../../../../rxjs/add/operator/catch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__common_generic_service__ = __webpack_require__("../../../../../src/app/common/generic.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrganizationService; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};







var OrganizationService = (function (_super) {
    __extends(OrganizationService, _super);
    function OrganizationService(http) {
        _super.call(this, 'organizations', http);
    }
    OrganizationService.prototype.getByName = function (name) {
        var _this = this;
        return this.http.get(this.baseUrl + "/getbyname/" + name)
            .map(function (response) { return _this.extractData(response); })
            .catch(function (error) { return _this.handleError(error); });
    };
    OrganizationService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(),
        __param(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Inject */])(__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */])), 
        __metadata('design:paramtypes', [Object])
    ], OrganizationService);
    return OrganizationService;
}(__WEBPACK_IMPORTED_MODULE_6__common_generic_service__["a" /* GenericService */]));
//# sourceMappingURL=D:/dev/kazuku/client/src/organization.service.js.map

/***/ }),

/***/ "../../../../../src/app/pages/page-list.component.html":
/***/ (function(module, exports) {

module.exports = "<h1>Pages</h1>\r\n<ul>\r\n    <li *ngFor=\"let page of pages\">\r\n        <a [routerLink]=\"['/pages/' + page.id]\">{{page.name}}</a>\r\n    </li>\r\n</ul>\r\n\r\n<button class=\"btn primary\" (click)=\"create()\">Add</button>\r\n"

/***/ }),

/***/ "../../../../../src/app/pages/page-list.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__templates_template_service__ = __webpack_require__("../../../../../src/app/templates/template.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("../../../router/index.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PageListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var PageListComponent = (function () {
    function PageListComponent(templateService, router) {
        this.templateService = templateService;
        this.router = router;
        this.pages = [];
        this.loading = false;
    }
    PageListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.templateService.getAllPages()
            .subscribe(function (pages) {
            _this.pages = pages;
            _this.loading = false;
        }, function (error) {
            _this.loading = false;
        });
    };
    PageListComponent.prototype.create = function () {
        this.router.navigateByUrl('pages/create');
    };
    PageListComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'kz-page-list',
            template: __webpack_require__("../../../../../src/app/pages/page-list.component.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__templates_template_service__["a" /* TemplateService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__templates_template_service__["a" /* TemplateService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */]) === 'function' && _b) || Object])
    ], PageListComponent);
    return PageListComponent;
    var _a, _b;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/page-list.component.js.map

/***/ }),

/***/ "../../../../../src/app/pages/page.component.html":
/***/ (function(module, exports) {

module.exports = "<form #form=\"ngForm\" (submit)=\"save(form)\" novalidate class=\"ui form content\">\r\n    <div>\r\n        <div class=\"field\">\r\n            <label>Site</label>\r\n            <select class=\"ui fluid dropdown\" [(ngModel)]=\"page.siteId\" name=\"siteId\" required>\r\n                <option value=\"undefined\" [selected]=\"page.siteId === undefined\">Select a site...</option>\r\n                <option *ngFor=\"let site of sites\" [(ngValue)]=\"site.id\"\r\n                        [selected]=\"page.siteId === site.id\">\r\n                    {{site.name}}\r\n                </option>\r\n            </select>\r\n        </div>\r\n        <div class=\"field\">\r\n            <label>Name</label>\r\n            <input type=\"text\"\r\n                   pattern=\"[\\D]*\"\r\n                   name=\"name\"\r\n                   [(ngModel)]=\"page.name\">\r\n        </div>\r\n        <div class=\"field\">\r\n            <label>Url</label>\r\n            <input type=\"text\"\r\n                   pattern=\"[\\D]*\"\r\n                   name=\"url\"\r\n                   [(ngModel)]=\"page.url\">\r\n        </div>\r\n        <div class=\"field\">\r\n            <label>Description</label>\r\n            <textarea type=\"text\" rows=\"4\" cols=\"50\"\r\n                      name=\"description\"\r\n                      [(ngModel)]=\"page.description\">\r\n            </textarea>\r\n        </div>\r\n\r\n        <div class=\"field\">\r\n            <label>Template</label>\r\n            <textarea type=\"text\" rows=\"14\" cols=\"200\"\r\n                      name=\"template\"\r\n                      [(ngModel)]=\"page.template\">\r\n            </textarea>\r\n        </div>\r\n\r\n        <div class=\"extra content\">\r\n            <button type=\"submit\" class=\"ui positive button\" [disabled]=\"form.invalid\"\r\n                    kz-async-button [asyncInProgress]=\"saving\" [asyncType]=\"'save'\" [ngClass]=\"{'labeled': !saving, 'icon': !saving}\">\r\n                <i class=\"checkmark icon\"></i> Save\r\n            </button>\r\n            <button type=\"button\" class=\"ui negative button\" (click)=\"cancel(form)\">Cancel</button>\r\n        </div>\r\n\r\n    </div>\r\n</form>\r\n"

/***/ }),

/***/ "../../../../../src/app/pages/page.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__templates_template_model__ = __webpack_require__("../../../../../src/app/templates/template.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__templates_template_service__ = __webpack_require__("../../../../../src/app/templates/template.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_base_component__ = __webpack_require__("../../../../../src/app/common/base-component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__ = __webpack_require__("../../../../rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_mergemap__ = __webpack_require__("../../../../rxjs/add/operator/mergemap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_mergemap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_mergemap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__sites_site_service__ = __webpack_require__("../../../../../src/app/sites/site.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PageComponent; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var PageComponent = (function (_super) {
    __extends(PageComponent, _super);
    function PageComponent(route, templateService, router, siteService) {
        _super.call(this);
        this.route = route;
        this.templateService = templateService;
        this.router = router;
        this.siteService = siteService;
        this.page = new __WEBPACK_IMPORTED_MODULE_2__templates_template_model__["a" /* Template */](); // a page is just a Template with a url property
        this.sites = [];
        this.saving = false;
        this.original = {};
        this.isCreate = false;
    }
    PageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.siteService.getAll()
            .subscribe(function (sites) {
            _this.sites = sites;
        }, function (error) {
        });
        this.route.params
            .flatMap(function (params) {
            var id = params['id'] || '';
            if (id) {
                _this.pageId = id;
                return _this.templateService.getById(_this.pageId);
            }
            else {
                return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(null);
            }
        })
            .subscribe(function (page) {
            if (page) {
                _this.page = page;
                _this.original = Object.assign({}, _this.page);
            }
            else {
                _this.isCreate = true;
                _this.page = new __WEBPACK_IMPORTED_MODULE_2__templates_template_model__["a" /* Template */]();
            }
        });
    };
    PageComponent.prototype.save = function (form) {
        var _this = this;
        // validate form
        if (!form.valid) {
            return;
        }
        this.saving = true;
        if (this.isCreate) {
            this.templateService.create(form.value)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (result) {
                _this.saving = false;
                _this.router.navigateByUrl('pages');
            }, function (error) {
                _this.saving = false;
            });
        }
        else {
            this.templateService.update(this.pageId, form.value)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (result) {
                _this.saving = false;
                _this.original = Object.assign({}, _this.page);
                form.form.markAsPristine();
            });
        }
    };
    PageComponent.prototype.cancel = function (form) {
        if (this.isCreate) {
            this.router.navigateByUrl('pages');
        }
        else {
            this.page = Object.assign({}, new __WEBPACK_IMPORTED_MODULE_2__templates_template_model__["a" /* Template */](this.original));
            form.form.markAsPristine();
        }
    };
    PageComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'kz-page',
            template: __webpack_require__("../../../../../src/app/pages/page.component.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__templates_template_service__["a" /* TemplateService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__templates_template_service__["a" /* TemplateService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_7__sites_site_service__["a" /* SiteService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_7__sites_site_service__["a" /* SiteService */]) === 'function' && _d) || Object])
    ], PageComponent);
    return PageComponent;
    var _a, _b, _c, _d;
}(__WEBPACK_IMPORTED_MODULE_4__common_base_component__["a" /* BaseComponent */]));
//# sourceMappingURL=D:/dev/kazuku/client/src/page.component.js.map

/***/ }),

/***/ "../../../../../src/app/queries/query-list.component.html":
/***/ (function(module, exports) {

module.exports = "<h1>Queries</h1>\r\n<ul>\r\n    <li *ngFor=\"let query of queries\">\r\n        <a [routerLink]=\"['/queries/' + query.id]\">{{query.name}}</a>\r\n    </li>\r\n</ul>\r\n\r\n<button class=\"btn primary\" (click)=\"create()\">Add</button>\r\n"

/***/ }),

/***/ "../../../../../src/app/queries/query-list.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__query_service__ = __webpack_require__("../../../../../src/app/queries/query.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("../../../router/index.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QueryListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var QueryListComponent = (function () {
    function QueryListComponent(queryService, router) {
        this.queryService = queryService;
        this.router = router;
        this.queries = [];
    }
    QueryListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.queryService.getAll()
            .subscribe(function (queries) {
            _this.queries = queries;
        });
    };
    QueryListComponent.prototype.create = function () {
        this.router.navigateByUrl('queries/create');
    };
    QueryListComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'kz-query-list',
            template: __webpack_require__("../../../../../src/app/queries/query-list.component.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__query_service__["a" /* QueryService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__query_service__["a" /* QueryService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */]) === 'function' && _b) || Object])
    ], QueryListComponent);
    return QueryListComponent;
    var _a, _b;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/query-list.component.js.map

/***/ }),

/***/ "../../../../../src/app/queries/query.component.html":
/***/ (function(module, exports) {

module.exports = "<form #form=\"ngForm\" (submit)=\"save(form)\" novalidate class=\"ui form content\">\r\n    <div>\r\n        <div class=\"field\">\r\n            <label>Name</label>\r\n            <input type=\"text\"\r\n                   pattern=\"[\\D]*\"\r\n                   name=\"name\"\r\n                   [(ngModel)]=\"query.name\">\r\n        </div>\r\n\r\n        <div class=\"field\">\r\n            <label>Query</label>\r\n            <input type=\"text\"\r\n                   name=\"query\"\r\n                   [(ngModel)]=\"query.query\">\r\n        </div>\r\n\r\n        <div class=\"field\">\r\n            <label>Description</label>\r\n            <textarea type=\"text\" rows=\"4\" cols=\"50\"\r\n                      name=\"description\"\r\n                      [(ngModel)]=\"query.description\">\r\n            </textarea>\r\n        </div>\r\n\r\n        <div class=\"extra content\">\r\n            <button type=\"submit\" class=\"ui positive button\" [disabled]=\"form.invalid\"\r\n                    kz-async-button [asyncInProgress]=\"saving\" [asyncType]=\"'save'\" [ngClass]=\"{'labeled': !saving, 'icon': !saving}\">\r\n                <i class=\"checkmark icon\"></i> Save\r\n            </button>\r\n            <button type=\"button\" class=\"ui negative button\" (click)=\"cancel(form)\">Cancel</button>\r\n        </div>\r\n\r\n    </div>\r\n</form>\r\n"

/***/ }),

/***/ "../../../../../src/app/queries/query.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_base_component__ = __webpack_require__("../../../../../src/app/common/base-component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__query_model__ = __webpack_require__("../../../../../src/app/queries/query.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__query_service__ = __webpack_require__("../../../../../src/app/queries/query.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__ = __webpack_require__("../../../../rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_mergemap__ = __webpack_require__("../../../../rxjs/add/operator/mergemap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_mergemap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_mergemap__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QueryComponent; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var QueryComponent = (function (_super) {
    __extends(QueryComponent, _super);
    function QueryComponent(route, queryService, router) {
        _super.call(this);
        this.route = route;
        this.queryService = queryService;
        this.router = router;
        this.query = new __WEBPACK_IMPORTED_MODULE_3__query_model__["a" /* Query */]();
        this.saving = false;
        this.original = {};
        this.isCreate = false;
    }
    QueryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params
            .flatMap(function (params) {
            var id = params['id'] || '';
            if (id) {
                _this.queryId = id;
                return _this.queryService.getById(_this.queryId);
            }
            else {
                return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(null);
            }
        })
            .subscribe(function (query) {
            if (query) {
                _this.query = query;
                _this.original = Object.assign({}, _this.query);
            }
            else {
                _this.isCreate = true;
                _this.query = new __WEBPACK_IMPORTED_MODULE_3__query_model__["a" /* Query */]();
            }
        });
    };
    QueryComponent.prototype.save = function (form) {
        var _this = this;
        // validate form
        if (!form.valid) {
            return;
        }
        this.saving = true;
        if (this.isCreate) {
            this.queryService.create(form.value)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (result) {
                _this.saving = false;
                _this.router.navigateByUrl('queries');
            });
        }
        else {
            this.queryService.update(this.queryId, form.value)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (result) {
                _this.saving = false;
                _this.original = Object.assign({}, _this.query);
                form.form.markAsPristine();
            });
        }
    };
    QueryComponent.prototype.cancel = function (form) {
        if (this.isCreate) {
            this.router.navigateByUrl('queryies');
        }
        else {
            this.query = Object.assign({}, new __WEBPACK_IMPORTED_MODULE_3__query_model__["a" /* Query */](this.original));
            form.form.markAsPristine();
        }
    };
    QueryComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'kz-query',
            template: __webpack_require__("../../../../../src/app/queries/query.component.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4__query_service__["a" /* QueryService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__query_service__["a" /* QueryService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _c) || Object])
    ], QueryComponent);
    return QueryComponent;
    var _a, _b, _c;
}(__WEBPACK_IMPORTED_MODULE_2__common_base_component__["a" /* BaseComponent */]));
//# sourceMappingURL=D:/dev/kazuku/client/src/query.component.js.map

/***/ }),

/***/ "../../../../../src/app/queries/query.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Query; });
var Query = (function () {
    function Query(options) {
        if (options === void 0) { options = {}; }
        this.id = options.id;
        this.orgId = options.orgId;
        this.siteId = options.siteId;
        this.name = options.name || '';
        this.query = options.query || '';
        this.results = options.results || '';
    }
    return Query;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/query.model.js.map

/***/ }),

/***/ "../../../../../src/app/queries/query.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of__ = __webpack_require__("../../../../rxjs/add/observable/of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_throw__ = __webpack_require__("../../../../rxjs/add/observable/throw.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_throw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_throw__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__("../../../../rxjs/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch__ = __webpack_require__("../../../../rxjs/add/operator/catch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__common_generic_service__ = __webpack_require__("../../../../../src/app/common/generic.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QueryService; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};







var QueryService = (function (_super) {
    __extends(QueryService, _super);
    function QueryService(http) {
        _super.call(this, 'queries', http);
    }
    QueryService.prototype.getByName = function (name) {
        var _this = this;
        return this.http.get(this.baseUrl + "/getbyname/" + name)
            .map(function (response) { return _this.extractData(response); })
            .catch(function (error) { return _this.handleError(error); });
    };
    QueryService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(),
        __param(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Inject */])(__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */])), 
        __metadata('design:paramtypes', [Object])
    ], QueryService);
    return QueryService;
}(__WEBPACK_IMPORTED_MODULE_6__common_generic_service__["a" /* GenericService */]));
//# sourceMappingURL=D:/dev/kazuku/client/src/query.service.js.map

/***/ }),

/***/ "../../../../../src/app/setup/setup-config.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SetupConfig; });
var SetupConfig = (function () {
    function SetupConfig(options) {
        if (options === void 0) { options = {}; }
        this.id = null;
        this.adminPassword = options.adminPassword || '';
        this.adminPasswordConfirm = options.adminPasswordConfirm || '';
        this.metaOrgName = options.metaOrgName || '';
        this.metaOrgCode = options.metaOrgCode || '';
    }
    return SetupConfig;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/setup-config.model.js.map

/***/ }),

/***/ "../../../../../src/app/setup/setup-guard.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__setup_service__ = __webpack_require__("../../../../../src/app/setup/setup.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SetupGuardService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



//import 'rxjs/add/operator/do';
var SetupGuardService = (function () {
    function SetupGuardService(setupService, router) {
        this.setupService = setupService;
        this.router = router;
    }
    SetupGuardService.prototype.canActivate = function (route, state) {
        var _this = this;
        return this.setupService.canWeSetup()
            .map(function (canWeSetup) {
            if (!canWeSetup) {
                _this.router.navigate(['dashboard']);
            }
            return canWeSetup;
        });
    };
    SetupGuardService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__setup_service__["a" /* SetupService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__setup_service__["a" /* SetupService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _b) || Object])
    ], SetupGuardService);
    return SetupGuardService;
    var _a, _b;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/setup-guard.service.js.map

/***/ }),

/***/ "../../../../../src/app/setup/setup.component.html":
/***/ (function(module, exports) {

module.exports = "<form #theForm=\"ngForm\" (ngSubmit)=\"save(theForm)\" class=\"ui form\" >\r\n    <p>Admin username/email is simply \"admin\".  Let's go ahead and set the initial password for the admin user...</p>\r\n    <label for=\"adminPassword\">Admin Password:</label>\r\n    <input [(ngModel)]=\"setupConfig.adminPassword\" id=\"adminPassword\" name=\"adminPassword\" type=\"password\" required>\r\n    <label for=\"adminPasswordConfirm\">Confirm Admin Password:</label>\r\n    <input [(ngModel)]=\"setupConfig.adminPasswordConfirm\" id=\"adminPasswordConfirm\" name=\"adminPasswordConfirm\" type=\"password\" required><br/>\r\n    <label for=\"metaOrgName\">Meta Organization Name:</label>\r\n    <p>\r\n        All content in Kazuku belongs to organizations, and while Kazuku is capable of hosting many organizations, you don't have to use Kazuku\r\n        to host multiple organizations.  There does need to be one \"meta\" organization, however - this will be the name of the\r\n        host organization for this instance of Kazuku.  This can simply be the name of your organization or just your name.\r\n    </p>\r\n    <input [(ngModel)]=\"setupConfig.metaOrgName\" id=\"metaOrgName\"  name=\"metaOrgName\" type=\"text\" required><br/>\r\n    <label for=\"metaOrgCode\">Meta Organization Code:</label>\r\n    <p>Every organization has an organization code.  For simplicity, the meta org always has a hardwired code of \"admin\".</p>\r\n    <input [(ngModel)]=\"setupConfig.metaOrgCode\" id=\"metaOrgCode\"  name=\"metaOrgCode\" type=\"text\" disabled>\r\n    <button type=\"submit\">Save</button>\r\n</form>\r\n"

/***/ }),

/***/ "../../../../../src/app/setup/setup.component.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(true);
// imports


// module
exports.push([module.i, "", "", {"version":3,"sources":[],"names":[],"mappings":"","file":"setup.component.less","sourceRoot":""}]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/setup/setup.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__setup_service__ = __webpack_require__("../../../../../src/app/setup/setup.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__setup_config_model__ = __webpack_require__("../../../../../src/app/setup/setup-config.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Subject__ = __webpack_require__("../../../../rxjs/Subject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_takeUntil__ = __webpack_require__("../../../../rxjs/add/operator/takeUntil.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_takeUntil___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_takeUntil__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SetupComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SetupComponent = (function () {
    function SetupComponent(setupService, router) {
        this.setupService = setupService;
        this.router = router;
        this.ngUnsubscribe = new __WEBPACK_IMPORTED_MODULE_4_rxjs_Subject__["Subject"]();
        this.setupConfig = new __WEBPACK_IMPORTED_MODULE_3__setup_config_model__["a" /* SetupConfig */]();
        this.setupConfig.metaOrgCode = 'admin';
    }
    SetupComponent.prototype.ngOnInit = function () {
    };
    SetupComponent.prototype.ngOnDestroy = function () {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };
    SetupComponent.prototype.save = function (form) {
        var _this = this;
        this.setupService.initialSetup(this.setupConfig)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(function (result) {
            _this.router.navigate(['dashboard']);
        });
    };
    SetupComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'kz-setup',
            template: __webpack_require__("../../../../../src/app/setup/setup.component.html"),
            styles: [__webpack_require__("../../../../../src/app/setup/setup.component.less")]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__setup_service__["a" /* SetupService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__setup_service__["a" /* SetupService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _b) || Object])
    ], SetupComponent);
    return SetupComponent;
    var _a, _b;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/setup.component.js.map

/***/ }),

/***/ "../../../../../src/app/setup/setup.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of__ = __webpack_require__("../../../../rxjs/add/observable/of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_throw__ = __webpack_require__("../../../../rxjs/add/observable/throw.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_throw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_throw__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__("../../../../rxjs/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch__ = __webpack_require__("../../../../rxjs/add/operator/catch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__common_generic_service__ = __webpack_require__("../../../../../src/app/common/generic.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SetupService; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};







var SetupService = (function (_super) {
    __extends(SetupService, _super);
    function SetupService(http) {
        _super.call(this, 'setup', http);
    }
    SetupService.prototype.initialSetup = function (setupConfig) {
        var _this = this;
        return this.http.post(this.baseUrl + "/initialsetup", setupConfig)
            .map(function (response) { return _this.extractData(response); })
            .catch(function (error) { return _this.handleError(error); });
    };
    SetupService.prototype.canWeSetup = function () {
        var _this = this;
        return this.http.get(this.baseUrl + "/setupstate")
            .map(function (response) {
            var data = response.json();
            var setupCompleted = (data && data.data && data.data.setupCompleted) ? data.data.setupCompleted : false;
            return !setupCompleted;
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    SetupService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(),
        __param(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Inject */])(__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */])), 
        __metadata('design:paramtypes', [Object])
    ], SetupService);
    return SetupService;
}(__WEBPACK_IMPORTED_MODULE_6__common_generic_service__["a" /* GenericService */]));
//# sourceMappingURL=D:/dev/kazuku/client/src/setup.service.js.map

/***/ }),

/***/ "../../../../../src/app/sites/site-list.component.html":
/***/ (function(module, exports) {

module.exports = "<h1>Sites</h1>\r\n\r\n<div *ngIf=\"!loading && sites.length <= 0\">\r\n    You haven't added any sites yet.  Add a site!\r\n</div>\r\n\r\n<ul *ngIf=\"!loading && sites.length > 0\">\r\n    <li *ngFor=\"let site of sites\">\r\n        <a [routerLink]=\"['/sites/' + site.id]\">{{site.name}}</a>\r\n    </li>\r\n</ul>\r\n\r\n<button class=\"btn primary\" (click)=\"create()\">Add</button>\r\n"

/***/ }),

/***/ "../../../../../src/app/sites/site-list.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__site_service__ = __webpack_require__("../../../../../src/app/sites/site.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("../../../router/index.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SiteListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SiteListComponent = (function () {
    function SiteListComponent(siteService, router) {
        this.siteService = siteService;
        this.router = router;
        this.sites = [];
        this.loading = true;
    }
    SiteListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.siteService.getAll()
            .subscribe(function (sites) {
            _this.sites = sites;
            _this.loading = false;
        }, function (error) {
            _this.loading = false;
        });
    };
    SiteListComponent.prototype.create = function () {
        this.router.navigateByUrl('sites/create');
    };
    SiteListComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'kz-site-list',
            template: __webpack_require__("../../../../../src/app/sites/site-list.component.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__site_service__["a" /* SiteService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__site_service__["a" /* SiteService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */]) === 'function' && _b) || Object])
    ], SiteListComponent);
    return SiteListComponent;
    var _a, _b;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/site-list.component.js.map

/***/ }),

/***/ "../../../../../src/app/sites/site.component.html":
/***/ (function(module, exports) {

module.exports = "<form #form=\"ngForm\" (submit)=\"save(form)\" novalidate class=\"ui form content\">\r\n    <div>\r\n        <div class=\"field\">\r\n            <label>Name</label>\r\n            <input type=\"text\"\r\n                   pattern=\"[\\D]*\"\r\n                   name=\"name\"\r\n                   [(ngModel)]=\"site.name\">\r\n        </div>\r\n\r\n        <div class=\"field\">\r\n            <label>Site Code</label>\r\n            <input type=\"text\"\r\n                   name=\"code\"\r\n                   [(ngModel)]=\"site.code\">\r\n        </div>\r\n\r\n        <div class=\"field\">\r\n            <label>Domain</label>\r\n            <input type=\"text\"\r\n                   name=\"domain\"\r\n                   [(ngModel)]=\"site.domain\">\r\n        </div>\r\n\r\n        <div class=\"extra content\">\r\n            <button type=\"submit\" class=\"ui positive button\" [disabled]=\"form.invalid\"\r\n                    kz-async-button [asyncInProgress]=\"saving\" [asyncType]=\"'save'\" [ngClass]=\"{'labeled': !saving, 'icon': !saving}\">\r\n                <i class=\"checkmark icon\"></i> Save\r\n            </button>\r\n            <button type=\"button\" class=\"ui negative button\" (click)=\"cancel(form)\">Cancel</button>\r\n        </div>\r\n\r\n    </div>\r\n</form>\r\n"

/***/ }),

/***/ "../../../../../src/app/sites/site.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__site_model__ = __webpack_require__("../../../../../src/app/sites/site.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__site_service__ = __webpack_require__("../../../../../src/app/sites/site.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_base_component__ = __webpack_require__("../../../../../src/app/common/base-component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__ = __webpack_require__("../../../../rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_mergemap__ = __webpack_require__("../../../../rxjs/add/operator/mergemap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_mergemap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_mergemap__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SiteComponent; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var SiteComponent = (function (_super) {
    __extends(SiteComponent, _super);
    function SiteComponent(route, siteService, router) {
        _super.call(this);
        this.route = route;
        this.siteService = siteService;
        this.router = router;
        this.site = new __WEBPACK_IMPORTED_MODULE_2__site_model__["a" /* Site */]();
        this.saving = false;
        this.original = {};
        this.isCreate = false;
    }
    SiteComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params
            .flatMap(function (params) {
            var id = params['id'] || '';
            if (id) {
                _this.siteId = id;
                return _this.siteService.getById(_this.siteId);
            }
            else {
                return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(null);
            }
        })
            .subscribe(function (site) {
            if (site) {
                _this.site = site;
                _this.original = Object.assign({}, _this.site);
            }
            else {
                _this.isCreate = true;
                _this.site = new __WEBPACK_IMPORTED_MODULE_2__site_model__["a" /* Site */]();
            }
        });
    };
    SiteComponent.prototype.save = function (form) {
        var _this = this;
        // validate form
        if (!form.valid) {
            return;
        }
        this.saving = true;
        if (this.isCreate) {
            this.siteService.create(form.value)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (result) {
                _this.saving = false;
                _this.router.navigateByUrl('sites');
            }, function (error) {
                _this.saving = false;
            });
        }
        else {
            this.siteService.update(this.siteId, form.value)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (result) {
                _this.saving = false;
                _this.original = Object.assign({}, _this.site);
                form.form.markAsPristine();
            });
        }
    };
    SiteComponent.prototype.cancel = function (form) {
        if (this.isCreate) {
            this.router.navigateByUrl('sites');
        }
        else {
            this.site = Object.assign({}, new __WEBPACK_IMPORTED_MODULE_2__site_model__["a" /* Site */](this.original));
            form.form.markAsPristine();
        }
    };
    SiteComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'kz-site',
            template: __webpack_require__("../../../../../src/app/sites/site.component.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__site_service__["a" /* SiteService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__site_service__["a" /* SiteService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _c) || Object])
    ], SiteComponent);
    return SiteComponent;
    var _a, _b, _c;
}(__WEBPACK_IMPORTED_MODULE_4__common_base_component__["a" /* BaseComponent */]));
//# sourceMappingURL=D:/dev/kazuku/client/src/site.component.js.map

/***/ }),

/***/ "../../../../../src/app/sites/site.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Site; });
var Site = (function () {
    function Site(options) {
        if (options === void 0) { options = {}; }
        this.id = options.id;
        this.orgId = options.orgId;
        this.code = options.code || '';
        this.name = options.name || '';
        this.domainName = options.domainName || '';
    }
    return Site;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/site.model.js.map

/***/ }),

/***/ "../../../../../src/app/sites/site.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of__ = __webpack_require__("../../../../rxjs/add/observable/of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_throw__ = __webpack_require__("../../../../rxjs/add/observable/throw.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_throw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_throw__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__("../../../../rxjs/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch__ = __webpack_require__("../../../../rxjs/add/operator/catch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__common_generic_service__ = __webpack_require__("../../../../../src/app/common/generic.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SiteService; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};







var SiteService = (function (_super) {
    __extends(SiteService, _super);
    function SiteService(http) {
        _super.call(this, 'sites', http);
    }
    SiteService.prototype.getByName = function (name) {
        var _this = this;
        return this.http.get(this.baseUrl + "/getbyname/" + name)
            .map(function (response) { return _this.extractData(response); })
            .catch(function (error) { return _this.handleError(error); });
    };
    SiteService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(),
        __param(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Inject */])(__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */])), 
        __metadata('design:paramtypes', [Object])
    ], SiteService);
    return SiteService;
}(__WEBPACK_IMPORTED_MODULE_6__common_generic_service__["a" /* GenericService */]));
//# sourceMappingURL=D:/dev/kazuku/client/src/site.service.js.map

/***/ }),

/***/ "../../../../../src/app/templates/template-list.component.html":
/***/ (function(module, exports) {

module.exports = "<h1>Templates</h1>\r\n<ul>\r\n    <li *ngFor=\"let template of templates\">\r\n        <a [routerLink]=\"['/templates/' + template.id]\">{{template.name}}</a>\r\n    </li>\r\n</ul>\r\n\r\n<button class=\"btn primary\" (click)=\"create()\">Add</button>\r\n"

/***/ }),

/***/ "../../../../../src/app/templates/template-list.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_service__ = __webpack_require__("../../../../../src/app/templates/template.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("../../../router/index.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TemplateListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var TemplateListComponent = (function () {
    function TemplateListComponent(templateService, router) {
        this.templateService = templateService;
        this.router = router;
        this.templates = [];
    }
    TemplateListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.templateService.getAllNonPageTemplates()
            .subscribe(function (templates) {
            _this.templates = templates;
        });
    };
    TemplateListComponent.prototype.create = function () {
        this.router.navigateByUrl('templates/create');
    };
    TemplateListComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'kz-template-list',
            template: __webpack_require__("../../../../../src/app/templates/template-list.component.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__template_service__["a" /* TemplateService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__template_service__["a" /* TemplateService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */]) === 'function' && _b) || Object])
    ], TemplateListComponent);
    return TemplateListComponent;
    var _a, _b;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/template-list.component.js.map

/***/ }),

/***/ "../../../../../src/app/templates/template.component.html":
/***/ (function(module, exports) {

module.exports = "<h2>Template</h2>\r\n<form [formGroup]=\"form\" (ngSubmit)=\"save(form)\" novalidate class=\"ui form content\">\r\n    <div>\r\n        <div class=\"field\">\r\n            <label>Name</label>\r\n            <input type=\"text\"\r\n                   id=\"name\"\r\n                   formControlName=\"name\">\r\n        </div>\r\n\r\n        <div class=\"field\">\r\n            <label>Description</label>\r\n            <textarea type=\"text\" rows=\"4\" cols=\"50\"\r\n                      id=\"description\"\r\n                      formControlName=\"description\">\r\n            </textarea>\r\n        </div>\r\n\r\n        <h5>Data Properties</h5>\r\n        <div formArrayName=\"dataProperties\">\r\n            <div *ngFor=\"let dataProperty of form.controls.dataProperties.controls; let i = index\" [formGroupName]=\"i\">\r\n                Name:\r\n                <input type=\"text\"\r\n                       formControlName=\"name\">\r\n                Value:\r\n                <input type=\"text\"\r\n                       formControlName=\"value\">\r\n                <!--<button type=\"button\" class=\"ui positive button\" (click)=\"saveDataProperty(dataProperty)\">Save Data Property</button>-->\r\n                <button type=\"button\" class=\"ui negative button\" (click)=\"deleteDataProperty(i)\">Delete</button><br/>\r\n            </div>\r\n        </div>\r\n        <button type=\"button\" class=\"ui negative button\" (click)=\"addDataProperty()\">Add</button>\r\n\r\n        <div class=\"field\">\r\n            <label>Template</label>\r\n            <textarea type=\"text\" rows=\"15\" cols=\"180\"\r\n                      id=\"template\"\r\n                      formControlName=\"template\">\r\n            </textarea>\r\n        </div>\r\n\r\n        <div class=\"extra content\">\r\n            <button type=\"submit\" class=\"ui positive button\" [disabled]=\"form.invalid\"\r\n                    kz-async-button [asyncInProgress]=\"saving\" [ngClass]=\"{'labeled': !saving, 'icon': !saving}\">\r\n                Save\r\n            </button>\r\n            <button type=\"button\" class=\"ui negative button\" (click)=\"cancel(form)\">Cancel</button>\r\n        </div>\r\n\r\n    </div>\r\n</form>\r\n"

/***/ }),

/***/ "../../../../../src/app/templates/template.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("../../../forms/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__templates_template_model__ = __webpack_require__("../../../../../src/app/templates/template.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__templates_template_service__ = __webpack_require__("../../../../../src/app/templates/template.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__common_base_component__ = __webpack_require__("../../../../../src/app/common/base-component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_mergemap__ = __webpack_require__("../../../../rxjs/add/operator/mergemap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_mergemap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_mergemap__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TemplateComponent; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var systemProperties = ["_id", "id", "orgId", "siteId", "name", "url", "layout", "description", "template", "created", "createdBy", "updated", "updatedBy", "dependencies", "regenerate"];
var TemplateComponent = (function (_super) {
    __extends(TemplateComponent, _super);
    function TemplateComponent(route, templateService, router) {
        _super.call(this);
        this.route = route;
        this.templateService = templateService;
        this.router = router;
        this.template = new __WEBPACK_IMPORTED_MODULE_3__templates_template_model__["a" /* Template */](); // a page is just a Template with a url property
        this.saving = false;
        this.original = {};
        this.isEdit = false;
        this.dataProperties = [];
        this.form = new __WEBPACK_IMPORTED_MODULE_2__angular_forms__["c" /* FormGroup */]({});
        this.dataPropertiesFormArray = new __WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* FormArray */]([]);
    }
    TemplateComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params
            .subscribe(function (params) {
            _this.templateId = params['id'];
            _this.isEdit = params['id'] != null;
            _this.initForm();
        });
    };
    TemplateComponent.prototype.initForm = function () {
        var _this = this;
        if (this.isEdit) {
            this.templateService.getById(this.templateId)
                .subscribe(function (template) {
                if (template) {
                    _this.template = template;
                    var controlArray = _this.form.controls['dataProperties'];
                    for (var property in template) {
                        if (template.hasOwnProperty(property) && !systemProperties.includes(property)) {
                            controlArray.push(new __WEBPACK_IMPORTED_MODULE_2__angular_forms__["c" /* FormGroup */]({
                                'name': new __WEBPACK_IMPORTED_MODULE_2__angular_forms__["e" /* FormControl */](property, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required),
                                'value': new __WEBPACK_IMPORTED_MODULE_2__angular_forms__["e" /* FormControl */](template[property])
                            }));
                        }
                    }
                    _this.original = Object.assign({}, _this.template);
                    _this.form = _this.createFormGroup(_this.template, controlArray);
                }
            });
        }
        this.form = this.createFormGroup(this.template, this.dataPropertiesFormArray);
    };
    TemplateComponent.prototype.createFormGroup = function (model, dataPropertiesFormArray) {
        return new __WEBPACK_IMPORTED_MODULE_2__angular_forms__["c" /* FormGroup */]({
            'name': new __WEBPACK_IMPORTED_MODULE_2__angular_forms__["e" /* FormControl */](model.name, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required),
            'description': new __WEBPACK_IMPORTED_MODULE_2__angular_forms__["e" /* FormControl */](model.description),
            'template': new __WEBPACK_IMPORTED_MODULE_2__angular_forms__["e" /* FormControl */](model.template, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required),
            'dataProperties': dataPropertiesFormArray
        });
    };
    // initDataPropertyFormArray(dataProperties: {name: string, value: string }[]) {
    //     let dataPropertiesFormArray = new FormArray([]);
    //     for (let property of dataProperties) {
    //         dataPropertiesFormArray.push(
    //             new FormGroup({
    //                 'name': new FormControl(property.name, Validators.required),
    //                 'value': new FormControl(property.value)
    //             })
    //         );
    //     }
    //
    //     return dataPropertiesFormArray;
    // }
    TemplateComponent.prototype.save = function (form) {
        var _this = this;
        // validate form
        if (!form.valid) {
            return;
        }
        this.saving = true;
        var templateObject = this.createTemplateObjectFromForm(this.template, form.value);
        this.template = templateObject;
        if (this.isEdit) {
            this.templateService.update(this.templateId, templateObject)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (result) {
                _this.saving = false;
                _this.original = Object.assign({}, _this.template);
                form.form.markAsPristine();
            });
        }
        else {
            this.templateService.create(templateObject)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(function (result) {
                _this.saving = false;
                _this.router.navigateByUrl('templates');
            }, function (error) {
                _this.saving = false;
            });
        }
    };
    TemplateComponent.prototype.cancel = function (form) {
        if (this.isEdit) {
            this.template = Object.assign({}, new __WEBPACK_IMPORTED_MODULE_3__templates_template_model__["a" /* Template */](this.original));
            form.form.markAsPristine();
        }
        else {
            this.router.navigateByUrl('pages');
        }
    };
    TemplateComponent.prototype.saveDataProperty = function (dataProperty) {
        var i = 0;
    };
    TemplateComponent.prototype.addDataProperty = function () {
        var control = this.form.controls['dataProperties'];
        control.push(new __WEBPACK_IMPORTED_MODULE_2__angular_forms__["c" /* FormGroup */]({
            'name': new __WEBPACK_IMPORTED_MODULE_2__angular_forms__["e" /* FormControl */](null, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required),
            'value': new __WEBPACK_IMPORTED_MODULE_2__angular_forms__["e" /* FormControl */](null)
        }));
    };
    TemplateComponent.prototype.deleteDataProperty = function (index) {
        var control = this.form.controls['dataProperties'];
        control.removeAt(index);
    };
    TemplateComponent.prototype.createTemplateObjectFromForm = function (templateObject, formValue) {
        var template = Object.assign({}, formValue);
        delete template.dataProperties;
        // Add dataProperties as properties on the templateObject
        if (formValue.dataProperties) {
            formValue.dataProperties.forEach(function (property) {
                template[property.name] = property.value;
            });
        }
        return template;
    };
    TemplateComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'kz-page',
            template: __webpack_require__("../../../../../src/app/templates/template.component.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4__templates_template_service__["a" /* TemplateService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__templates_template_service__["a" /* TemplateService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _c) || Object])
    ], TemplateComponent);
    return TemplateComponent;
    var _a, _b, _c;
}(__WEBPACK_IMPORTED_MODULE_5__common_base_component__["a" /* BaseComponent */]));
//# sourceMappingURL=D:/dev/kazuku/client/src/template.component.js.map

/***/ }),

/***/ "../../../../../src/app/templates/template.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Template; });
var Template = (function () {
    function Template(options) {
        if (options === void 0) { options = {}; }
        this.id = options.id;
        this.orgId = options.orgId;
        this.siteId = options.siteId;
        this.name = options.name || '';
        this.description = options.description;
        this.url = options.url;
        this.layout = options.layout || '';
        this.template = options.template || '';
    }
    return Template;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/template.model.js.map

/***/ }),

/***/ "../../../../../src/app/templates/template.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of__ = __webpack_require__("../../../../rxjs/add/observable/of.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_throw__ = __webpack_require__("../../../../rxjs/add/observable/throw.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_throw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_throw__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__("../../../../rxjs/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch__ = __webpack_require__("../../../../rxjs/add/operator/catch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__common_generic_service__ = __webpack_require__("../../../../../src/app/common/generic.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TemplateService; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};







var TemplateService = (function (_super) {
    __extends(TemplateService, _super);
    function TemplateService(http) {
        _super.call(this, 'templates', http);
    }
    TemplateService.prototype.getByName = function (name) {
        var _this = this;
        return this.http.get(this.baseUrl + "/getbyname/" + name)
            .map(function (response) { return _this.extractData(response); })
            .catch(function (error) { return _this.handleError(error); });
    };
    TemplateService.prototype.getAllPages = function () {
        var _this = this;
        return this.http.get(this.baseUrl + "/getallpages")
            .map(function (response) { return _this.extractData(response); })
            .catch(function (error) { return _this.handleError(error); });
    };
    TemplateService.prototype.getAllNonPageTemplates = function () {
        var _this = this;
        return this.http.get(this.baseUrl + "/getallnonpagetemplates")
            .map(function (response) { return _this.extractData(response); })
            .catch(function (error) { return _this.handleError(error); });
    };
    TemplateService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(),
        __param(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Inject */])(__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */])), 
        __metadata('design:paramtypes', [Object])
    ], TemplateService);
    return TemplateService;
}(__WEBPACK_IMPORTED_MODULE_6__common_generic_service__["a" /* GenericService */]));
//# sourceMappingURL=D:/dev/kazuku/client/src/template.service.js.map

/***/ }),

/***/ "../../../../../src/app/users/user-context.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__user_model__ = __webpack_require__("../../../../../src/app/users/user.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__organizations_organization_model__ = __webpack_require__("../../../../../src/app/organizations/organization.model.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserContext; });


var UserContext = (function () {
    function UserContext(options) {
        if (options === void 0) { options = {}; }
        this.user = options.user || new __WEBPACK_IMPORTED_MODULE_0__user_model__["a" /* User */]();
        this.org = options.org || new __WEBPACK_IMPORTED_MODULE_1__organizations_organization_model__["a" /* Organization */]();
    }
    return UserContext;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/user-context.model.js.map

/***/ }),

/***/ "../../../../../src/app/users/user-list.component.html":
/***/ (function(module, exports) {

module.exports = "<h1>Users</h1>\r\n<ul>\r\n    <li *ngFor=\"let user of users\">\r\n        <a [routerLink]=\"['/users/' + user.id]\">{{user.name}}</a>\r\n    </li>\r\n</ul>\r\n\r\n<button class=\"btn primary\" (click)=\"create()\">Invite new user</button>\r\n"

/***/ }),

/***/ "../../../../../src/app/users/user-list.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__user_service__ = __webpack_require__("../../../../../src/app/users/user.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("../../../router/index.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var UserListComponent = (function () {
    function UserListComponent(userService, router) {
        this.userService = userService;
        this.router = router;
        this.users = [];
    }
    UserListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.getAll()
            .subscribe(function (users) {
            _this.users = users;
        });
    };
    UserListComponent.prototype.create = function () {
        this.router.navigateByUrl('users/create');
    };
    UserListComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'kz-user-list',
            template: __webpack_require__("../../../../../src/app/users/user-list.component.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__user_service__["a" /* UserService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__user_service__["a" /* UserService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */]) === 'function' && _b) || Object])
    ], UserListComponent);
    return UserListComponent;
    var _a, _b;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/user-list.component.js.map

/***/ }),

/***/ "../../../../../src/app/users/user.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return User; });
var User = (function () {
    function User(options) {
        if (options === void 0) { options = {}; }
        this.id = options.id;
        this.orgId = options.orgId;
        this.email = options.email || '';
        this.password = options.password || '';
    }
    return User;
}());
//# sourceMappingURL=D:/dev/kazuku/client/src/user.model.js.map

/***/ }),

/***/ "../../../../../src/app/users/user.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__("../../../../rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject__ = __webpack_require__("../../../../rxjs/BehaviorSubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_do__ = __webpack_require__("../../../../rxjs/add/operator/do.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_do___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_do__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__user_model__ = __webpack_require__("../../../../../src/app/users/user.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__user_context_model__ = __webpack_require__("../../../../../src/app/users/user-context.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__common_generic_service__ = __webpack_require__("../../../../../src/app/common/generic.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserService; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};








var UserService = (function (_super) {
    __extends(UserService, _super);
    function UserService(http) {
        _super.call(this, 'users', http);
        this.dataStore = { userContext: null };
        this._currentUserContext = new __WEBPACK_IMPORTED_MODULE_3_rxjs_BehaviorSubject__["BehaviorSubject"](new __WEBPACK_IMPORTED_MODULE_6__user_context_model__["a" /* UserContext */]());
    }
    Object.defineProperty(UserService.prototype, "currentUserContext", {
        get: function () {
            return this._currentUserContext.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    UserService.prototype.login = function (email, password) {
        var _this = this;
        return this.http.post(this.baseUrl + "/login", { email: email, password: password })
            .map(function (response) { return _this.extractData(response); }) // we want to let the subscribers check the response.status
            .catch(function (error) { return _this.handleError(error); });
    };
    UserService.prototype.logout = function () {
        var _this = this;
        return this.http.get(this.baseUrl + "/logout")
            .map(function (response) { return _this.extractData(response); })
            .catch(function (error) { return _this.handleError(error); });
    };
    UserService.prototype.getUserContext = function () {
        var _this = this;
        //return this.http.get(`${this.baseUrl}/getloggedinuser`)
        return this.http.get(this.baseUrl + "/getusercontext")
            .map(function (response) { return _this.extractData(response); })
            .do(function (userContext) {
            _this.dataStore.userContext = userContext;
            // subscribers get copies of the user, not the user itself, so any changes they make do not propagate back
            _this._currentUserContext.next(Object.assign(new __WEBPACK_IMPORTED_MODULE_5__user_model__["a" /* User */](), _this.dataStore.userContext));
        })
            .catch(function (error) { return _this.handleError(error); });
    };
    UserService.prototype.isLoggedIn = function () {
        return this.dataStore.userContext ? true : false;
    };
    UserService.prototype.extractData = function (response) {
        var data = response.json();
        return data || {};
    };
    UserService.prototype.handleError = function (error) {
        console.log(error);
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error || 'Server error');
    };
    UserService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(),
        __param(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Inject */])(__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */])), 
        __metadata('design:paramtypes', [Object])
    ], UserService);
    return UserService;
}(__WEBPACK_IMPORTED_MODULE_7__common_generic_service__["a" /* GenericService */]));
//# sourceMappingURL=D:/dev/kazuku/client/src/user.service.js.map

/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
var environment = {
    production: false,
    kazukuApiUrl: '/api'
};
//# sourceMappingURL=D:/dev/kazuku/client/src/environment.js.map

/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");




if (__WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_3__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=D:/dev/kazuku/client/src/main.js.map

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map