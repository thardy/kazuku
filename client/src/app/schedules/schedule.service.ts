import {Inject, Injectable} from '@angular/core';
import {HttpService} from '../common/http.service';
import {environment} from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ScheduleService {
    protected baseUrl: string;
    protected http: HttpService;

    constructor(http: HttpService) {
        const resourceName = 'schedules';
        this.baseUrl =  `${environment.kazukuApiUrl}/${resourceName}`;
        this.http = http;
    }

    getSiteScheduleJob(siteId: string) {
        return this.http.get(`${this.baseUrl}/${siteId}`)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    save(siteId: string, minutes: number) {
        return this.http.put(`${this.baseUrl}/${siteId}`, {minutes})
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    extractData(response: any) {
        return <any>response || {};
    }

    handleError(error) {
        console.error(error);
        return Observable.throw(error || 'Server error');
    }


}
