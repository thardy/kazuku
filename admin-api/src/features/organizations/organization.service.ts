import {GenericApiService} from '../../common/services/generic-api.service';
import {Db, DeleteResult, Document, FindOptions, ObjectId} from 'mongodb';
import _ from 'lodash';

import {IOrganization, Organization} from '#common/models/organization.model';
import config from '#server/config/config';
import {BadRequestError} from '#common/errors/bad-request.error';
import {IUserContext} from '#common/models/user-context.interface';
import {DuplicateKeyError} from '#common/errors/duplicate-key.error';
import {ISite, Site} from '#features/sites/site.model';
import {IdNotFoundError} from '#common/errors/id-not-found.error';
import entityUtils from '#common/utils/entity.utils';

/**
 * This class is implemented as a Singleton to cache all organizations in memory.
 * It overrides almost everything because organizations are the one entity that doesn't use orgIds to manage multi-tenancy.
 * It's possible to refactor out the multi-tenant stuff from GenericApiService and reuse much more here,
 * so feel free to do so if it can be done cleanly without impact to other services.
 */
export class OrganizationService extends GenericApiService<IOrganization> {
  private static instance: OrganizationService;
  // todo: once we start having thousands of orgs, research using a separate cache mechanism instead of an in-memory cache.
  private orgCache: IOrganization[];

  private constructor(db: Db) {
    super(db, 'organizations', 'organization');

    // we will cache all orgs here because we use orgs in a lot of low-level code (e.g. every incoming content-api request!!!)
    this.orgCache = [];
    this.getAll()
      .then((orgs: IOrganization[]) => {
        this.orgCache = orgs;
      })
      .catch((error: Error) => {
        console.log('failed to getAll orgs in OrganizationService constructor');
      });

  }

  static getInstance(db: Db) {
    if (!this.instance) {
      this.instance = new OrganizationService(db);
    }

    return this.instance;
  }

  override async getAll() {
    const cursor = this.collection.find({});
    const entities = await cursor.toArray();
    let friendlyEntities: any[] = [];
    entities.forEach((entity) => {
      entityUtils.useFriendlyId(entity);
      friendlyEntities.push(entity);
    });
    // allow derived classes to transform the result
    return this.transformList(friendlyEntities);
  }

  // Typescript won't allow an overload that takes one argument instead of two, so we
  //  have to use unique method names.
  async getOrgById(id: string){
    let entity;

    if (!entityUtils.isValidObjectId(id)) {
      throw new BadRequestError('id is not a valid ObjectId');
    }

    console.log(`orgCache: ${JSON.stringify(this.orgCache)}`); // todo: delete me
    if (config.cache.orgCache && this.orgCache?.length > 0) {
      entity = _.find(this.orgCache, {id: id});
    }
    else {
      console.log(`calling collection.findOne id = ${id}`); // todo: delete me
      entity = await this.collection.findOne({_id: new ObjectId(id)});
      console.log(`entity: ${JSON.stringify(entity)}`); // todo: delete me
      entityUtils.useFriendlyId(entity);
    }

    // allow derived classes to transform the result
    return this.transformSingle(entity);
  }

  async findOne(mongoQueryObject: any, options?: FindOptions<Document> | undefined): Promise<IOrganization> {
    let entity;

    if (config.cache.orgCache && this.orgCache?.length > 0) {
      entity = _.find(this.orgCache, mongoQueryObject);
    }
    else {
      entity = await this.collection.findOne(mongoQueryObject, options);
      entityUtils.useFriendlyId(entity);
    }

    // allow derived classes to transform the result
    return this.transformSingle(entity);
  }

  override async create(userContext: IUserContext | undefined, entity: IOrganization): Promise<IOrganization> {
    // this is one of the few api functions that does not require a userContext (to handle scenarios like initialSetup)
    const validationResult = this.validate(entity);
    entityUtils.handleValidationResult(validationResult, 'OrganizationService.create');

    try {
      const result = await this.onBeforeCreate(userContext, entity);
      const insertResult = await this.collection.insertOne(entity);
      console.log(`insertResult: ${JSON.stringify(insertResult)}`); // todo: delete me
      if (insertResult.insertedId) { // presence of an insertedId means the insert was successful
        this.orgCache.push(entity);
        // mongoDb mutates the entity passed into insertOne to have an _id property - we remove it in transformSingle
        entityUtils.useFriendlyId(entity);
        this.transformSingle(entity);
      }
      const afterCreateResult = await this.onAfterCreate(userContext, entity);
      return entity;
    }
    catch (err: any) {
      console.log(`error in OrganizationService.create - ${err.message}`);
      if (err.code === 11000) {
        throw new DuplicateKeyError(`${this.singularResourceName} already exists`);
      }
      throw new BadRequestError(`Error creating ${this.singularResourceName}`);
    }
  }

  override async updateById(userContext: IUserContext, id: string, entity: IOrganization): Promise<any> {
    if (!entityUtils.isValidObjectId(id)) {
      throw new BadRequestError('id is not a valid ObjectId');
    }

    let clone = _.clone(entity);
    delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
    let queryObject = { _id: new ObjectId(id) };

    await this.onBeforeUpdate(userContext, clone);
    const mongoUpdateResult = await this.collection.updateOne(queryObject, {$set: clone});

    if (mongoUpdateResult?.modifiedCount > 0) {
      // only call onAfterUpdate if something was updated
      await this.onAfterUpdate(userContext, clone);

      // update orgCache if update was successful
      const updatedOrg = await this.getOrgById(id); // have to get org because entity can be a partial object
      const cachedItem = _.find(this.orgCache, queryObject);
      _.assign(cachedItem, updatedOrg);
    }

    return mongoUpdateResult;
  }

  override async deleteById(userContext: IUserContext, id: string): Promise<DeleteResult> {
    if (!entityUtils.isValidObjectId(id)) {
      throw new BadRequestError('id is not a valid ObjectId');
    }

    let queryObject = { _id: new ObjectId(id) };

    await this.onBeforeDelete(userContext, queryObject);
    const deleteResult = await this.collection.deleteOne(queryObject);

    // The deleteOne command returns the following:
    // { acknowledged: true, deletedCount: 1 }
    if (deleteResult.deletedCount <= 0) {
      throw new IdNotFoundError();
    }

    // remove from orgCache if delete was successful
    _.remove(this.orgCache, (org: any) => org.id === id);

    await this.onAfterDelete(userContext, queryObject);

    return deleteResult; // ignore the result of onAfter and return what the deleteOne call returned
  }

  async getAuthTokenByRepoCode(orgId: string) {
    // until we implement repos, we use orgId - repos are a feature providing separate data repositories for a single org
    const org = await this.getOrgById(orgId);
    return org ? org.authToken : null;
  }

  async validateRepoAuthToken(orgCode: string, authToken: string) {
    // this is used to auth content-api calls - the orgCode is used in the api call hostname
    const org = await this.findOne({ code: orgCode });

    const orgId = org.authToken === authToken ? org.id : null;

    return orgId;
  }

  override validate(entity: ISite) {
    return Organization.validationSchema.validate(entity, {abortEarly: false});
  }

}
