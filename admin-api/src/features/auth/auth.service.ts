import {Db, InsertOneResult, AnyError, ObjectId, Collection} from 'mongodb';
import {Request, Response} from 'express';
import moment from 'moment';
import crypto from 'crypto';
import {BadRequestError, DuplicateKeyError, IUserContext, IUser, User, jwtService} from '@kazuku-cms/common';

import {GenericApiService} from '#common/services/generic-api.service';
import conversionUtils from '#common/utils/conversion.utils';
import {LoginResponse} from '#common/models/login-response.model';
import {TokenResponse} from '#common/models/token-response.model';
import config from '#server/config/config';
import {OrganizationService} from '#features/organizations/organization.service';
import entityUtils from '#common/utils/entity.utils';
import passwordUtils from '#common/utils/password.utils';

export class AuthService extends GenericApiService<User> {
  private refreshTokensCollection: Collection;
  private orgService: OrganizationService;

  constructor(db: Db) {
    super(db, 'users', 'user');

    this.orgService = OrganizationService.getInstance(db);
    this.refreshTokensCollection = db.collection('refreshTokens');
  }

  async logUserIn(userContext: IUserContext, deviceId: string) {
    const payload = { user: userContext.user, orgId: userContext.orgId };
    const accessToken = this.generateJwt(payload);
    // upon login, we want to create a new refreshToken with a full expiresOn expiration
    const refreshTokenObject = await this.createNewRefreshToken(userContext.user.id!, deviceId);
    const accessTokenExpiresOn = this.getExpiresOnFromSeconds(config.jwtExpirationInSeconds);

    let loginResponse = null;
    if (refreshTokenObject) {
      const tokenResponse = new TokenResponse({ accessToken, refreshToken: refreshTokenObject.token, expiresOn: accessTokenExpiresOn });

      // we send the org back in the loginResponse
      const org = await this.orgService.getOrgById(userContext.orgId);

      // todo: save new lastLoggedIn date (non-blocking) - use an event or async call that we don't wait for
      //this.authService.updateLastLoggedIn(user);

      loginResponse = new LoginResponse({ tokens: tokenResponse, userContext: { user: userContext.user, org } });
    }

    return loginResponse;
  }

  getUserById(id: string) {
    if (!entityUtils.isValidObjectId(id)) {
      return Promise.reject(new TypeError('id is not a valid ObjectId'));
    }

    return this.collection.findOne({_id: new ObjectId(id)})
      .then((doc) => {
        entityUtils.useFriendlyId(doc);
        console.log(`getUserById returned ${JSON.stringify(doc)}\n`); // todo: delete me
        return doc;
      });
  }

  getUserByEmail(email: string): Promise<IUser> {
    return this.collection.findOne({email: email})
      .then((user: any) => {
        entityUtils.useFriendlyId(user);
        return user;
      });
  }

  async createUser(userContext: IUserContext | undefined, user: User): Promise<User> {
    // You currently don't have to be logged-in to create a user - we'll need to vette exactly what you do need based on the scenario.
    // todo: validate that the user.orgId exists - think through the whole user creation process
    //  I think a user either has to be created by someone with the authorization to do so, or they need to be
    //  joining an org that has open registration, or else they have some sort of invite to join an org,
    //  or initialSetup is occurring.

    const validationResult = this.validate(user);
    entityUtils.handleValidationResult(validationResult, 'AuthService.createUser');

    conversionUtils.convertISOStringDateTimesToJSDates(user);

    const hash = await passwordUtils.hashPassword(user.password!);
    user.password = hash;

    await this.onBeforeCreate(userContext, user);

    try {
      const insertResult = await this.collection.insertOne(user);

      if (insertResult.insertedId) {
        entityUtils.useFriendlyId(user);
        this.transformSingle(user);
      }
    }
    catch(err: any) {
      if (err.code === 11000) {
        throw new DuplicateKeyError('User already exists');
      }
      throw new BadRequestError('Error creating user');
    }

    await this.onAfterCreate(userContext, user);

    return user; // ignore the result of onAfterCreate and return what the original call returned
  }

  async requestTokenUsingRefreshToken(refreshToken: string, deviceId: string) {
    // refreshToken - { token, deviceId, userId, expiresOn, created, createdBy, createdByIp, revoked?, revokedBy? }
    //  not using revoked and revokedBy currently - I'm just deleting refreshTokens by userId and deviceId (there can be only one!!)
    let userId = null;

    // look for this particular refreshToken in our database. refreshTokens are assigned to deviceIds,
    //  so they can only be retrieved together.
    const activeRefreshToken = await this.getActiveRefreshToken(refreshToken, deviceId);
    let newTokens = null;
    if (activeRefreshToken) {
      userId = activeRefreshToken.userId;

      if (userId) {
        // we found an activeRefreshToken, and we know what user it was assigned to
        //  - create a new refreshToken and persist it to the database
        // upon refresh, we want to create a new refreshToken maintaining the existing expiresOn expiration
        //newRefreshTokenPromise = this.createNewRefreshToken(userId, deviceId, activeRefreshToken.expiresOn);
        newTokens = await this.createNewTokens(userId, deviceId, activeRefreshToken.expiresOn);
      }
    }

    return newTokens;
  }

  async createNewTokens(userId: string, deviceId: string, refreshTokenExpiresOn: number) {
    let createdRefreshTokenObject: any = null;

    const newRefreshToken = await this.createNewRefreshToken(userId, deviceId, refreshTokenExpiresOn);
    let user = null;
    if (newRefreshToken) {
      // we created a brand new refreshToken - now get the user object associated with this refreshToken
      createdRefreshTokenObject = newRefreshToken;
      user = await this.getUserById(userId);
    }

    //  return the new refreshToken and accessToken in a tokenResponse (just like we did in login)
    let tokenResponse = undefined;
    if (user && createdRefreshTokenObject) {
      // todo: there's a really good chance this will introduce a bug where selectedOrgContext is lost when using refreshToken
      //  to get a new accessToken because we are hard-coding it to the user's org right here.
      //  We'll need to find a way to have the client tell us what the selectedOrg should be when they
      //  call requestTokenUsingRefreshToken() - AND we'll need to VALIDATE that they can select that org
      //  if (selectedOrgId !== user.orgId) then user.isMetaAdmin must be true.
      const payload = { user: user, orgId: user.orgId };  // orgId is the selectedOrg (the org of the user for any non-metaAdmins)
      const accessToken = this.generateJwt(payload);
      const accessTokenExpiresOn = this.getExpiresOnFromSeconds(config.jwtExpirationInSeconds);
      tokenResponse = new TokenResponse({ accessToken, refreshToken: createdRefreshTokenObject.token, expiresOn: accessTokenExpiresOn });
    }
    return tokenResponse;
  }

  async getActiveRefreshToken(refreshToken: string, deviceId: string) {
    const refreshTokenResult = await this.refreshTokensCollection.findOne({token: refreshToken, deviceId: deviceId});
    let activeRefreshToken = null;

    if (refreshTokenResult) {
      // validate that the refreshToken has not expired
      const now = Date.now();
      const notExpired = refreshTokenResult.expiresOn > now;
      if (notExpired) {
        activeRefreshToken = refreshTokenResult;
      }
    }

    return activeRefreshToken;
  }

  async createNewRefreshToken(userId: string, deviceId: string, existingExpiresOn: number | null = null) {
    // if existingExpiresOn is provided, use it, otherwise we start over.  The expiresOn on the refreshToken basically represents
    //  how often the user must log in.  If we are refreshing from an existing token, we should maintain the existing expiresOn.
    const expiresOn = existingExpiresOn ? existingExpiresOn : this.getExpiresOnFromDays(config.refreshTokenExpirationInDays);

    const newRefreshToken = {
      token: this.generateRefreshToken(),
      deviceId,
      userId,
      expiresOn: expiresOn,
      created: moment().utc().toDate(),
      createdBy: userId
    };

    // delete all other refreshTokens with the same deviceId
    //  todo: At some point, we will need to have a scheduled service go through and delete all expired refreshTokens because
    //   many will probably just expire without ever having anyone re-login on that device.
    const deleteResult = await this.deleteRefreshTokensForDevice(deviceId)
    const insertResult = await this.refreshTokensCollection.insertOne(newRefreshToken);
    let tokenResult = null;
    if (insertResult.insertedId) {  // presence of an insertedId means the insert was successful
      tokenResult = newRefreshToken;
    }
    return tokenResult;
  }

  deleteRefreshTokensForDevice(deviceId: string) {
    return this.refreshTokensCollection.deleteMany({deviceId: deviceId});
  }

  generateJwt(payload: any) {
    // generate the jwt (uses jsonwebtoken library)
    const jwtExpiryConfig = config.jwtExpirationInSeconds;
    const jwtExpirationInSeconds = (typeof jwtExpiryConfig === 'string') ? parseInt(jwtExpiryConfig) : jwtExpiryConfig;

    const accessToken = jwtService.sign(
      payload,
      config.commonConfig.clientSecret,
      {
        expiresIn: jwtExpirationInSeconds
      }
    );
    return accessToken;
  };

  generateRefreshToken() {
    return crypto.randomBytes(40).toString('hex');
  }

  generateDeviceId() {
    return crypto.randomBytes(40).toString('hex');
  }

  getAndSetDeviceIdCookie(req: Request, res: Response) {
    let isNewDeviceId = false;
    let deviceId = '';
    const deviceIdFromCookie = req.cookies['deviceId'];

    if (deviceIdFromCookie) {
      deviceId = deviceIdFromCookie;
    }
    else {
      deviceId = this.generateDeviceId();
      isNewDeviceId = true;
      // todo: send out an email telling the user that there was a login from a new device
    }

    if (isNewDeviceId) {
      // save deviceId as cookie on response
      res.cookie('deviceId', deviceId, { maxAge: config.deviceIdCookieMaxAgeInDays * 24 * 60 * 60 * 1000, httpOnly: true });
    }

    return deviceId;
  }

  getExpiresOnFromSeconds(expiresInSeconds: number) {
    // exactly when the token expires (in milliseconds since Jan 1, 1970 UTC)
    return Date.now() + expiresInSeconds * 1000;
  }

  getExpiresOnFromDays(expiresInDays: number) {
    // exactly when the token expires (in milliseconds since Jan 1, 1970 UTC)
    return Date.now() + expiresInDays * 24 * 60 * 60 * 1000
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
