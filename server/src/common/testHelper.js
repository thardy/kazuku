var config = require('../server/config');
var Promise = require("bluebird");
var database = require("../database/database").database;
var _ = require("lodash");
var moment = require("moment");
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

//var existingProducts = [];
var testOrgId = 1;
var testProductsContentType = 'testProducts';
var newProduct1 = { orgId: testOrgId, contentType: testProductsContentType, name: 'Widget', description: 'It is a widget.', price: 9.99, quantity: 1000, created: new Date('2014-01-01T00:00:00') };
var newProduct2 = { orgId: testOrgId, contentType: testProductsContentType, name: 'Log', description: 'Such a wonderful toy! It\'s fun for a girl or a boy.', price: 99.99, quantity: 20, created: new Date('2015-05-20T00:00:00') };
var newProduct3 = { orgId: testOrgId, contentType: testProductsContentType, name: 'Doohicky', description: 'Like a widget, only better.', price: 19.99, quantity: 85, created: new Date('2015-01-27T00:00:00') };

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

function deleteAllTestProducts() {
    return database.customData.remove({orgId: testOrgId, contentType: testProductsContentType});
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
    newUser1: newUser1,
    existingUsers: [],
    setupTestProducts: setupTestProducts,
    createTestProducts: createTestProducts,
    deleteAllTestProducts: deleteAllTestProducts,
    deleteAllTestOrgCustomData: deleteAllTestOrgCustomData,
    setupTestSchemas: setupTestSchemas,
    createTestSchemas: createTestSchemas,
    deleteAllTestSchemas: deleteAllTestSchemas,
    setupTestUsers: setupTestUsers,
    createTestUsers: createTestUsers,
    deleteAllTestUsers: deleteAllTestUsers,
    stripFriendlyIdsFromModel: stripFriendlyIdsFromModel
};

module.exports = testHelper;
