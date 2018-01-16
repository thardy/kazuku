import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import 'rxjs/add/operator/catch';

@Injectable()
export class HttpService {

    constructor(private http: HttpClient) { }

    get(url: string, params?: any, responseType?: string): Observable<Object> {
        return this.request(url, 'get', undefined, params, responseType);
    }

    post(url: string, body: any, params?: any) {
        return this.request(url, 'post', body, params);
    }

    put(url: string, body: any) {
        return this.request(url, 'put', body);
    }

    delete(url: string) {
        return this.request(url, 'delete');
    }

    private request(url: string, method: string, body?: any, params?: any, responseType?: any): Observable<Object> {
        const headers = new HttpHeaders();

        try {
            const requestOptions = {
                body: body,
                headers: headers,
                params: params
            };
            if (responseType) {
                requestOptions['responseType'] = responseType;
            }
            // if (environment.withCredentials) {
            //     requestOptions['withCredentials'] = true;
            // }

            return this.http.request(method, url, requestOptions);
        }
        catch (error) {
            return Observable.throw(error);
        }

    }

    private createAntiForgeryTokenHeader(headers: HttpHeaders) {
        const tokenElement = document.all['__RequestVerificationToken'];
        if (!tokenElement) {
            console.log('Error: AntiForgeryToken not found.');
            return;
        }
        const token = tokenElement.defaultValue.toString();
        return headers.set('__RequestVerificationToken', token);
    }

}

