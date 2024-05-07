import {Db, InsertOneResult} from 'mongodb';

import {GenericApiService} from '../../common/services/generic-api.service';
import conversionUtils from '../../common/utils/conversion.utils';
import {User} from '../../common/models/user.model';
import Joi from 'joi';
import {BadRequestError} from '../../common/errors/bad-request-error';
import {ExistingDocumentError} from '../../common/errors/existing-document-error';

export class AuthService extends GenericApiService<User> {
  constructor(db: Db) {
    super(db, 'users');
  }

  // createUser(orgId: any, user: User): Promise<User | void> {
  //   return this.collection.insertOne(user)
  //     .then((result: InsertOneResult<User>) => {
  //       return user;
  //     });
  // }
  createUser(orgId: any, user: User): Promise<User | void> {
    user.orgId = orgId;

    console.log(`user = ${JSON.stringify(user)}`);
    const validationResult = User.validationSchema.validate(user);
    if (validationResult?.error) {
      console.log(JSON.stringify(validationResult));
      return Promise.reject(new TypeError(`validation error - ${validationResult.error}`));
    }

    conversionUtils.convertISOStringDateTimesToJSDates(user);

    // check for existing user
    // console.log('calling getUserByEmail');
    // return this.getUserByEmail(user.email)
    //   .then((existingUser: User) => {
    //     if (existingUser) {
    //       console.log('existing user found');
    //       throw new ExistingDocumentError('User already exists');
    //     }
    //     console.log('no existing user found');
    //     return;
    //   })
    //   .then(() => {
    return this.collection.insertOne(user)
      .then((result: InsertOneResult<User>) => {
        if (result.insertedId) {
          // this.useFriendlyId(user);
          // if (user) {
          //   this.cleanUser(user);
          // }
          return user;
        }
      })
      .catch((err: Error) => {
        console.log(`in catch for err ${err.message}`);
      });


    // return this.hashPassword(user.password)
    //   .then((hash) => {
    //     user.password = hash;
    //     return this.onBeforeCreate(orgId, user);
    //   })
    //   .then((result) => {
    //     return this.collection.insert(user);
    //   })
    //   .then((user) => {
    //     this.useFriendlyId(user);
    //     if (user) {
    //       this.cleanUser(user);
    //     }
    //     return this.onAfterCreate(orgId, user)
    //       .then(() => {
    //         return user;
    //       }); // ignore the result of onAfterCreate and return what the original call returned
    //   });

  }

  getUserByEmail(email: string) {
    return this.collection.findOne({email: email})
      .then((user: any) => {
        //this.useFriendlyId(user);
        return user;
      });
  }
}
