import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {PageHeaderService} from '../services/page-header.service';

@Injectable({providedIn: 'root'})
export class PageHeaderResolver implements Resolve<any> {

    constructor(private pageHeaderService: PageHeaderService,
                private router: Router) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        console.log('Page Header Resolver');
        return this.pageHeaderService.getTestData();
    }
}
