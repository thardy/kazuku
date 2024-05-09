import {GenericApiService} from '../../common/services/generic-api.service';
import {Db} from 'mongodb';

import {Organization} from './organization.model';

export class OrganizationService extends GenericApiService<Organization> {
  constructor(db: Db) {
    super(db, 'organizations');
  }
}
