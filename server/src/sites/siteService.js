'use strict';
const GenericService = require('../common/genericService');

class SiteService extends GenericService {
    constructor(database) {
        super(database, 'sites');
    }

    validate(doc) {
        if (doc.code && doc.name) {
            // call base validation, which should return nothing if valid
            return super.validate(doc);
        }
        else {
            return 'Need code and name';
        }
    }

}

module.exports = SiteService;
