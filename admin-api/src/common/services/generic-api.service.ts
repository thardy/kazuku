import {Db, Collection, ObjectId} from 'mongodb';
import moment from 'moment';

import { IGenericApiService } from './generic-api-service.interface';
import {IAuditable} from '../models/auditable.interface';
import {User} from '../models/user.model';
import {IUserContext} from '../models/user-context.interface';

export class GenericApiService<T> implements IGenericApiService<T> {
    db: Db;
    protected collection: Collection;

    constructor(db: Db, collectionName: string) {
        this.db = db;
        this.collection = db.collection(collectionName);
    }

  // getAll(userContext: IUserContext): Promise<T[]> {
  //   throw new Error('Method not implemented.');
  // }
  // getById(userContext: IUserContext, id: string): Promise<T> {
  //   throw new Error('Method not implemented.');
  // }
  create(userContext: IUserContext, item: T): Promise<T> {
    throw new Error('Method not implemented.');
  }
  updateById(userContext: IUserContext, id: string, item: T): Promise<T> {
    throw new Error('Method not implemented.');
  }
  deleteById(userContext: IUserContext, id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getAll(userContext: IUserContext): Promise<T[]> {
    const cursor = this.collection.find({orgId: userContext.orgId});
    const docs = await cursor.toArray();
    let friendlyDocs: any[] = [];
    docs.forEach((doc) => {
      //this.useFriendlyId(doc);
      friendlyDocs.push(doc);
    });
    return this.transformList(friendlyDocs);
  }

  async getById(userContext: IUserContext, id: string): Promise<T> {
    if (!this.isValidObjectId(id)) {
      return Promise.reject(new TypeError('id is not a valid ObjectId'));
    }

    let doc = await this.collection.findOne({_id: new ObjectId(id), orgId: userContext.orgId});
    this.useFriendlyId(doc);
    // allow derived classes to transform the result
    return this.transformSingle(doc);
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
//     create(item: T): Promise<T> {
//         if (arguments.length !== 2) {
//             return Promise.reject(new Error('Incorrect number of arguments passed to GenericService.create'));
//         }
//         doc.orgId = orgId;
//         let valError = this.validate(doc);
//         if (valError) {
//             return Promise.reject(new TypeError(valError));
//         }
//
//         conversionService.convertISOStringDateTimesToMongoDates(doc);
//         let insertedDoc;
//
//         return this.onBeforeCreate(orgId, doc)
//           .then((result) => {
//               return this.collection.insert(doc)
//           })
//           .then((insertResult) => {
//               insertedDoc = insertResult;
//               this.useFriendlyId(insertedDoc);
//               return this.onAfterCreate(orgId, insertedDoc);
//           })
//           .then((afterCreateResult) => {
//               return insertedDoc; // ignore the result of onAfter and return the insertedDoc
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

    // deleteById(id: string): Promise<void> {
    //     if (arguments.length !== 2) {
    //         return Promise.reject(new Error('Incorrect number of arguments passed to GenericService.delete'));
    //     }
    //     if (!this.isValidObjectId(id)) {
    //         return Promise.reject(new TypeError('id is not a valid ObjectId'));
    //     }
    //
    //     let queryObject = { _id: new ObjectId(id), orgId: orgId };
    //     let removeResult;
    //
    //     return this.onBeforeDelete(orgId, queryObject)
    //       .then((result) => {
    //           return this.collection.remove(queryObject)
    //       })
    //       .then((mongoRemoveResult) => {
    //           removeResult = mongoRemoveResult;
    //           return this.onAfterDelete(orgId, queryObject);
    //       })
    //       .then((afterDeleteResult) => {
    //           return removeResult; // ignore the result of onAfter and return what the remove call returned
    //       });
    // }


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
    const userId = userContext?.user?.id ?? 'system_GenericApiService.auditForCreate';
    doc.created = now;
    doc.createdBy = userId;
    doc.updated = now;
    doc.updatedBy = userId;
  }
  auditForUpdate(userContext: IUserContext, doc: IAuditable) {
    const userId = userContext.user.id;
    doc.updated = moment().utc().toDate();
    doc.updatedBy = userId;
  }
  onBeforeCreate(userContext: IUserContext, doc: any) {
    this.auditForCreate(userContext, doc);
    return Promise.resolve(doc);
  }
  onBeforeUpdate(userContext: IUserContext, doc: any) {
    this.auditForUpdate(userContext, doc);
    return Promise.resolve(doc);
  }
  onAfterCreate(userContext: IUserContext, doc: any) { return Promise.resolve(doc); }
  onAfterUpdate(userContext: IUserContext, doc: any) { return Promise.resolve(doc); }
  onBeforeDelete(userContext: IUserContext, doc: any) { return Promise.resolve(doc); }
  onAfterDelete(userContext: IUserContext, queryObject: any) { return Promise.resolve(queryObject); }

  transformList(list: any[]) { return list; }
  transformSingle(single: any) { return single; }

}
