'use strict';
if (process.env.NODE_ENV === 'production') {
    // Offer production environment variables
    // process.env.REDIS_URL :: redis://redistogo:blahblah
    let redisURI = require('url').parse(process.env.REDIS_URL);
    let redisPassword = redisURI.auth.split(':')[1];

    module.exports = {
        env: process.env.NODE_ENV,
        host: process.env.host || '',
        port: process.env.port,
        mongoDbUrl: process.env.mongoDbUrl,
        sessionSecret: process.env.sessionSecret,
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
} else {
    // Offer development variables
    module.exports = require('./development.json');
}