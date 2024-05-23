import {GenericApiService} from '../../common/services/generic-api.service';
import {Db} from 'mongodb';

import {IOrganization} from './organization.model';

export class OrganizationService extends GenericApiService<IOrganization> {
  constructor(db: Db) {
    super(db, 'organizations');
  }
}
