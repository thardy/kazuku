import {Db, InsertOneResult} from 'mongodb';
import {scrypt, randomBytes} from 'crypto';
import {promisify} from 'util';

import {GenericApiService} from '../../common/services/generic-api.service';
import conversionUtils from '../../common/utils/conversion.utils';
import {User} from '../../common/models/user.model';
import Joi from 'joi';
import {BadRequestError} from '../../common/errors/bad-request-error';
import {ExistingDocumentError} from '../../common/errors/existing-document-error';
import {IUserContext} from '../../common/models/user-context.interface';

const scryptAsync = promisify(scrypt);

export class AuthService extends GenericApiService<User> {
  constructor(db: Db) {
    super(db, 'users');
  }

  // createUser(userContext: IUserContext, user: User): Promise<User | void> {
  //   user.orgId = userContext.orgId;
  //
  //   console.log(`user = ${JSON.stringify(user)}`);
  //   const validationResult = User.validationSchema.validate(user);
  //   if (validationResult?.error) {
  //     console.log(JSON.stringify(validationResult));
  //     return Promise.reject(new TypeError(`validation error - ${validationResult.error}`));
  //   }
  //
  //   conversionUtils.convertISOStringDateTimesToJSDates(user);
  //
  //   // return this.collection.insertOne(user)
  //   //   .then((result: InsertOneResult<User>) => {
  //   //     if (result.insertedId) {
  //   //       if (user) {
  //   //         this.useFriendlyId(user);
  //   //         this.cleanUser(user);
  //   //       }
  //   //       return user;
  //   //     }
  //   //   })
  //   //   .catch((err: Error) => {
  //   //     console.log(`in catch for err ${err.message}`);
  //   //   });
  //
  //
  //   return this.hashPassword(user.password!)
  //     .then((hash: string) => {
  //       user.password = hash;
  //       return this.onBeforeCreate(userContext, user);
  //     })
  //     .then((doc: any) => {
  //       return this.collection.insertOne(user);
  //     })
  //     .then((result: InsertOneResult<User>) => {
  //       if (result.insertedId) {
  //         this.useFriendlyId(user);
  //         this.cleanUser(user);
  //       }
  //       return this.onAfterCreate(userContext, user)
  //         .then(() => {
  //           return user;
  //         }); // ignore the result of onAfterCreate and return what the original call returned
  //     });
  //
  // }
  async createUser(userContext: IUserContext, user: User): Promise<User | void> {
    user.orgId = userContext.orgId;

    console.log(`user = ${JSON.stringify(user)}`);
    const validationResult = User.validationSchema.validate(user);
    if (validationResult?.error) {
      console.log(`validation error in AuthService.createUser - ${JSON.stringify(validationResult)}`);
      throw new TypeError(`validation error - ${validationResult.error}`);
    }

    conversionUtils.convertISOStringDateTimesToJSDates(user);

    const hash = await this.hashPassword(user.password!);
    console.log(`password hash = ${hash}`); // todo: delete me
    user.password = hash;

    const doc = await this.onBeforeCreate(userContext, user);
    const result = await this.collection.insertOne(user);

    if (result.insertedId) {
      this.useFriendlyId(user);
      this.cleanUser(user);
    }

    await this.onAfterCreate(userContext, user);
    console.log(JSON.stringify(user)); // todo: delete me
    return user; // ignore the result of onAfterCreate and return what the original call returned
  }

  getUserByEmail(email: string) {
    return this.collection.findOne({email: email})
      .then((user: any) => {
        this.useFriendlyId(user);
        return user;
      });
  }

  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  async comparePasswords(storedPassword: string, suppliedPassword: string): Promise<boolean> {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }

  cleanUser(user: User) {
    // Remove any sensitive information
    delete user.password;
    // if (user.facebook) {
    //   delete user.facebook.token;
    // }
    // if (user.google) {
    //   delete user.google.token;
    // }
  }

  transformList(users: User[]) {
    return users.map((user) => {
      this.cleanUser(user);
      return user;
    });
  }

  transformSingle(user: User) {
    this.cleanUser(user);
    return user;
  }
}
