import {Db, Collection, ObjectId, DeleteResult} from 'mongodb';
import moment from 'moment';
import Joi from 'joi';

import {IGenericApiService} from './generic-api-service.interface';
import {IAuditable} from '../models/auditable.interface';
import {IUserContext} from '../models/user-context.interface';
import {ValidationError} from '@common/errors/validation.error';
import {IMultiTenantEntity} from '@common/models/multi-tenant-entity.interface';
import {BadRequestError} from '@common/errors/bad-request.error';
import {DuplicateKeyError} from '@common/errors/duplicate-key.error';
import {IdNotFoundError} from '@common/errors/id-not-found.error';

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
    const cursor = this.collection.find({orgId: userContext.orgId});
    const entities = await cursor.toArray();
    let friendlyEntities: any[] = [];
    entities.forEach((entity) => {
      this.useFriendlyId(entity);
      friendlyEntities.push(entity);
    });
    // allow derived classes to transform the result
    return this.transformList(friendlyEntities);
  }

  async getById(userContext: IUserContext, id: string): Promise<T> {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestError('id is not a valid ObjectId');
    }

    let entity = await this.collection.findOne({_id: new ObjectId(id), orgId: userContext.orgId});
    this.useFriendlyId(entity);
    // allow derived classes to transform the result
    return this.transformSingle(entity);
  }

  create(userContext: IUserContext, entity: T): Promise<T> {
    entity.orgId = userContext.orgId; // this is an important step - we force orgId to be the orgId of the logged-in user
    const validationResult = this.validate(entity);
    this.handleValidationResult(validationResult, 'GenericApiService.create');

    return this.onBeforeCreate(userContext, entity)
      .then((result) => {
        return this.collection.insertOne(entity);
      })
      .then((insertResult) => {
        console.log(`insertResult: ${JSON.stringify(insertResult)}`); // todo: delete me
        if (insertResult.insertedId) {
          // todo: make sure the id gets set on the entity - VERIFY!!!
          this.useFriendlyId(entity);
          this.transformSingle(entity);
        }
        return this.onAfterCreate(userContext, entity);
      })
      .then((afterCreateResult) => {
        return entity; // ignore the result of onAfterCreate and return the created entity
      })
      .catch((err) => {
        console.log(`error in GenericApiService.create - ${err.message}`);
        if (err.code === 11000) {
          throw new DuplicateKeyError(`${this.singularResourceName} already exists`);
        }
        throw new BadRequestError(`Error creating ${this.singularResourceName}`);
      });
  }

  updateById(userContext: IUserContext, id: string, item: T): Promise<T> {
    throw new Error('Method not implemented.');
  }

  deleteById(userContext: IUserContext, id: string): Promise<DeleteResult> {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestError('id is not a valid ObjectId');
    }

    let queryObject = { _id: new ObjectId(id), orgId: userContext.orgId };
    let deleteOneResult: DeleteResult;

    return this.onBeforeDelete(userContext, queryObject)
      .then((result) => {
        return this.collection.deleteOne(queryObject)
      })
      .then((result) => {
        // The deleteOne command returns the following:
        // { acknowledged: true, deletedCount: 1 }
        if (result.deletedCount <= 0) {
          throw new IdNotFoundError();
        }
        deleteOneResult = result;
        return this.onAfterDelete(userContext, queryObject);
      })
      .then((afterDeleteResult) => {
        return deleteOneResult; // ignore the result of onAfter and return what the deleteOne call returned
      });
  }

//     find(orgId, mongoQueryObject, projection) {
//         if (arguments.length < 2) { // need at least the first two
//             return Promise.reject(new Error('Incorrect number of arguments passed to GenericService.find'));
//         }
//
//         // Hardwire orgId into every query
//         mongoQueryObject.orgId = orgId;
//
// //        let projection = {
// //            skip: mongoQuery.skip,
// //            limit: mongoQuery.limit,
// //            fields: mongoQuery.projection,
// //            sort: mongoQuery.sort
// //        };
//
//         return this.collection.find(mongoQueryObject, projection)
//           .then((docs) => {
//               let friendlyDocs = [];
//               _.forEach(docs, (doc) => {
//                   this.useFriendlyId(doc);
//                   friendlyDocs.push(doc);
//               });
//
//               // allow derived classes to transform the result
//               return this.transformList(friendlyDocs);
//           });
//     }
//
//     findOne(orgId, mongoQueryObject, projection) {
//         if (arguments.length < 2) { // need at least the first two
//             return Promise.reject(new Error('Incorrect number of arguments passed to GenericService.find'));
//         }
//
//         // Hardwire orgId into every query
//         mongoQueryObject.orgId = orgId;
//
//         return this.collection.findOne(mongoQueryObject, projection)
//           .then((doc) => {
//               this.useFriendlyId(doc);
//
//               // allow derived classes to transform the result
//               return this.transformSingle(doc);
//           });
//     }
//
//     updateById(id: string, item: T): Promise<T> {
//         if (arguments.length !== 3) {
//             return Promise.reject(new Error('Incorrect number of arguments passed to GenericService.updateById'));
//         }
//         if (!this.isValidObjectId(id)) {
//             return Promise.reject(new TypeError('id is not a valid ObjectId'));
//         }
//         let clone = _.clone(updatedDoc);
//         delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
//         conversionService.convertISOStringDateTimesToMongoDates(clone);
//
//         let queryObject = { _id: new ObjectId(id), orgId: orgId };
//         // $set causes mongo to only update the properties provided, without it, it will delete any properties not provided
//         return this.onBeforeUpdate(orgId, clone)
//           .then((result) => {
//               return this.collection.update(queryObject, {$set: clone})
//           })
//           .then((mongoUpdateResult) => {
//               let promise;
//               if (mongoUpdateResult && mongoUpdateResult.nModified <= 0) {
//                   // nothing was updated, don't call onAfterUpdate
//                   promise = Promise.resolve(mongoUpdateResult);
//               }
//               else {
//                   promise = this.onAfterUpdate(orgId, clone);
//               }
//               return promise;
//           })
//           .then((afterResult) => {
//               if ('nModified' in afterResult) {
//                   // we didn't call onAfterUpdate - we didn't update anything
//                   return afterResult;
//               }
//               else {
//                   clone.id = id; // add the friendly string id back to be returned
//                   return clone; // ignore the result of onAfter and return what the original call returned
//               }
//           });
//     }
//
//     // this is necessary for updating regenerate property to 0 without having BeforeUpdate set it to 1
//     updateByIdWithoutCallingBeforeAndAfterUpdate(orgId, id, updatedDoc) {
//         if (arguments.length !== 3) {
//             return Promise.reject(new Error('Incorrect number of arguments passed to GenericService.updateById'));
//         }
//         if (!this.isValidObjectId(id)) {
//             return Promise.reject(new TypeError('id is not a valid ObjectId'));
//         }
//         let clone = _.clone(updatedDoc);
//         delete clone.id;    // id is our friendly, server-only property (not in db). Mongo uses _id, and we don't want to add id to mongo
//         conversionService.convertISOStringDateTimesToMongoDates(clone);
//
//         let queryObject = { _id: new ObjectId(id), orgId: orgId };
//         // $set causes mongo to only update the properties provided, without it, it will delete any properties not provided
//         return this.collection.update(queryObject, {$set: clone})
//     }
//
//     update(orgId, mongoQueryObject, updatedDoc) {
//         if (arguments.length !== 3) {
//             return Promise.reject(new Error('Incorrect number of arguments passed to GenericService.update'));
//         }
//         let clone = _.clone(updatedDoc);
//         delete clone.id;
//
//         conversionService.convertISOStringDateTimesToMongoDates(clone);
//
//         mongoQueryObject.orgId = orgId;
//
//         return this.onBeforeUpdate(orgId, clone)
//           .then((result) => {
//               return this.collection.update(mongoQueryObject, {$set: clone});
//           })
//           .then((mongoUpdateResult) => {
//               let promise;
//               if (mongoUpdateResult && mongoUpdateResult.nModified <= 0) {
//                   // nothing was updated, don't call onAfterUpdate
//                   promise = Promise.resolve(mongoUpdateResult);
//               }
//               else {
//                   promise = this.onAfterUpdate(orgId, clone);
//               }
//               return promise;
//           })
//           .then((afterResult) => {
//               if ('nModified' in afterResult) {
//                   // we didn't call onAfterUpdate - we didn't update anything
//                   return afterResult;
//               }
//               else {
//                   clone.id = id; // add the friendly string id back to be returned
//                   return clone; // ignore the result of onAfter and return what the original call returned
//               }
//           });
//     }

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

  validate(doc: any): Joi.ValidationResult<any> {
    return {
      error: undefined,
      value: undefined
    };
  }

  handleValidationResult(validationResult: Joi.ValidationResult, methodName: string): void {
    if (validationResult?.error) {
      console.log(`validation error in ${methodName} - ${JSON.stringify(validationResult)}`);
      throw new ValidationError(validationResult.error);
    }
  }

  useFriendlyId(doc: any) {
    if (doc && doc._id) {
      doc.id = doc._id.toHexString();
    }
  }

  isValidObjectId(id: any) {
    let result = false;
    if (typeof id === 'string' || id instanceof String) {
      result = id.match(/^[0-9a-fA-F]{24}$/) ? true : false;
    }
    return result;
  }

  auditForCreate(userContext: IUserContext, doc: IAuditable) {
    const now = moment().utc().toDate();
    // const userId = current.context && current.context.current && current.context.current.user ? current.context.user.email : 'system';
    const userId = userContext?.user?.id ?? 'system';
    doc.created = now;
    doc.createdBy = userId;
    doc.updated = now;
    doc.updatedBy = userId;
  }

  auditForUpdate(userContext: IUserContext, doc: IAuditable) {
    const userId = userContext.user?.id ?? 'system';
    doc.updated = moment().utc().toDate();
    doc.updatedBy = userId;
  }

  onBeforeCreate(userContext: IUserContext, doc: any) {
    this.auditForCreate(userContext, doc);
    return Promise.resolve(doc);
  }

  onAfterCreate(userContext: IUserContext, doc: any) {
    return Promise.resolve(doc);
  }

  onBeforeUpdate(userContext: IUserContext, doc: any) {
    this.auditForUpdate(userContext, doc);
    return Promise.resolve(doc);
  }

  onAfterUpdate(userContext: IUserContext, doc: any) {
    return Promise.resolve(doc);
  }

  onBeforeDelete(userContext: IUserContext, doc: any) {
    return Promise.resolve(doc);
  }

  onAfterDelete(userContext: IUserContext, queryObject: any) {
    return Promise.resolve(queryObject);
  }

  transformList(list: any[]) {
    list.forEach((doc) => this.removeMongoId(doc));
    return list;
  }

  transformSingle(single: any) {
    this.removeMongoId(single);
    return single;
  }

  private removeMongoId(doc: any) {
    if (doc && doc._id) {
      delete doc._id;
    }
  }

}
