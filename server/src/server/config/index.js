'use strict';
import testConfig from './development.json' assert { type: "json" };
let config = {};

if (process.env.NODE_ENV === 'test') {
    // todo: test the test env workflow
    // let testConfig = require('./development.json');
    testConfig.cache.orgCache = false;
    config = testConfig;
}
else if (!process.env.KAZUKU_ENV) {
    testConfig.cache.orgCache = false;
    config = testConfig;
}
else {
    // use environment variables
    // process.env.REDIS_URL :: redis://redistogo:blahblah
    // let redisURI = require('url').parse(process.env.REDIS_URL);
    // let redisPassword = redisURI.auth.split(':')[1];

    config = {
        env: process.env.KAZUKU_ENV,
        hostname: process.env.HOST_NAME || '',
        port: process.env.PORT,
        mongoDbUrl: process.env.MONGODB_URL,
        databaseName: process.env.DATABASE_NAME,
        saltWorkFactor: process.env.SALT_WORK_FACTOR,
        jobTypes: process.env.JOB_TYPES,
        clientSecret: process.env.CLIENT_SECRET,
        jwtExpirationInSeconds: process.env.JWT_EXPIRATION,
        refreshTokenExpirationInDays: process.env.REFRESH_EXPIRATION,
        deviceIdCookieMaxAgeInDays: process.env.DEVICEID_MAX_AGE,
        siteDefaults: {
            defaultRegenerationInterval: process.env.DEFAULT_REGENERATION_INTERVAL
        },
        cache: {
            orgCache: process.env.ORG_CACHE || true,
        },
        fb: {
            clientID: process.env.fbClientID,
            clientSecret: process.env.fbClientSecret,
            callbackURL: process.env.host + "/auth/facebook/callback",
            profileFields: ['id', 'email', 'displayName', 'photos'],
            passReqToCallback: true
        },
        google: {
            clientID: process.env.googleClientID,
            clientSecret: process.env.googleClientSecret,
            callbackURL: process.env.host + "/auth/google/callback",
            profileFields: ['id', 'email', 'displayName', 'photos'],
            passReqToCallback: true
        },
        // redis: {
        //     host: redisURI.hostname,
        //     port: redisURI.port,
        //     password: redisPassword
        // }
    };
}
// else if (process.env.NODE_ENV === 'test') {
//     // let testConfig = require('./development.json');
//     testConfig.cache.orgCache = false;
//     config = testConfig;
// }
// else {
//     // Offer development variables
//     // let testConfig = require('./development.json');
//     testConfig.cache.orgCache = false;
//     config = testConfig;
// }

export default config;
