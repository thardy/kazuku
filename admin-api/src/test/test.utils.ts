import {Db, ObjectId} from 'mongodb';
import _ from 'lodash';
import moment from 'moment';

import config from '#server/config/config';
import passwordUtils from '#common/utils/password.utils';
import entityUtils from '#common/utils/entity.utils';

let collections: any = {};

const testOrgId = '5aad6ee15069c6aa32dea338';
const testUserId = '5af51f4cf6dd9aae8deaeffa';
const testSiteId = '5aad6ee15069c6aa32dea339';
const testProductsContentType = 'test-products';
const differentTestProductsContentType = 'different-test-products';  // todo: consider changing these to hyphens (kebab-case), it would look better in a url - figure out why I started with snake-case

const testOrg1 = { _id: new ObjectId(testOrgId), name: 'The Test Org One', code: 'test-org1', isMetaOrg: false, description: 'used in a lot of tests', statusId: 1 };
const testSite1 = { _id: new ObjectId(testSiteId), orgId: testOrgId, name: 'Test Site One', code: 'test-site1' };

const categorySchema = {
  "_id" : new ObjectId('5ecfadbbbe699c289e2d2fb5'),
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
const productSchema = {
  "_id" : new ObjectId('5ec7d849ca136410308d2a7d'),
  "orgId" : testOrgId,
  "name" : "Test Products",
  "contentType" : testProductsContentType,
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
        "type" : "integer",
        "description" : "Quantity"
      },
      "date_released" : {
        "type" : "date",
        "description" : "Date Released"
      }
    }
  }
};

const newProduct1 = { orgId: testOrgId, contentType: testProductsContentType, name: 'Widget', description: 'It is a widget.', price: 9.99, quantity: 1000, dateReleased: new Date('2014-01-01T00:00:00') };
const newProduct2 = { orgId: testOrgId, contentType: testProductsContentType, name: 'Log', description: 'Such a wonderful toy! It\'s fun for a girl or a boy.', price: 99.99, quantity: 20, dateReleased: new Date('2015-05-20T00:00:00') };
const newProduct3 = { orgId: testOrgId, contentType: testProductsContentType, name: 'Doohicky', description: 'Like a widget, only better.', price: 19.99, quantity: 85, dateReleased: new Date('2015-01-27T00:00:00') };

const differentProduct1 = { orgId: testOrgId, contentType: differentTestProductsContentType, name: 'Thingamajig', description: 'We do not know what this is.', price: 14.99, quantity: 1000, dateReleased: new Date('2016-01-01T00:00:00') };
const differentProduct2 = { orgId: testOrgId, contentType: differentTestProductsContentType, name: 'Rock', description: 'Natural fun, naturally.', price: 199.99, quantity: 20000, dateReleased: new Date('2016-05-20T00:00:00') };

const testContentType1 = 'testType1';
const testContentType2 = 'testType2';

const newUser1: any = {
  orgId: testOrgId,
  email: "one@test.com"
};

const newSchema1 = {
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
const newSchema2 = {
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

function initialize(db: Db) {
  collections = {
    organizations: db.collection('organizations'),
    users: db.collection('users'),
    customData: db.collection('customData'),
    customSchemas: db.collection('customSchemas'),
    sites: db.collection('sites'),
    templates: db.collection('templates')
  };
}

function setupTestOrgs() {
  return deleteAllTestOrgs()
    .then((result: any) => {
      return createTestOrgs();
    })
    .catch((error: any) => {
      console.log(error);
      throw error;
    });
}

// function setupTestSites() {
//   return deleteAllTestSites()
//     .then((result: any) => {
//       return createTestSites();
//     })
//     .catch((error: any) => {
//       console.log(error);
//       throw error;
//     });
// }
//
// function setupSchemasForQueryTests() {
//   return deleteAllTestSchemas()
//     .then((result: any) => {
//       return createSchemaForQueryTests();
//     })
//     .catch((error: any) => {
//       console.log(error);
//       throw error;
//     });
// }
//
// function setupTestProducts() {
//   return deleteAllTestProducts()
//     .then((result: any) => {
//       return createTestProducts();
//     })
//     .catch((error: any) => {
//       console.log(error);
//       throw error;
//     });
// }
//
// function setupDifferentTestProducts() {
//   return deleteAllDifferentTestProducts()
//     .then((result: any) => {
//       return createDifferentTestProducts();
//     })
//     .catch((error: any) => {
//       console.log(error);
//       throw error;
//     });
// }
//
// function setupTestSchemas() {
//   return deleteAllTestSchemas()
//     .then((result: any) => {
//       return createTestSchemas();
//     })
//     .catch((error: any) => {
//       console.log(error);
//       throw error;
//     });
// }

async function setupTestUsers() {
  try {
    const result = await deleteAllTestUsers();
    return createTestUsers();
  }
  catch (error: any) {
    console.log(error);
    throw error;
  }
}

async function createTestOrgs() {
  try {
    const [newOrgs] = await Promise.all([
      collections.organizations.insertOne(testOrg1)
    ]);
    testUtils.existingOrgs = newOrgs;
    _.forEach(testUtils.existingOrgs, (item: any) => {
      item.id = item._id.toHexString();
    });
    return newOrgs;
  }
  catch (error: any) {
    console.log(error);
    throw error;
  }
}

async function createTestUsers() {
  try {
    const password = "one";
    const hashedAndSaltedPassword = passwordUtils.hashPassword(password);
    newUser1.password = hashedAndSaltedPassword;

    const [insertResult] = await Promise.all([
      collections.users.insertOne(newUser1),
    ]);
    testUtils.existingUsers = [newUser1];

    if (insertResult.insertedId) {
      _.forEach(testUtils.existingUsers, (item: any) => {
        entityUtils.useFriendlyId(item);
        entityUtils.removeMongoId(item);
      });
    }
    return testUtils.existingUsers;
  }
  catch (error: any) {
    console.log(error);
    throw error;
  }
}

// function createSchemaForQueryTests() {
//   return Promise.all([
//       database.customSchemas.insertOne(categorySchema),
//       database.customSchemas.insertOne(productSchema),
//     ])
//     .then((schemas) => {
//       testHelper.existingSchemas = schemas;
//       // do I really need to do this - set a string "id" on each doc?
//       _.forEach(testHelper.existingSchemas, function (item) {
//         item.id = item._id.toHexString();
//       });
//       return schemas;
//     })
//     .catch(error => {
//       console.log(error);
//       throw error;
//     });
// }

// function createTestProducts() {
//   //var now = moment().format('MMMM Do YYYY, h:mm:ss a');
//   return Promise.all([
//       database.customData.insertOne(newProduct1),
//       database.customData.insertOne(newProduct2),
//       database.customData.insertOne(newProduct3)
//     ])
//     .then(function(docs) {
//       testHelper.existingProducts = docs;
//       _.forEach(testHelper.existingProducts, function (item) {
//         item.id = item._id.toHexString();
//       });
//       return docs;
//     })
//     .catch(error => {
//       console.log(error);
//       throw error;
//     });
// }

// function createTestSites() {
//   return Promise.all([
//       collections.sites.insertOne(testSite1)
//     ])
//     .then((docs) => {
//       testHelper.existingSites = docs;
//       _.forEach(testHelper.existingSites, (item) => {
//         item.id = item._id.toHexString();
//       });
//       return docs;
//     })
//     .catch(error => {
//       console.log(error);
//       throw error;
//     });
// }

// function createDifferentTestProducts() {
//   //var now = moment().format('MMMM Do YYYY, h:mm:ss a');
//   return Promise.all([
//       collections.customData.insertOne(differentProduct1),
//       collections.customData.insertOne(differentProduct2),
//     ])
//     .then(function(docs) {
//       testHelper.existingDifferentProducts = docs;
//       _.forEach(testHelper.existingDifferentProducts, function (item) {
//         item.id = item._id.toHexString();
//       });
//       return docs;
//     })
//     .catch(error => {
//       console.log(error);
//       throw error;
//     });
// }

// function createTestSchemas() {
//   //var now = moment().format('MMMM Do YYYY, h:mm:ss a');
//   return Promise.all([
//       collections.customSchemas.insertOne(newSchema1),
//       collections.customSchemas.insertOne(newSchema2)
//     ])
//     .then(function(docs) {
//       testHelper.existingSchemas = docs;
//       _.forEach(testHelper.existingSchemas, function (item) {
//         item.id = item._id.toHexString();
//       });
//       return docs;
//     })
//     .catch(error => {
//       console.log(error);
//       throw error;
//     });
// }

function deleteAllTestOrgs() {
  return collections.organizations.deleteMany({_id: new ObjectId(testOrgId)});
}

function deleteAllTestUsers() {
  return collections.users.deleteMany({orgId: testOrgId});
}

// function deleteAllTestSites() {
//   return collections.sites.deleteMany({orgId: testOrgId});
// }
//
// function deleteAllTestCustomData() {
//   return collections.customData.deleteMany({orgId: testOrgId});
// }
//
// function deleteAllTestProducts() {
//   return collections.customData.deleteMany({orgId: testOrgId, contentType: testProductsContentType});
// }
//
// function deleteAllDifferentTestProducts() {
//   return collections.customData.deleteMany({orgId: testOrgId, contentType: differentTestProductsContentType});
// }
//
// function deleteAllTestCustomSchemas() {
//   return collections.customSchemas.deleteMany({orgId: testOrgId});
// }



const testUtils = {
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
  existingUsers: [] as any[],
  existingOrgs: [] as any[],
  existingSites: [],
  initialize,
  setupTestOrgs,
  setupTestUsers,
  createTestUsers,
  deleteAllTestUsers,
  // setupTestSites,
  // setupSchemasForQueryTests,
  // setupTestProducts,
  // setupDifferentTestProducts,
  // createTestProducts,
  // deleteAllTestCustomData,
  // deleteAllTestProducts,
  // deleteAllDifferentTestProducts,
  // setupTestSchemas,
  // deleteAllTestCustomSchemas,
};

export default testUtils;
