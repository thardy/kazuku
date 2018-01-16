import {Injectable, Inject} from '@angular/core';
import {environment} from '../../environments/environment';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Template} from './template.model';
import {GenericService} from '../common/generic.service';
import {HttpService} from '../common/http.service';

@Injectable()
export class TemplateService extends GenericService<Template> {

    constructor(@Inject(HttpService) http) {
        super('templates', http);
    }

    getByName(name: string) {
        return this.http.get(`${this.baseUrl}/getbyname/${name}`)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    getAllPages() {
        return this.http.get(`${this.baseUrl}/getallpages`)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

    getAllNonPageTemplates() {
        return this.http.get(`${this.baseUrl}/getallnonpagetemplates`)
            .map(response => this.extractData(response))
            .catch(error => this.handleError(error));
    }

}
