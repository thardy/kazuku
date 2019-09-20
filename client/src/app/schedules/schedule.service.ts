import {throwError as observableThrowError, Observable} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {HttpService} from '../common/http.service';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {SitesModule} from '../sites/sites.module';

@Injectable({
    providedIn: 'root'
})
export class ScheduleService {
    protected baseUrl: string;
    protected http: HttpService;

    constructor(http: HttpService) {
        const resourceName = 'schedules';
        this.baseUrl = `${environment.kazukuApiUrl}/${resourceName}`;
        this.http = http;
    }

    getSiteScheduleJob(siteId: string) {
        return this.http.get(`${this.baseUrl}/${siteId}`)
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    save(siteId: string, minutes: number) {
        return this.http.put(`${this.baseUrl}/${siteId}`, {minutes})
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    extractData(response: any) {
        return <any>response || {};
    }

    handleError(error) {
        console.error(error);
        return observableThrowError(error || 'Server error');
    }


}
