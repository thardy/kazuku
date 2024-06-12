import {Db, Collection, ObjectId, DeleteResult, Document, UpdateResult, FindOptions} from 'mongodb';
import moment from 'moment';
import Joi from 'joi';
import _ from 'lodash';
import {BadRequestError, DuplicateKeyError, IdNotFoundError, entityUtils} from '@kazuku-cms/common';

import {IGenericApiService} from './generic-api-service.interface';
import {IAuditable, IUserContext, IMultiTenantEntity} from '@kazuku-cms/common';

export class GenericApiService<T extends IMultiTenantEntity> implements IGenericApiService<T> {
  protected db: Db;
  protected pluralResourceName: string;
  protected singularResourceName: string;
  protected collection: Collection;

  constructor(db: Db, pluralResourceName: string, singularResourceName: string) {
    this.db = db;
    this.pluralResourceName = pluralResourceName;
    this.singularResourceName = singularResourceName;
    this.collection = db.collection(pluralResourceName);
  }

  async getAll(userContext: IUserContext): Promise<T[]> {
    if (!userContext?.orgId) {
      throw new BadRequestError('No userContext.orgId found in GenericApiService.getAll');
    }
    const cursor = this.collection.find({orgId: userContext.orgId});
    const entities = await cursor.toArray();
    const friendlyEntities: any[] = [];
    entities.forEach((entity) => {
      entityUtils.useFriendlyId(entity);
      friendlyEntities.push(entity);
    });
    // allow derived classes to transform the result
    return this.transformList(friendlyEntities);
  }

  async getById(userContext: IUserContext, id: string): Promise<T> {
    if (!entityUtils.isValidObjectId(id)) {
      throw new BadRequestError('id is not a valid ObjectId');
    }
    if (!userContext?.orgId) {
      throw new BadRequestError('No userContext.orgId found in GenericApiService.getById');
    }

    const entity = await this.collection.findOne({_id: new ObjectId(id), orgId: userContext.orgId});
    entityUtils.useFriendlyId(entity);
    // allow derived classes to transform the result
    return this.transformSingle(entity);
  }

  async create(userContext: IUserContext, entity: T): Promise<T> {
    if (!userContext?.orgId) {
      throw new BadRequestError('No userContext.orgId found in GenericApiService.create');
    }
    entity.orgId = userContext.orgId; // this is an important step - we force orgId to be the orgId of the logged-in user
    const validationResult = this.validate(entity);
    entityUtils.handleValidationResult(validationResult, 'GenericApiService.create'); // throws on error

    try {
      const result = await this.onBeforeCreate(userContext, entity);
      const insertResult = await this.collection.insertOne(entity);
      console.log(`insertResult: ${JSON.stringify(insertResult)}`); // todo: delete me
      if (insertResult.insertedId) {
        // mongoDb mutates the entity passed into insertOne to have an _id property - we remove it in transformSingle
        entityUtils.useFriendlyId(entity);
        this.transformSingle(entity);
      }
      const afterCreateResult = await this.onAfterCreate(userContext, entity);
      return entity;
    }
    catch (err: any) {
      console.log(`error in GenericApiService.create - ${err.message}`);
      if (err.code === 11000) {
        throw new DuplicateKeyError(`${this.singularResourceName} already exists`);
      }
      throw new BadRequestError(`Error creating ${this.singularResourceName}`);
    }
  }

  async updateById(userContext: IUserContext, id: string, entity: T): Promise<any> {
    if (!entityUtils.isValidObjectId(id)) {
      throw new BadRequestError('id is not a valid ObjectId');
    }
    if (!userContext?.orgId) {
      throw new BadRequestError('No userContext.orgId found in GenericApiService.updateById');
    }

    let clone = _.clone(entity);
    delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
    clone.orgId = userContext.orgId; // this is an important step - we force orgId to be the orgId of the logged-in user

    if (entity?.orgId && entity?.orgId !== userContext.orgId) {
      // we forced orgId to be the orgId of the logged-in user, but we want to capture the fact that an attempt was made to use a wrong orgId
      throw new BadRequestError('entity.orgId does not match userContext.orgId in GenericApiService.updateById');
    }

    let queryObject = {_id: new ObjectId(id), orgId: userContext.orgId};

    await this.onBeforeUpdate(userContext, clone);
    const mongoUpdateResult = await this.collection.updateOne(queryObject, {$set: clone});

    if (mongoUpdateResult?.modifiedCount > 0) {
      // only call onAfterUpdate if something was updated
      await this.onAfterUpdate(userContext, clone);
    }

    return mongoUpdateResult;
  }

  async updateByIdWithoutBeforeAndAfter(userContext: IUserContext, id: string, entity: T): Promise<any> {
    if (!entityUtils.isValidObjectId(id)) {
      throw new BadRequestError('id is not a valid ObjectId');
    }
    if (!userContext?.orgId) {
      throw new BadRequestError('No userContext.orgId found in GenericApiService.updateByIdWithoutBeforeAndAfter');
    }

    let clone = _.clone(entity);
    delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
    clone.orgId = userContext.orgId; // this is an important step - we force orgId to be the orgId of the logged-in user

    if (entity?.orgId && entity?.orgId !== userContext.orgId) {
      // this should not happen - look into it if it ever does
      console.log(`entity.orgId: ${entity.orgId} does not match userContext.orgId: ${userContext.orgId} in GenericApiService.updateById`);
      throw new BadRequestError('entity.orgId does not match userContext.orgId in GenericApiService.updateById');
    }

    let queryObject = { _id: new ObjectId(id), orgId: userContext.orgId };
    // $set causes mongo to only update the properties provided, without it, it will delete any properties not provided
    const mongoUpdateResult = await this.collection.updateOne(queryObject, {$set: clone});
    return mongoUpdateResult;
  }

  async update(userContext: IUserContext, queryObject: any, entity: T): Promise<any> {
    if (!userContext?.orgId) {
      throw new BadRequestError('No userContext.orgId found in GenericApiService.update');
    }
    let clone = _.clone(entity);
    delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
    clone.orgId = userContext.orgId; // this is an important step - we force orgId to be the orgId of the logged-in user

    if (entity?.orgId && entity?.orgId !== userContext.orgId) {
      // this should not happen - look into it if it ever does
      console.log(`entity.orgId: ${entity.orgId} does not match userContext.orgId: ${userContext.orgId} in GenericApiService.update`);
      throw new BadRequestError('entity.orgId does not match userContext.orgId in GenericApiService.update');
    }

    await this.onBeforeUpdate(userContext, clone);
    // $set causes mongo to only update the properties provided, without it, it will delete any properties not provided
    const mongoUpdateResult = await this.collection.updateMany(queryObject, {$set: clone});

    if (mongoUpdateResult?.modifiedCount > 0) {
      await this.onAfterUpdate(userContext, clone);
    }

    return mongoUpdateResult;
  }

  // todo: Make Work!!! just started (about four years ago)
//    updateBatch(orgId, updatedDocs) {
//        if (arguments.length !== 2) {
//            return Promise.reject(new Error('Incorrect number of arguments passed to GenericService.updateBatch'));
//        }
//        let clone = _.clone(updatedDoc);
//        delete clone.id;
//
//        conversionService.convertISOStringDateTimesToMongoDates(clone);
//
//        mongoQueryObject.orgId = orgId;
//        return this.collection.update(mongoQueryObject, {$set: clone});
//    }


  async deleteById(userContext: IUserContext, id: string): Promise<DeleteResult> {
    if (!entityUtils.isValidObjectId(id)) {
      throw new BadRequestError('id is not a valid ObjectId');
    }
    if (!userContext?.orgId) {
      throw new BadRequestError('No userContext.orgId found in GenericApiService.deleteById');
    }

    let queryObject = { _id: new ObjectId(id), orgId: userContext.orgId };

    await this.onBeforeDelete(userContext, queryObject);
    const deleteResult = await this.collection.deleteOne(queryObject);

    // The deleteOne command returns the following:
    // { acknowledged: true, deletedCount: 1 }
    if (deleteResult.deletedCount <= 0) {
      throw new IdNotFoundError();
    }

    await this.onAfterDelete(userContext, queryObject);

    return deleteResult; // ignore the result of onAfter and return what the deleteOne call returned
  }

  async find(userContext: IUserContext, mongoQueryObject: any, options?: FindOptions<Document> | undefined): Promise<T[]> {
    if (!userContext?.orgId) {
      throw new BadRequestError('No userContext.orgId found in GenericApiService.find');
    }
    // Hardwire orgId into every query
    mongoQueryObject.orgId = userContext.orgId;

    const cursor = this.collection.find(mongoQueryObject, options);
    const entities = await cursor.toArray();
    const friendlyEntities: any[] = [];
    entities.forEach((entity) => {
      entityUtils.useFriendlyId(entity);
      friendlyEntities.push(entity);
    });

    // allow derived classes to transform the result
    return this.transformList(friendlyEntities);
  }

  async findOne(userContext: IUserContext, mongoQueryObject: any, options?: FindOptions<Document> | undefined): Promise<T> {
    if (!userContext?.orgId) {
      throw new BadRequestError('No userContext.orgId found in GenericApiService.findOne');
    }
    // Hardwire orgId into every query
    mongoQueryObject.orgId = userContext.orgId;

    const entity = await this.collection.findOne(mongoQueryObject, options);
    entityUtils.useFriendlyId(entity);

    // allow derived classes to transform the result
    return this.transformSingle(entity);
  }

  validate(doc: any): Joi.ValidationResult<any> {
    return {
      error: undefined,
      value: undefined
    };
  }

  auditForCreate(userContext: IUserContext | undefined, doc: IAuditable) {
    const now = moment().utc().toDate();
    // const userId = current.context && current.context.current && current.context.current.user ? current.context.user.email : 'system';
    const userId = userContext?.user?.id ?? 'system';
    doc.created = now;
    doc.createdBy = userId;
    doc.updated = now;
    doc.updatedBy = userId;
  }

  auditForUpdate(userContext: IUserContext | undefined, doc: IAuditable) {
    const userId = userContext?.user?.id ?? 'system';
    doc.updated = moment().utc().toDate();
    doc.updatedBy = userId;
  }

  onBeforeCreate(userContext: IUserContext | undefined, doc: any) {
    this.auditForCreate(userContext, doc);
    return Promise.resolve(doc);
  }

  onAfterCreate(userContext: IUserContext | undefined, doc: any) {
    return Promise.resolve(doc);
  }

  onBeforeUpdate(userContext: IUserContext | undefined, doc: any) {
    this.auditForUpdate(userContext, doc);
    return Promise.resolve(doc);
  }

  onAfterUpdate(userContext: IUserContext | undefined, doc: any) {
    return Promise.resolve(doc);
  }

  onBeforeDelete(userContext: IUserContext, doc: any) {
    return Promise.resolve(doc);
  }

  onAfterDelete(userContext: IUserContext, queryObject: any) {
    return Promise.resolve(queryObject);
  }

  transformList(list: any[]) {
    list.forEach((doc) => entityUtils.removeMongoId(doc));
    return list;
  }

  transformSingle(single: any) {
    entityUtils.removeMongoId(single);
    return single;
  }

}
