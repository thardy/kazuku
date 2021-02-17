'use strict';
import _ from 'lodash';
import GenericService from '../common/genericService.js';
import Promise from 'bluebird';
import conversionService from '../common/conversionService.js';
import bcryptNodejs from 'bcrypt-nodejs';
const bcrypt = Promise.promisifyAll(bcryptNodejs);
import config from '../server/config/index.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import OrganizationService from '../organizations/organizationService';
import {database} from '../database/database';

class AuthService extends GenericService {
    constructor(database) {
        super(database, 'users');
        this.orgService = new OrganizationService(database);
        this.refreshTokensCollection = database['refreshTokens'];
    }

    // generate jwt and send back loginResponse { tokens: {accessToken, refreshToken}, userContext: {user, org}}
    login(req, res, context) {
        req.login(
            context,
            { session: false },
            async (error) => {
                if (error) return next(error);

                // todo: test this
                //  get client working with the token
                //  get server working purely as an api
                const deviceId = this.getAndSetDeviceIdCookie(req, res);

                const payload = { user: context.user, orgId: context.orgId };
                const accessToken = this.generateJwt(payload);
                // upon login, we want to create a new refreshToken with a full expiresOn expiration
                const refreshTokenObject = await this.createNewRefreshToken(context.user.id, deviceId);

                const accessTokenExpiresOn = this.getExpiresOnFromSeconds(config.jwtExpirationInSeconds);
                const tokenResponse = this.getTokenResponse(refreshTokenObject, accessToken, accessTokenExpiresOn);

                const org = await this.orgService.getById(context.orgId);

                const loginResponse = this.getLoginResponse(tokenResponse, context.user, org);

                return res.json(loginResponse);
            }
        );
    };

    getUserById(id) {
        if (arguments.length !== 1) {
            return Promise.reject(new Error('Incorrect number of arguments passed to AuthService.getUserById'));
        }
        if (!this.isValidObjectId(id)) {
            return Promise.reject(new TypeError('id is not a valid ObjectId'));
        }
        return this.collection.findOne({_id: id})
            .then((doc) => {
                this.useFriendlyId(doc);
                return doc;
            });
    }

    getUserByEmail(email) {
        return this.collection.findOne({email: email})
            .then((doc) => {
                this.useFriendlyId(doc);
                return doc;
            });
    }

    createUser(orgId, user) {
        if (arguments.length !== 2) {
            return Promise.reject(new Error('Incorrect number of arguments passed to AuthService.createUser'));
        }
        user.orgId = orgId;
        let valError = this.validate(user);
        if (valError) {
            return Promise.reject(new TypeError(valError));
        }

        conversionService.convertISOStringDateTimesToMongoDates(user);

        return this.hashPassword(user.password)
            .then((hash) => {
                user.password = hash;
                return this.onBeforeCreate(orgId, user)
            })
            .then((result) => {
                return this.collection.insert(user)
            })
            .then((user) => {
                this.useFriendlyId(user);
                if (user) {
                    this.cleanUser(user);
                }
                return this.onAfterCreate(orgId, user)
                    .then(() => { return user }); // ignore the result of onAfterCreate and return what the original call returned
            });
    }

    requestTokenUsingRefreshToken(refreshToken, deviceId) {
        // refreshToken - { token, deviceId, userId, expiresOn, created, createdBy, createdByIp, revoked?, revokedBy? }
        //  not using revoked and revokedBy currently - I'm just deleting refreshTokens by userId and deviceId (there can be only one!!)
        let userId = null;

        // look for this particular refreshToken in our database. refreshTokens are assigned to deviceIds,
        //  so they can only be retrieved together.
        return this.getActiveRefreshToken(refreshToken, deviceId)
            .then((activeRefreshToken) => {
                let newRefreshTokenPromise = Promise.resolve(null);
                if (activeRefreshToken) {
                    userId = activeRefreshToken.userId;

                    if (userId) {
                        // we found an activeRefreshToken, and we know what user it was assigned to
                        //  - create a new refreshToken and persist it to the database
                        // upon refresh, we want to create a new refreshToken maintaining the existing expiresOn expiration
                        //newRefreshTokenPromise = this.createNewRefreshToken(userId, deviceId, activeRefreshToken.expiresOn);
                        newRefreshTokenPromise = this.createNewTokens(userId, deviceId, activeRefreshToken.expiresOn);
                    }
                }

                return newRefreshTokenPromise;
            });

    }

    createNewTokens(userId, deviceId, refreshTokenExpiresOn) {
        let createdRefreshTokenObject = null;

        return this.createNewRefreshToken(userId, deviceId, refreshTokenExpiresOn)
            .then((newRefreshToken) => {
                let userPromise = Promise.resolve(null);
                if (newRefreshToken) {
                    // we created a brand new refreshToken - now get the user object associated with this refreshToken
                    createdRefreshTokenObject = newRefreshToken;
                    userPromise = this.getUserById(userId);
                }
                return userPromise;
            })
            .then((user) => {
                //  return the new refreshToken and accessToken in a tokenResponse (just like we did in login)
                let tokenResponse = null;
                if (user && createdRefreshTokenObject) {
                    // todo: there's a really good chance this will introduce a bug where selectedOrgContext is lost when using refreshToken
                    //  to get a new accessToken because we are hard-coding it to the user's org right here.
                    //  We'll need to find a way to have the client tell us what the selectedOrg should be when they
                    //  call requestTokenUsingRefreshToken() - AND we'll need to VALIDATE that they can select that org
                    //  if (selectedOrgId !== user.orgId) then user.isMetaAdmin must be true.
                    const payload = { user: user, orgId: user.orgId };  // orgId is the selectedOrg (the org of the user for any non-metaAdmins)
                    const accessToken = this.generateJwt(payload);
                    const accessTokenExpiresOn = this.getExpiresOnFromSeconds(config.jwtExpirationInSeconds);
                    tokenResponse = this.getTokenResponse(createdRefreshTokenObject, accessToken, accessTokenExpiresOn);
                }
                return tokenResponse;
            });
    }

    getActiveRefreshToken(refreshToken, deviceId) {
        return this.refreshTokensCollection.findOne({token: refreshToken, deviceId: deviceId})
            .then((refreshToken) => {
                let activeRefreshToken = null;

                if (refreshToken) {
                    // validate that the refreshToken has not expired
                    const now = Date.now();
                    const notExpired = refreshToken.expiresOn > now;
                    if (notExpired) {
                        activeRefreshToken = refreshToken;
                    }
                }

                return Promise.resolve(activeRefreshToken);
            });
    }

    createNewRefreshToken(userId, deviceId, existingExpiresOn = null) {
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
        //  todo: At some point, we will probably want to have a scheduled service go through and delete all expired refreshTokens because
        //  many will probably just expire without ever having anyone re-login on that device.
        return this.deleteRefreshTokensForDevice(deviceId)
            .then((deletedResult) => {
                return this.refreshTokensCollection.insert(newRefreshToken);
            });
    }

    deleteRefreshTokensForDevice(deviceId) {
        return this.refreshTokensCollection.remove({deviceId: deviceId})
    }

    // expiresIn should be in seconds
    generateJwt(payload) {
        // generate the jwt (uses jsonwebtoken library)
        const accessToken = jwt.sign(
            payload,
            config.clientSecret,
            {
                expiresIn: config.jwtExpirationInSeconds
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

    getAndSetDeviceIdCookie(req, res) {
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

    getExpiresOnFromSeconds(expiresInSeconds) {
        // exactly when the token expires (in milliseconds since Jan 1, 1970 UTC)
        return Date.now() + expiresInSeconds * 1000;
    }

    getExpiresOnFromDays(expiresInDays) {
        // exactly when the token expires (in milliseconds since Jan 1, 1970 UTC)
        return Date.now() + expiresInDays * 24 * 60 * 60 * 1000
    }

    getTokenResponse(refreshToken, accessToken, accessTokenExpiresOn) {
        const tokenResponse = {
            accessToken: accessToken,
            refreshToken: refreshToken.token,
            expiresOn: accessTokenExpiresOn // exactly when the token expires (in milliseconds since Jan 1, 1970 UTC)
        }
        return tokenResponse;
    }

    getLoginResponse(tokenResponse, user, org) {
        const loginResponse = {
            tokens: tokenResponse,
            userContext: {
                user: user,
                org: org
            }
        };
        return loginResponse;
    }

    validate(doc) {
        // todo: update to handle social auth (which might not have email or password)
        let valid = false;
        if (doc.email && doc.password
            || doc.facebook && doc.facebook.id
            || doc.google && doc.google.id) {
            // call base validation, which should return nothing if valid
            return super.validate(doc);
        }
        else {
            return "Need email and password, or facebook id, or google id";
        }
    }

    hashPassword(password) {
        // generate a salt and use it to make the hash
        return bcrypt.genSaltAsync(config.saltWorkFactor)
            .then((salt) => {
                return bcrypt.hashAsync(password, salt, null);
            })
            .catch((err) => {
                throw new Error(err);
            });
    }

    verifyPassword(candidatePassword, hashedPassword) {
        // bcrypt handles comparing the plain text password with the hashed password for you.  I think it
        //  gets the salt out of the hashed password and uses it on the plain text password, but they aren't
        //  super forthcoming about the implementation.
        return bcrypt.compareAsync(candidatePassword, hashedPassword);
    }

    cleanUser(user) {
        // Remove any sensitive information
        delete user.password;
        if (user.facebook) {
            delete user.facebook.token;
        }
        if (user.google) {
            delete user.google.token;
        }
    }

    transformList(users) {
        return users.map((user) => {
            this.cleanUser(user);
            return user;
        });
    }

    transformSingle(user) {
        this.cleanUser(user);
        return user;
    }
}


export default AuthService;

