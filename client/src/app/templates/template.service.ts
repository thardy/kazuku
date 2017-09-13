import {Injectable, Inject} from '@angular/core';
import {Http, Response} from "@angular/http";
import {environment} from "../../environments/environment";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Template} from "./template.model";
import {GenericService} from "../common/generic.service";

@Injectable()
export class TemplateService extends GenericService<Template> {

    constructor(@Inject(Http) http) {
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

}
