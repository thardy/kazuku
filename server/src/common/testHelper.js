var config = require("../env-config");
var Promise = require("bluebird");
var database = require("../database/database");
var _ = require("lodash");
var moment = require("moment");

//var existingProducts = [];
var testOrgId = 1;
var testProductsContentType = 'testProducts';
var newProduct1 = { orgId: testOrgId, contentType: testProductsContentType, name: 'Widget', description: 'It is a widget.', price: 9.99, quantity: 1000, created: new Date(2014, 1, 1) };
var newProduct2 = { orgId: testOrgId, contentType: testProductsContentType, name: 'Log', description: 'Such a wonderful toy! It\'s fun for a girl or a boy.', price: 99.99, quantity: 20, created: new Date(2015, 6, 20) };
var newProduct3 = { orgId: testOrgId, contentType: testProductsContentType, name: 'Doohicky', description: 'Like a widget, only better.', price: 19.99, quantity: 85, created: new Date(2015, 2, 27)  };

var testHelper = {
    apiUrl: 'http://localhost:3000',
    testOrgId: testOrgId,
    testProductsContentType: testProductsContentType,
    setupTestProducts: setupTestProducts,
    createTestProducts: createTestProducts,
    deleteAllTestOrgCustomData: deleteAllTestOrgCustomData,
    deleteAllTestProducts: deleteAllTestProducts,
    newProduct1: newProduct1,
    newProduct2: newProduct2,
    newProduct3: newProduct3,
    existingProducts: []
};

function setupTestProducts() {
    return deleteAllTestProducts()
        .then(function(result) {
            return createTestProducts();
        })
        .then(null, function(error) {
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
            // TEST this!!!!
            _.forEach(testHelper.existingProducts, function (item) {
                item.id = item._id.toHexString();
            });
            return docs;
        })
        .then(null, function(error) {
            console.log(error);
            throw error;
        });;

}

function deleteAllTestOrgCustomData() {
    return database.customData.remove({orgId: testOrgId});
}

function deleteAllTestProducts() {
    return database.customData.remove({orgId: testOrgId, contentType: testProductsContentType});
}


module.exports = testHelper;
