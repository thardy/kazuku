var config = require('../server/config');
var Promise = require("bluebird");
var database = require("../database/database").database;
const ObjectId = require('mongodb').ObjectID;
var _ = require("lodash");
var moment = require("moment");
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

//var existingProducts = [];
//var testOrgId = '5ab7fe90da90fa0fa857a557'; // temporary: until I get actual auth working for graphQL.  this probably breaks a lot of tests
var testOrgId = '5aad6ee15069c6aa32dea338';
var testUserId = '5af51f4cf6dd9aae8deaeffa';
var testSiteId = '5aad6ee15069c6aa32dea339';
var testProductsContentType = 'testProducts';
var differentTestProductsContentType = 'differentTestProducts';

let testOrg1 = { _id: new ObjectId(testOrgId), name: 'The Test Org One', code: 'test-org1', isMetaOrg: false, description: 'used in a lot of tests', statusId: 1 };
let testSite1 = { _id: new ObjectId(testSiteId), orgId: testOrgId, name: 'Test Site One', code: 'test-site1' };

let categorySchema = {
    "_id" : ObjectId("5ecfadbbbe699c289e2d2fb5"),
    "orgId" : testOrgId,
    "name" : "Categories",
    "contentType" : "categories",
    "description" : "These are categories. PH34R them!!!",
    "jsonSchema" : {
        "type" : "object",
        "properties" : {
            "name" : {
                "type" : "string",
                "description" : "Name"
            },
            "description" : {
                "type" : "string",
                "description" : "Description"
            },
        }
    }
};
let productSchema = {
    "_id" : ObjectId("5ec7d849ca136410308d2a7d"),
    "orgId" : testOrgId,
    "name" : "Test Products",
    "contentType" : "testProducts",
    "description" : "they are Test PRODUCTS!!!!",
    "jsonSchema" : {
        "type" : "object",
        "properties" : {
            "name" : {
                "type" : "string",
                "description" : "Name"
            },
            "description" : {
                "type" : "string",
                "description" : "Description"
            },
            "price" : {
                "type" : "number",
                "description" : "Price"
            },
            "quantity" : {
                "type" : "number",
                "description" : "Quantity"
            },
            "date_released" : {
                "type" : "date",
                "description" : "Date Released"
            }
        }
    }
};

var newProduct1 = { orgId: testOrgId, contentType: testProductsContentType, name: 'Widget', description: 'It is a widget.', price: 9.99, quantity: 1000, date_released: new Date('2014-01-01T00:00:00') };
var newProduct2 = { orgId: testOrgId, contentType: testProductsContentType, name: 'Log', description: 'Such a wonderful toy! It\'s fun for a girl or a boy.', price: 99.99, quantity: 20, date_released: new Date('2015-05-20T00:00:00') };
var newProduct3 = { orgId: testOrgId, contentType: testProductsContentType, name: 'Doohicky', description: 'Like a widget, only better.', price: 19.99, quantity: 85, date_released: new Date('2015-01-27T00:00:00') };

var differentProduct1 = { orgId: testOrgId, contentType: differentTestProductsContentType, name: 'Thingamajig', description: 'We do not know what this is.', price: 14.99, quantity: 1000, date_released: new Date('2016-01-01T00:00:00') };
var differentProduct2 = { orgId: testOrgId, contentType: differentTestProductsContentType, name: 'Rock', description: 'Natural fun, naturally.', price: 199.99, quantity: 20000, date_released: new Date('2016-05-20T00:00:00') };

var testContentType1 = 'testType1';
var testContentType2 = 'testType2';

var newUser1 = {
    orgId: testOrgId,
    email: "one@test.com"
};

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

function setupTestOrgs() {
    return deleteAllTestOrgs()
    .then(result => {
        return createTestOrgs();
    })
    .catch(error => {
        console.log(error);
        throw error;
    });
}

function setupTestSites() {
    return deleteAllTestSites()
    .then(result => {
        return createTestSites();
    })
    .catch(error => {
        console.log(error);
        throw error;
    });
}

function setupSchemasForQueryTests() {
    return deleteAllTestSchemas()
        .then(function(result) {
            return createSchemaForQueryTests();
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
}

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

function setupDifferentTestProducts() {
    return deleteAllDifferentTestProducts()
        .then(function(result) {
            return createDifferentTestProducts();
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
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

function setupTestUsers() {
  return deleteAllTestUsers()
    .then(result => {
        return createTestUsers();
    })
    .catch(error => {
        console.log(error);
        throw error;
    });
}

function createSchemaForQueryTests() {
    return Promise.all([
        database.customSchemas.insert(categorySchema),
        database.customSchemas.insert(productSchema),
    ])
    .then((schemas) => {
        testHelper.existingSchemas = schemas;
        // do I really need to do this - set a string "id" on each doc?
        _.forEach(testHelper.existingSchemas, function (item) {
            item.id = item._id.toHexString();
        });
        return schemas;
    })
    .catch(error => {
        console.log(error);
        throw error;
    });
}

function createTestProducts() {
    //var now = moment().format('MMMM Do YYYY, h:mm:ss a');
    return Promise.all([
        database.customData.insert(newProduct1),
        database.customData.insert(newProduct2),
        database.customData.insert(newProduct3)
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

function createTestOrgs() {
    return Promise.all([
        database.organizations.insert(testOrg1)
    ])
    .then((docs) => {
        testHelper.existingOrgs = docs;
        _.forEach(testHelper.existingOrgs, (item) => {
            item.id = item._id.toHexString();
        });
        return docs;
    })
    .catch(error => {
        console.log(error);
        throw error;
    });
}

function createTestSites() {
    return Promise.all([
        database.sites.insert(testSite1)
    ])
    .then((docs) => {
        testHelper.existingSites = docs;
        _.forEach(testHelper.existingSites, (item) => {
            item.id = item._id.toHexString();
        });
        return docs;
    })
    .catch(error => {
        console.log(error);
        throw error;
    });
}

function createDifferentTestProducts() {
    //var now = moment().format('MMMM Do YYYY, h:mm:ss a');
    return Promise.all([
        database.customData.insert(differentProduct1),
        database.customData.insert(differentProduct2),
    ])
        .then(function(docs) {
            testHelper.existingDifferentProducts = docs;
            _.forEach(testHelper.existingDifferentProducts, function (item) {
                item.id = item._id.toHexString();
            });
            return docs;
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
}

function createTestUsers() {
    var password = "one";
    bcrypt.genSaltAsync(config.saltWorkFactor)
      .then(salt => {
        return bcrypt.hashAsync(password, salt, null);
      })
      .then(hash => {
        newUser1.password = hash;
        return Promise.all([
            database.users.insert(newUser1),
        ])
        .then(docs => {
            testHelper.existingUsers = docs;
            _.forEach(testHelper.existingUsers, item => {
                item.id = item._id.toHexString();
            });
            return docs;
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
    });
}

function createTestSchemas() {
    //var now = moment().format('MMMM Do YYYY, h:mm:ss a');
    return Promise.all([
        database.customSchemas.insert(newSchema1),
        database.customSchemas.insert(newSchema2)
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

function deleteAllTestOrgs() {
    return database.organizations.remove({_id: new ObjectId(testOrgId)});
}

function deleteAllTestSites() {
    return database.sites.remove({orgId: testOrgId});
}

function deleteAllCustomDataForTestOrg() {
    return database.customData.remove({orgId: testOrgId});
}

function deleteAllTestProducts() {
    return database.customData.remove({orgId: testOrgId, contentType: testProductsContentType});
}

function deleteAllDifferentTestProducts() {
    return database.customData.remove({orgId: testOrgId, contentType: differentTestProductsContentType});
}

function deleteAllTestOrgCustomData() {
    return database.customData.remove({orgId: testOrgId});
}

function deleteAllTestSchemas() {
    return database.customSchemas.remove({orgId: testOrgId});
}

function deleteAllTestUsers() {
    return database.users.remove({orgId: testOrgId});
}

function stripFriendlyIdsFromModel(model) { }

var testHelper = {
    apiUrl: 'http://localhost:3001',
    testOrgId: testOrgId,
    testUserEmail: 'imatest@test.com',
    testUserId: testUserId,
    testSiteId: testSiteId,
    testProductsContentType: testProductsContentType,
    newProduct1: newProduct1,
    newProduct2: newProduct2,
    newProduct3: newProduct3,
    differentProduct1: differentProduct1,
    differentProduct2: differentProduct2,
    existingProducts: [],
    existingDifferentProducts: [],
    testContentType1: testContentType1,
    testContentType2: testContentType2,
    newSchema1: newSchema1,
    newSchema2: newSchema2,
    existingSchemas: [],
    newUser1: newUser1,
    existingUsers: [],
    existingOrgs: [],
    existingSites: [],
    setupTestOrgs: setupTestOrgs,
    setupTestSites: setupTestSites,
    setupSchemasForQueryTests: setupSchemasForQueryTests,
    setupTestProducts: setupTestProducts,
    setupDifferentTestProducts: setupDifferentTestProducts,
    createTestProducts: createTestProducts,
    deleteAllCustomDataForTestOrg: deleteAllCustomDataForTestOrg,
    deleteAllTestProducts: deleteAllTestProducts,
    deleteAllDifferentTestProducts: deleteAllDifferentTestProducts,
    deleteAllTestOrgCustomData: deleteAllTestOrgCustomData,
    setupTestSchemas: setupTestSchemas,
    deleteAllTestSchemas: deleteAllTestSchemas,
    setupTestUsers: setupTestUsers,
    createTestUsers: createTestUsers,
    deleteAllTestUsers: deleteAllTestUsers,
    stripFriendlyIdsFromModel: stripFriendlyIdsFromModel
};

module.exports = testHelper;
