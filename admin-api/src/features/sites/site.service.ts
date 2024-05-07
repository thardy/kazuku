import {GenericApiService} from '../../common/services/generic-api.service';
import {Db} from 'mongodb';

export class SiteService extends GenericApiService<any> {
  constructor(db: Db) {
    super(db, 'sites');
  }
}
