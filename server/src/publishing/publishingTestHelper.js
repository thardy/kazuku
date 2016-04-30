"use strict";
var database = require("../database/database");
var _ = require("lodash");
var CustomDataService = require("../customData/customDataService");
var TemplateService = require("../templates/templateService");
var QueryService = require("../queries/queryService");
var CustomSchemaService = require("../customSchemas/customSchemaService");
var sinon = require("sinon");

var testOrgId = 1;
// todo: flesh these out
var newQuery1 = { orgId: testOrgId, name: 'Widget', description: 'It is a widget.', created: new Date('2014-01-01T00:00:00') };
var newQuery2 = { orgId: testOrgId, name: 'Log', description: 'Such a wonderful toy! It\'s fun for a girl or a boy.', created: new Date('2015-05-20T00:00:00') };
var newQuery3 = { orgId: testOrgId, name: 'Doohicky', description: 'Like a widget, only better.', created: new Date('2015-01-27T00:00:00') };
// todo: flesh these out
var newTemplate1 = { orgId: testOrgId, name: 'Widget', description: 'It is a widget.', created: new Date('2014-01-01T00:00:00') };
var newTemplate2 = { orgId: testOrgId, name: 'Log', description: 'Such a wonderful toy! It\'s fun for a girl or a boy.', created: new Date('2015-05-20T00:00:00') };
var newTemplate3 = { orgId: testOrgId, name: 'Doohicky', description: 'Like a widget, only better.', created: new Date('2015-01-27T00:00:00') };

var pubTestHelper = {
    setupItemsToBeRegenerated: setupItemsToBeRegenerated,

    fakeCustomDataService: {},
    fakeCustomSchemaService: {},
    fakeQueryService: {},
    fakeTemplateService: {},
    fakeFileService: {}
};

function setupItemsToBeRegenerated() {
    return Promise.all([
        deleteAllTestQueries(),
        deleteAllTestTemplates()
    ])
        .then(function(result) {
            return Promise.all([
                createTestQueries(),
                createTestTemplates()
            ]);
        })
//        .then(null, function(error) {
//            console.log(error);
//            throw error;
//        });
        .catch(function (error) {
            console.log(error);
            throw error;
        })
}

function createTestQueries() {
    //var now = moment().format('MMMM Do YYYY, h:mm:ss a');

    return Promise.all([
        database.queries.insert(newQuery1),
        database.queries.insert(newQuery2),
        database.queries.insert(newQuery3)
    ])
        .then(function(docs) {
            pubTestHelper.existingQueries = docs;
            _.forEach(pubTestHelper.existingQueries, function (item) {
                item.id = item._id.toHexString();
            });
            return docs;
        })
        .then(null, function(error) {
            console.log(error);
            throw error;
        });

}

function createTestTemplates() {
    //var now = moment().format('MMMM Do YYYY, h:mm:ss a');

    return Promise.all([
        database.templates.insert(newTemplate1),
        database.templates.insert(newTemplate2),
        database.templates.insert(newTemplate3)
    ])
        .then(function(docs) {
            pubTestHelper.existingTemplates = docs;
            _.forEach(pubTestHelper.existingTemplates, function (item) {
                item.id = item._id.toHexString();
            });
            return docs;
        })
        .then(null, function(error) {
            console.log(error);
            throw error;
        });

}

function deleteAllTestQueries() {
    return database.queries.remove({orgId: testOrgId});
}

function deleteAllTestTemplates() {
    return database.templates.remove({orgId: testOrgId});
}

module.exports = pubTestHelper;

