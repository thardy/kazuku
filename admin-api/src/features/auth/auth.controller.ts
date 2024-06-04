import {Express, Request, Response, NextFunction} from 'express';

import { ApiController } from '@common/controllers/api.controller';
import { AuthService } from './auth.service';
import {IUser, User} from '@common/models/user.model';
import database from '@server/database/database';
import {IUserContext} from '@common/models/user-context.interface';
import config from '@server/config';
import {BadRequestError} from '@common/errors/bad-request.error';
import {isAuthenticated} from '@server/middleware/is-authenticated';
import {OrganizationService} from '@features/organizations/organization.service';
import {UnauthorizedError} from '@common/errors/unauthorized.error';

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
    //super.mapRoutes(app); // map the base ApiController routes

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
      throw new BadRequestError('Invalid Credentials');
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
    const userContext = req.userContext;
    const body = req.body;

    // we're not handling errors here anymore because createUser throws errors and middleware handles them
    const user = await this.authService.createUser(userContext, body);
    return res.status(201).json(user);
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

  async getUserContext(req: Request, res: Response, next: NextFunction) {
    const userContext = req.userContext;
    // get the org for the loggedInUser
    const org = await this.orgService.getOrgById(userContext!.orgId);
    const clientUserContext = {user: userContext!.user, org: org};
    return res.status(200).json(clientUserContext);
  }

  // returns an UserContext containing the newly selected org
  async selectOrgContext(req: Request, res: Response, next: NextFunction) {
    const userContext = req.userContext;
    const body = req.body;

    // verify currently logged-in user is metaAdmin
    if (userContext!.user.isMetaAdmin) { // only MetaAdmin users can select an org
      const newOrgId = body.orgId;

      // grab the new org, just like getUserContext above
      const org = await this.orgService.getOrgById(newOrgId);
      const clientUserContext = {user: userContext!.user, org: org};
      return res.status(200).json(clientUserContext);
    }
    else {
      throw new UnauthorizedError();
    }
  }

  afterAuth(req: Request, res: Response, loginResponse: any) {
    console.log('in afterAuth');
  }

}
