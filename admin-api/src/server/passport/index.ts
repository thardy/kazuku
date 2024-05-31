import passport from "passport";
import { Request, Response, NextFunction } from 'express';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
// import passportGoogleOauth from 'passport-google-oauth';
// import passportFacebook from 'passport-facebook';

import config from '../config/index';
import database from '../database/database';
import {AuthService} from '@features/auth/auth.service';
import {OrganizationService} from '@features/organizations/organization.service';
import {IUser} from '@common/models/user.model';
//import logger from '../logger/index.js';

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;
// const FacebookStrategy = passportFacebook.Strategy;
// const GoogleStrategy = passportGoogleOauth.Strategy;

const orgService = new OrganizationService(database.db!);
const authService = new AuthService(database.db!);

// the "context" parm here comes from the done(null, context) call in our LocalStrategy below
passport.serializeUser((context, done) => {
  console.log('in serializeUser');
  done(null, context);
});

// the "context" parm here comes from the persisted record in mongo session collection (verify)
// serializeUser/deserializeUser are just used in passport session usage.  I've moved this to authHelper now that I'm using jwt. (I don't think so!!!)
passport.deserializeUser((context: any, done) => {
  console.log('in deserializeUser');
  console.log(`context = ${JSON.stringify(context)}\n`);
  // Find the user using id
  authService.getUserById(context.user.id)
    .then(user => {
      if (user) {
        // todo: fix me!!!!
        //authService.cleanUser(user);
      }
      else {
        console.log('Error when deserializing the user: User not found');
        //logger.log('error', 'Error when deserializing the user: User not found');
      }

      // Here is where we attach userContext to the request as req.user
      const userContext = { user: user, orgId: context.orgId }; // orgId here is the "activeOrgId", and can be changed by metaAdmins when impersonating different orgs
      done(null, userContext); // fullContext attaches to the request as req.user - we are going to put fullContext into req.user
    })
    .catch(error => {
      // todo: add logging
      //logger.log('error', 'Error when deserializing the user: ' + error)
    });
});

// this is still used with jwt auth
passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  async (req, email, password, done) => {
    console.log(`in LocalStrategy`);
    let loginUser = {} as IUser;
    try {
      authService.getUserByEmail(email)
        .then((user) => {
          let promise: Promise<boolean> = Promise.resolve(false);
          loginUser = user;
          if (user !== null) {
            promise = authService.comparePasswords(user.password, password);
          }

          return promise;
        })
        .then((isMatch) => {
          if (isMatch === null) {
            return done(null, false, {message: `Email '${email}' not found`}); // todo: change to BadRequestError
          }
          else if (isMatch) {
            let user = authService.cleanUser(loginUser);
            const userContext = {
              user: user,
              orgId: loginUser.orgId  // this will be stored in session and can be changed by metaAdmins
            };
            // todo: save new lastLoggedIn date
            // return done(null, {
            //     id: loginUser.id,
            //     email: loginUser.email,
            //     firstName: loginUser.firstName,
            //     lastName: loginUser.lastName,
            //     lastLoggedIn: loginUser.lastLoggedIn
            // });
            // the second parm here is the "context" or first parm in the serializeUser call, it should be whatever we want to store in session
            return done(null, userContext, { message: 'Login Successful' });
          }
          else {
            return done(null, false, {message: `Invalid email or password`});
          }
        })
        .catch((error: any) => {
          error.message = `ERROR: passport/index.js -> attempted login with email = ${email}.  Message: ${error.message}`;
          return done(error);
        });
    }
    catch(ex) {
      console.log(JSON.stringify(ex));
    }
  }
));

passport.use(
  new JWTStrategy(
    {
      secretOrKey: config.clientSecret,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      console.log(`in JWTStrategy`);
      // token is our full user context ({ user, orgId }, where orgId is the selected orgContext, not necessarily the orgId of the user)
      try {
        return done(null, token);
      } catch (error) {
        done(error);
      }
    }
  )
);

// let authProcessor = (socialLogin, req, accessToken, refreshToken, profile, done) => {
//   // todo: replace orgId assignment with whatever org the user is logging in to (get orgId from site or host or sumpin)
//   let orgId = 1;
//
//   // Find a user in db based on their social id
//   let query = {};
//   switch (socialLogin) {
//     case 'facebook':
//       query = { 'facebook.id': profile.id };
//       break;
//     case 'google':
//       query = { 'google.id': profile.id };
//       break;
//   }
//
//
//   // If the user is found, return the user data using the done()
//   // If the user is not found, create one in the local db and return
//   return authService.findOne(orgId, query)
//     .then((existingUser) => {
//       if (existingUser) {
//         done(null, existingUser);
//       } else {
//         // Create a new user and return
//         let newUser = {
//           orgId: orgId,
//           email: ''
//         };
//
//         addSocialProfileProperties(newUser, socialLogin, accessToken, refreshToken, profile);
//
//         // getting rid of session - we should probably remove all of this
//         //req.session.authenticatedUser = newUser;
//
//         // do we really need to get an email for a socially authenticated user?
//         // if so, we'll want to verify the email they provide
//
//         // todo: When I want to collect more info after authenticating with google or facebook, just return
//         //  done() and return some sort of success to client (in next middleware), have client display the
//         //  "you're almost done" form, collect the extra data, complete the account
//         //  (call create-social-account), and log them in with req.login().
//         // After calling done(), test that the next middleware gets executed, but that req.isAuthenticated
//         //  is still false
//         // return done();
//
//         return authService.createUser(orgId, newUser)
//           .then(createdUser => {
//             Zone.current.context = {user: newUser, orgId: newUser.orgId };
//             return done(null, createdUser);
//           })
//           .catch(error => {
//             logger.log('error', `Error when creating new user with email, ${newUser.email}. Error: ${error}`);
//             return done(error);
//           });
//       }
//     });
// };

// let addSocialProfileProperties = (newUser, socialLogin, accessToken, refreshToken, profile) => {
//   switch (socialLogin) {
//     case 'facebook':
//       newUser.facebook = {};
//       newUser.facebook.id = profile.id;
//       newUser.facebook.token = accessToken;
//       newUser.facebook.name = profile.displayName;
//       if (profile.emails && profile.emails[0]) {
//         newUser.facebook.email = profile.emails[0].value;
//         newUser.email = newUser.facebook.email;
//       }
//       break;
//     case 'google':
//       newUser.google = {};
//       newUser.google.id = profile.id;
//       newUser.google.token = accessToken;
//       newUser.google.name = profile.displayName;
//       if (profile.emails && profile.emails[0]) {
//         newUser.google.email = profile.emails[0].value;
//         newUser.email = newUser.google.email;
//       }
//       break;
//   }
//
// };


// todo: do I still need this?
// move the following to usercontroller
// completeRegistration() {
//     // verify that we are not yet authenticated
//     const isAuthenticated = req.isAuthenticated();
//
//     // create the user now and call req.login(newUser) to log the user in, and of course test it all
// }


// let facebookAuthProcessor = (req, accessToken, refreshToken, profile, done) => {
//   authProcessor('facebook', req, accessToken, refreshToken, profile, done);
// };
//
// let googleAuthProcessor = (req, accessToken, refreshToken, profile, done) => {
//   authProcessor('google', req, accessToken, refreshToken, profile, done);
// };

// todo: receiving "uncaughtException: OAuth2Strategy requires a clientID option" - I think it's due to
//  no clientID being specified for config.fb.clientID - due to move to ENV variables in Docker
//  (development.json has it, but docker-compose.yml does not)
// passport.use(new FacebookStrategy(config.fb, facebookAuthProcessor));
// todo: receiving "OAuthStrategy requires a consumerKey option" out of the blue.  Figure that out if you want to use GoogleStrategy
// passport.use(new GoogleStrategy(config.google, googleAuthProcessor));


const isAuthenticatedForAdminApi = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, async (err, context, info) => {
    if (err) { return next(err); }
    if (!context) {
      res.status(401);
      return res.send('Unauthenticated');
    }

    req.user = context;
    return next();
  })(req, res, next);

  // let isAuthenticated = false;
  // const isAuthenticatedWithAdminUser = req.isAuthenticated();

  // isAuthenticated = isAuthenticatedWithAdminUser;
  //
  // if (isAuthenticated) {
  //     next();
  // }
  // else {
  //     res.status(401);
  //     res.send('Unauthenticated');
  // }
};

const isAuthenticatedForContentApi = async (req, res, next) => {
  let isAuthenticatedForContentApi = false;
  if (req.headers && req.headers['authorization']) {
    let authHeader = req.headers['authorization'];
    const authHeaderArray = authHeader.split('Bearer ');
    if (authHeaderArray && authHeaderArray.length > 0) {
      const orgCode = req.vhost[0];
      const submittedAuthToken = authHeaderArray[1];
      // returns orgId if valid
      const orgId = await orgService.validateRepoAuthToken(orgCode, submittedAuthToken);
      isAuthenticatedForContentApi = !!orgId;
      const fullContext = { user: {firstName: 'Api', lastName: 'Consumer', email:'api_consumer'}, orgId: orgId };
      // Zone current user context is set here
      Zone.current.context = fullContext;
    }
  }

  if (isAuthenticatedForContentApi) {
    next();
  }
  else {
    res.status(401);
    res.json({
      errors: ['Unauthenticated']
    });
  }
  return isAuthenticatedForContentApi;
};

export default {
  isAuthenticatedForAdminApi,
  isAuthenticatedForContentApi,
};
