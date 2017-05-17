'use strict';
if (process.env.NODE_ENV === 'production') {
    // Offer production environment variables
    // process.env.REDIS_URL :: redis://redistogo:blahblah
    let redisURI = require('url').parse(process.env.REDIS_URL);
    let redisPassword = redisURI.auth.split(':')[1];

    module.exports = {
        host: process.env.host || '',
        dbURI: process.env.dbURI,
        sessionSecret: process.env.sessionSecret,
        fb: {
            clientID: process.env.fbClientID,
            clientSecret: process.env.fbClientSecret,
            callbackURL: process.env.host + "/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'photos']
        },
        twitter: {
            consumerKey: process.env.twitterConsumerKey,
            consumerSecret: process.env.twitterConsumerSecret,
            callbackURL: process.env.host + "/auth/twitter/callback",
            profileFields: ['id', 'displayName', 'photos']
        },
        google: {
            clientID: process.env.googleClientID,
            clientSecret: process.env.googleClientSecret,
            callbackURL: process.env.host + "/auth/google/callback",
            profileFields: ['id', 'displayName', 'photos']
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
