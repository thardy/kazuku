import {Express, NextFunction, Request, Response} from 'express';
import {IGenericApiService} from '#common/services/generic-api-service.interface';
import {OrganizationService} from '#features/organizations/organization.service';
import {AuthService} from '#features/auth/auth.service';
import {SetupService} from '#features/setup/setup.service';
import {Db} from 'mongodb';

export class SetupController {
  protected app: Express;
  protected setupService: SetupService;
  protected orgService: OrganizationService;
  protected authService: AuthService;

  constructor(app: Express, db: Db) {
    this.app = app;
    this.setupService = new SetupService(db);
    this.orgService = OrganizationService.getInstance(db);
    this.authService = new AuthService(db);

    this.mapRoutes(app);
  }

  mapRoutes(app: Express) {
    // Map routes
    // have to bind this because when express calls the function we tell it to here, it won't have any context and "this" will be undefined in our functions
    app.post(`/api/setup/initial-setup`, this.initialSetup.bind(this));
    app.get(`/api/setup/setup-state`, this.getSetupState.bind(this));
  }

  async initialSetup(req: Request, res: Response, next: NextFunction) {
    let body = req.body;

    const deviceId = this.authService.getAndSetDeviceIdCookie(req, res);
    const loginResponse = await this.setupService.initialSetup(body, deviceId);
    return res.status(201).json(loginResponse);
  }

  async getSetupState(req: Request, res: Response, next: NextFunction) {
    const setupCompleted = await this.setupService.setupCompleted();

    return res.status(200).json({setupCompleted: setupCompleted});
  }

}
