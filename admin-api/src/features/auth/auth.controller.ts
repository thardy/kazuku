import {Express, Request, Response, NextFunction} from 'express';

import { ApiController } from '@common/controllers/api.controller';
import { AuthService } from './auth.service';
import {IUser, User} from '@common/models/user.model';
import database from '@server/database/database';
import passport from 'passport';
import {IUserContext} from '@common/models/user-context.interface';
import config from '@server/config';
import {BadRequestError} from '@common/errors/bad-request.error';
import {isAuthenticated} from '@server/middleware/is-authenticated';
import {OrganizationService} from '@features/organizations/organization.service';

// todo: seriously consider not extending ApiController because we don't really use it
export class AuthController extends ApiController<User> {
  authService: AuthService;
  private orgService: OrganizationService;

  constructor(app: Express) {
    const authService = new AuthService(database.db!);
    super('auth', app, authService);

    this.orgService = OrganizationService.getInstance(database.db!);
    this.authService = authService;
  }

  mapRoutes(app: Express) {
    //super.mapRoutes(app); // map the base CrudController routes

    app.post(`/api/${this.resourceName}/login`, this.login.bind(this), this.afterAuth.bind(this));
    app.post(`/api/${this.resourceName}/register`, this.registerUser.bind(this));
    app.get(`/api/${this.resourceName}/request-token-using-refresh-token`, this.requestTokenUsingRefreshToken.bind(this));
    app.get(`/api/${this.resourceName}/get-user-context`, isAuthenticated, this.getUserContext.bind(this));
    app.put(`/api/${this.resourceName}/select-org-context`, isAuthenticated, this.selectOrgContext.bind(this));
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    res.set('Content-Type', 'application/json');

    const user = await this.authService.getUserByEmail(email);
    if (!user) {
      throw new BadRequestError('Email not found');
    }

    const passwordsMatch = await this.authService.comparePasswords(user.password!, password);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials');
    }

    const userContext = { user: user, orgId: user.orgId! };
    const deviceId = this.authService.getAndSetDeviceIdCookie(req, res);
    const loginResponse = this.authService.logUserIn(userContext, deviceId);

    return res.status(200).json(loginResponse);
  }

  async registerUser(req: Request, res: Response) {
    console.log('in registerUser');
    const user = req.body;

    // we're not handling errors here anymore because createUser throws errors and middleware handles them
    const doc = await this.authService.createUser(user);
    return res.status(201).json(doc);
  }

  async requestTokenUsingRefreshToken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.query.refreshToken;
    const deviceId = this.authService.getAndSetDeviceIdCookie(req, res);
    let tokens = null;

    if (refreshToken && typeof refreshToken === 'string') {
      tokens = await this.authService.requestTokenUsingRefreshToken(refreshToken, deviceId);
    }

    if (tokens) {
      return res.status(200).json(tokens);
    }
    else {
      const error = { message: `ERROR: Unable to auth with refreshToken - not found` }
      return res.status(204).json(error);
    }
  }

  getUserContext(req: Request, res: Response, next: NextFunction) {
    const context = req.user;
    // get the org for the loggedInUser
    return this.organizationService.getById(context.orgId)
      .then((org) => {
        const userContext = {user: context.user, org: org};
        return res.status(200).json(userContext);
      });
  }

  // returns an UserContext containing the newly selected org
  selectOrgContext(req, res, next) {
    const body = req.body;

    // verify currently logged-in user is metaAdmin
    const context = req.user;
    if (context.user.isMetaAdmin) { // only MetaAdmin users can select an org
      const newOrgId = body.orgId;

      // save orgId on session context
      // We are moving away from session - get rid of this, and determine if we need to do anything in its place
      //  I don't think we need to do anything because the server will no longer keep any state for selectedOrg.
      // req.session.passport.user.orgId = newOrgId;
      // req.session.save((err) => {
      //     console.log(err);
      // });

      // grab the new org, just like getUserContext above
      return this.organizationService.getById(req.session.passport.user.orgId)
        .then((org) => {
          const userContext = {user: context.user, org: org};
          return res.status(200).json(userContext);
        });
    }
    else {
      return res.status(401).json({'errors': ['not meta admin']});
    }
  }

  afterAuth(req: Request, res: Response, loginResponse: any) {
    console.log('in afterAuth');
  }

}
