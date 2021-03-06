'use strict';
import testConfig from './development.json';
let config = {};

if (process.env.NODE_ENV === 'production') {
    // Offer production environment variables
    // process.env.REDIS_URL :: redis://redistogo:blahblah
    let redisURI = require('url').parse(process.env.REDIS_URL);
    let redisPassword = redisURI.auth.split(':')[1];

    config = {
        env: process.env.NODE_ENV,
        host: process.env.host || '',
        hostname: process.env.hostName || '',
        port: process.env.port,
        mongoDbUrl: process.env.mongoDbUrl,
        databaseName: process.env.databaseName,
        sessionSecret: process.env.sessionSecret,
        siteDefaults: {
            defaultRegenerationInterval: process.env.defaultRegenerationInterval
        },
        cache: {
            orgCache: process.env.cache.orgCache || true,
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
        redis: {
            host: redisURI.hostname,
            port: redisURI.port,
            password: redisPassword
        }
    };
}
else if (process.env.NODE_ENV === 'test') {
    // let testConfig = require('./development.json');
    testConfig.cache.orgCache = false;
    config = testConfig;
}
else {
    // Offer development variables
    // let testConfig = require('./development.json');
    testConfig.cache.orgCache = false;
    config = testConfig;
}

export default config;
