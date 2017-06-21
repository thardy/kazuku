const config = require("../env-config");
const Promise = require("bluebird");
const CustomData = require('../customData/customData.model');
const CustomSchema = require('../customSchemas/customSchema.model');
const _ = require("lodash");
const moment = require("moment");
const ObjectID = require('mongodb').ObjectID;

//var existingProducts = [];
var testOrgId = '5949fdeff8e794bdbbfd3d85';
var testProductsContentType = 'testProducts';
var newProduct1 = { orgId: testOrgId, contentType: testProductsContentType, name: 'Widget', description: 'It is a widget.', price: 9.99, quantity: 1000, created: new Date('2014-01-01T00:00:00') };
var newProduct2 = { orgId: testOrgId, contentType: testProductsContentType, name: 'Log', description: 'Such a wonderful toy! It\'s fun for a girl or a boy.', price: 99.99, quantity: 20, created: new Date('2015-05-20T00:00:00') };
var newProduct3 = { orgId: testOrgId, contentType: testProductsContentType, name: 'Doohicky', description: 'Like a widget, only better.', price: 19.99, quantity: 85, created: new Date('2015-01-27T00:00:00') };

var testContentType1 = 'testType1';
var testContentType2 = 'testType2';
var newSchema1 = {
    orgId: testOrgId,
    contentType: testContentType1,
    jsonSchema: {
        "type": "object",
        "properties": {
            "favoriteString": {
                "type": "string",
                "name": "favoriteString",
                "title": "Favorite String"
            },
            "favoriteNumber": {
                "type": "number",
                "name": "favoriteNumber",
                "title": "Favorite Number"
            }
        }
    }
};
var newSchema2 = {
    orgId: testOrgId,
    contentType: testContentType2,
    jsonSchema: {
        "type": "object",
        "properties": {
            "someString": {
                "type": "string",
                "name": "someString",
                "title": "Some String"
            }
        }
    }
};

var testHelper = {
    apiUrl: 'http://localhost:3000',
    testOrgId: testOrgId,
    testProductsContentType: testProductsContentType,
    newProduct1: newProduct1,
    newProduct2: newProduct2,
    newProduct3: newProduct3,
    existingProducts: [],
    testContentType1: testContentType1,
    testContentType2: testContentType2,
    newSchema1: newSchema1,
    newSchema2: newSchema2,
    existingSchemas: [],
    setupTestProducts: setupTestProducts,
    createTestProducts: createTestProducts,
    deleteAllTestProducts: deleteAllTestProducts,
    deleteAllTestOrgCustomData: deleteAllTestOrgCustomData,
    setupTestSchemas: setupTestSchemas,
    createTestSchemas: createTestSchemas,
    deleteAllTestSchemas: deleteAllTestSchemas,
    stripFriendlyIdsFromModel: stripFriendlyIdsFromModel
};

function setupTestProducts() {
    return deleteAllTestProducts()
        .then(function(result) {
            return createTestProducts();
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
}

function createTestProducts() {
    //var now = moment().format('MMMM Do YYYY, h:mm:ss a');

    return Promise.all([
        CustomData.create(newProduct1),
        CustomData.create(newProduct2),
        CustomData.create(newProduct3)
    ])
        .then(function(docs) {
            testHelper.existingProducts = docs;
            _.forEach(testHelper.existingProducts, function (item) {
                item.id = item._id.toHexString();
            });
            return docs;
        })
        .catch(error => {
            console.log(error);
            throw error;
        });

}

function deleteAllTestProducts() {
    return CustomData.remove({orgId: testOrgId, contentType: testProductsContentType});
}

function deleteAllTestOrgCustomData() {
    return CustomData.remove({orgId: testOrgId});
}

function setupTestSchemas() {
    return deleteAllTestSchemas()
        .then(function(result) {
            return createTestSchemas();
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
}

function createTestSchemas() {
    //var now = moment().format('MMMM Do YYYY, h:mm:ss a');

    return Promise.all([
        CustomSchema.create(newSchema1),
        CustomSchema.create(newSchema2)
    ])
        .then(function(docs) {
            testHelper.existingSchemas = docs;
            _.forEach(testHelper.existingSchemas, function (item) {
                item.id = item._id.toHexString();
            });
            return docs;
        })
        .catch(error => {
            console.log(error);
            throw error;
        });

}

function deleteAllTestSchemas() {
    return CustomSchema.remove({orgId: testOrgId});
}

function stripFriendlyIdsFromModel(model) {


}


module.exports = testHelper;
