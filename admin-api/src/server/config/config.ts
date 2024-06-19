let config = {};

if (!process.env.KAZUKU_ENV || process.env.KAZUKU_ENV === 'local') {
  const localConfig = require('./config.local.json');
  localConfig.cache.cacheOrgs = false;
  config = localConfig;
}
else {
  config = {
    env: process.env.KAZUKU_ENV,
    hostname: process.env.HOST_NAME ?? '',
    //testHostname: process.env.TEST_HOST_NAME ?? '',
    mongoDbUrl: process.env.MONGODB_URL,
    databaseName: process.env.DATABASE_NAME,
    corsAllowedOrigins: process.env.CORS_ALLOWED_ORIGINS,
    saltWorkFactor: process.env.SALT_WORK_FACTOR,
    jobTypes: process.env.JOB_TYPES,
    commonConfig: {
      clientSecret: process.env.CLIENT_SECRET
    },
    jwtExpirationInSeconds: process.env.JWT_EXPIRATION_SECONDS,
    refreshTokenExpirationInDays: process.env.REFRESH_EXPIRATION_DAYS,
    deviceIdCookieMaxAgeInDays: process.env.DEVICEID_MAX_AGE_DAYS,
    siteDefaults: {
      defaultRegenerationIntervalInMinutes: process.env.DEFAULT_REGENERATION_INTERVAL_MINUTES
    },
    cache: {
      cacheOrgs: process.env.CACHE_ORGS ?? true,
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
    }
  };
}

export default config as any;
