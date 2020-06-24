"use strict";
import {database} from '../database/database.js';
import CrudController from '../common/crudController.js';
import TemplateService from './templateService.js';
import authHelper from '../common/authHelper.js';
import current from '../common/current.js';

class TemplatesController extends CrudController {
    constructor(app) {
        super('templates', app, new TemplateService(database));
    }

    mapRoutes(app) {
        // map routes
        app.get(`/api/${this.resourceName}/getallpages`, authHelper.isAuthenticated, this.getAllPages.bind(this));
        app.get(`/api/${this.resourceName}/getallnonpagetemplates`, authHelper.isAuthenticated, this.getAllNonPageTemplates.bind(this));
        app.get(`/api/${this.resourceName}/getbynameId/:nameId`, authHelper.isAuthenticated, this.getByNameId.bind(this));

        // map the base CrudController routes
        super.mapRoutes(app);
    }

    getByNameId(req, res, next) {
        let templateNameId = req.params.nameId;
        res.set("Content-Type", "application/json");

        this.service.getTemplate(current.context.orgId, templateNameId)
            .then((doc) => {
                if (doc === null) return next();

                return res.status(200).send(doc);
            })
            .catch(err => {
                err.message = 'ERROR: templatesController -> templateService.getTemplate({0}, {1}) - {2}'.format(current.context.orgId, templateNameId, err.message);
                return next(err);
            });
    }

    getAllPages(req, res, next) {
        res.set("Content-Type", "application/json");

        // Query mongo for templates that have a url property that is non-null
        this.service.find(current.context.orgId, { "url" : { $ne : null, $exists : true } })
            .then((templates) => {
                if (templates === null) return next();

                return res.status(200).send(templates);
            })
            .catch(err => {
                err.message = 'ERROR: templatesController -> templateService.find({0}, { "url" : { $ne : null, $exists : true } }) - {1}'.format(current.context.orgId, err.message);
                return next(err);
            });
    }

    getAllNonPageTemplates(req, res, next) {
        res.set("Content-Type", "application/json");

        // Query mongo for templates that do NOT have a url property
        this.service.find(current.context.orgId, { "url" : { $exists: false } })
            .then((templates) => {
                if (templates === null) return next();

                return res.status(200).send(templates);
            })
            .catch(err => {
                err.message = 'ERROR: templatesController -> templateService.find({0},  { "url" : { $exists: false } }) - {1}'.format(current.context.orgId, err.message);
                return next(err);
            });
    }

}

export default TemplatesController;



