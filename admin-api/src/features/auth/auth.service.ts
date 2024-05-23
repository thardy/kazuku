import {Db, InsertOneResult, AnyError, ObjectId} from 'mongodb';
import {scrypt, randomBytes} from 'crypto';
import {promisify} from 'util';

import {GenericApiService} from '@common/services/generic-api.service';
import conversionUtils from '@common/utils/conversion.utils';
import {User} from '@common/models/user.model';
import Joi from 'joi';
import {BadRequestError} from '@common/errors/bad-request.error';
import {DuplicateKeyError} from '@common/errors/duplicate-key.error';
import {IUserContext} from '@common/models/user-context.interface';
import {ValidationError} from '@common/errors/validation.error';

const scryptAsync = promisify(scrypt);

export class AuthService extends GenericApiService<User> {
  constructor(db: Db) {
    super(db, 'users', 'user');
  }

  async createUser(user: User): Promise<User | void> {
    // I've decided you don't have to be logged-in to create a user - we'll need to vette exactly what you do need based on the scenario.
    //  How do users get created? I'm thinking they have to be tied to an org, and if the org is sending us a new user to create, we create it.
    //  We just need to think about and handle the scenario where someone is logged in and creating other users (do we? - is that a thing?)
    // user.orgId = userContext.orgId;

    const validationResult = this.validate(user);
    this.handleValidationResult(validationResult, 'AuthService.createUser');

    conversionUtils.convertISOStringDateTimesToJSDates(user);

    const hash = await this.hashPassword(user.password!);
    user.password = hash;

    const userContext = { user: new User(), orgId: '999'}; // todo: fix this to figure out where OrgId is coming from - probly just pull from user.orgId
    const doc = await this.onBeforeCreate(userContext, user);

    try {
      const result = await this.collection.insertOne(user);

      if (result.insertedId) {
        this.useFriendlyId(user);
        this.transformSingle(user);
      }
    }
    catch(err: any) {
      console.log(`error from insertOne in AuthService.createUser - ${err.message}`);
      if (err.code === 11000) {
        throw new DuplicateKeyError('User already exists');
      }
      throw new BadRequestError('Error creating user');
    }

    await this.onAfterCreate(userContext, user);
    console.log(JSON.stringify(user)); // todo: delete me
    return user; // ignore the result of onAfterCreate and return what the original call returned
  }

  getUserById(id: string) {
    if (!this.isValidObjectId(id)) {
      return Promise.reject(new TypeError('id is not a valid ObjectId'));
    }

    return this.collection.findOne({_id: new ObjectId(id)})
      .then((doc) => {
        this.useFriendlyId(doc);
        return doc;
      });
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

  override validate(doc: User) {
    return User.validationSchema.validate(doc, {abortEarly: false});
  }
}
