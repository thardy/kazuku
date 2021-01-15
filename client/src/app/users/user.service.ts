import {Injectable, Inject} from '@angular/core';
import {environment} from '../../environments/environment';

import {GenericService} from '../common/generic.service';
import {HttpService} from '../common/http.service';
import {catchError, map} from 'rxjs/operators';
import {User} from '../common/auth/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService extends GenericService<User> {

    constructor(@Inject(HttpService) http) {
        super('templates', http);
    }

}
