import {Db, ObjectId} from 'mongodb';
import _ from 'lodash';
import moment from 'moment';

import config from '#server/config/config';
import { passwordUtils, entityUtils } from '@kazuku-cms/common';

let collections: any = {};

const testOrgId = '5aad6ee15069c6aa32dea338';
const testSiteId = '5aad6ee15069c6aa32dea339';
const testProductsContentType = 'test-products';
const differentTestProductsContentType = 'different-test-products';

const testOrg1 = { _id: new ObjectId(testOrgId), name: 'The Test Org One', code: 'test-org1', isMetaOrg: false, description: 'used in a lot of tests', statusId: 1 };
const testSite1 = { _id: new ObjectId(testSiteId), orgId: testOrgId, name: 'Test Site One', code: 'test-site1' };

const testUserId = '5af51f4cf6dd9aae8deaeffa';
const testUserEmail = 'test@test.com';
const testUserPassword = 'test';
const newUser1Email= 'one@test.com';
const newUser1Password = 'testone';

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

async function createIndexes(db: Db) {
  // create indexes - keep this in sync with the k8s/02-mongo-init-configmap.yaml that is used for actual deployment
  //  If we can figure out how to use a single file for both, that would be great.
  await db.command({
    createIndexes: "users", indexes: [ { key: { email: 1 }, name: 'email_index', unique: true, collation: { locale: 'en', strength: 1 } }]
  });
  await db.command({
    createIndexes: "organizations", indexes: [
      { key: { code: 1 }, name: 'code_index', unique: true, collation: { locale: 'en', strength: 1 } },
      { key: { name: 1 }, name: 'name_index', unique: true, collation: { locale: 'en', strength: 1 } }
    ]
  });
}

async function setupTestOrgs() {
  try {
    const result = await deleteAllTestOrgs();
    return createTestOrgs();
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

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

async function createTestOrgs() {
  try {
    const [insertResult] = await Promise.all([
      collections.organizations.insertOne(testOrg1)
    ]);
    testUtils.existingOrgs = [testOrg1];

    if (insertResult.insertedId) {
      _.forEach(testUtils.existingOrgs, (item: any) => {
        entityUtils.useFriendlyId(item);
        entityUtils.removeMongoId(item);
      });
    }
    return testUtils.existingOrgs;
  }
  catch (error: any) {
    console.log(error);
    throw error;
  }
}

async function createTestUsers() {
  try {
    const testUser = {
      orgId: testOrgId,
      email: testUserEmail,
      password: testUserPassword,
      isMetaAdmin: false,
    };
    const hashedAndSaltedPassword = await passwordUtils.hashPassword(testUser.password);
    testUser.password = hashedAndSaltedPassword;

    const [insertResult] = await Promise.all([
      collections.users.insertOne(testUser),
    ]);
    testUtils.existingUsers = [testUser];

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
  testOrgId,
  testUserId,
  testUserEmail,
  testUserPassword,
  newUser1Email,
  newUser1Password,
  testSiteId,
  testProductsContentType,
  newProduct1,
  newProduct2,
  newProduct3,
  differentProduct1,
  differentProduct2,
  existingProducts: [],
  existingDifferentProducts: [],
  testContentType1,
  testContentType2,
  newSchema1,
  newSchema2,
  existingSchemas: [],
  existingUsers: [] as any[],
  existingOrgs: [] as any[],
  existingSites: [],
  initialize,
  createIndexes,
  setupTestOrgs,
  setupTestUsers,
  // setupTestSites,
  // setupSchemasForQueryTests,
  // setupTestProducts,
  // setupDifferentTestProducts,
  // createTestProducts,
  deleteAllTestOrgs,
  deleteAllTestUsers,
  // deleteAllTestCustomData,
  // deleteAllTestProducts,
  // deleteAllDifferentTestProducts,
  // setupTestSchemas,
  // deleteAllTestCustomSchemas,
};

export default testUtils;
