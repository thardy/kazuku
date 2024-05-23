import testConfig from './config.local.json';// assert { type: "json" }; // the assert causes - error TS2821: Import assertions are only supported when the '--module' option is set to 'esnext', 'nodenext', or 'preserve'., which causes a ton of other issues
let config = {};

if (process.env.NODE_ENV === 'test') {
  // todo: test the test env workflow
  testConfig.cache.orgCache = false;
  config = testConfig;
}
else if (!process.env.KAZUKU_ENV) {
  testConfig.cache.orgCache = false;
  config = testConfig;
}
else {
  console.log('inside config else block');
  config = {
    env: process.env.KAZUKU_ENV,
    hostname: process.env.HOST_NAME || '',
    testHostname: process.env.TEST_HOST_NAME || '',
    port: process.env.PORT,
    testPort: process.env.TEST_PORT,
    mongoDbUrl: process.env.MONGODB_URL,
    databaseName: process.env.DATABASE_NAME,
    corsAllowedOrigin: process.env.CORS_ALLOWED_ORIGIN,
    saltWorkFactor: process.env.SALT_WORK_FACTOR,
    jobTypes: process.env.JOB_TYPES,
    clientSecret: process.env.CLIENT_SECRET,
    jwtExpirationInSeconds: process.env.JWT_EXPIRATION_SECONDS,
    refreshTokenExpirationInDays: process.env.REFRESH_EXPIRATION_DAYS,
    deviceIdCookieMaxAgeInDays: process.env.DEVICEID_MAX_AGE_DAYS,
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

export default config as any;
