// just a running list of all the configurations made to the db. NOT CURRENTLY SETUP TO RUN THIS FILE

// ***** CustomData ****************************************
db.createCollection('customData', {});
db.customData.createIndex( { "orgId": 1, "contentType": 1 });
db.customData.createIndex( { "orgId": 1, "contentType": 1, "_id": 1 }, { unique: true } ); // created because we will always provide an orgId on lookups, to enforce multi-tenant

// sample document
// var newCustomData = { orgId: 1, contentType: 'blogPost', name: 'My First Blog Post', content: 'Imagine a well written blog here.'};



// ***** CustomSchemas ****************************************
db.createCollection('customSchemas', {});
db.customSchemas.createIndex( { "orgId": 1, "contentType": 1 }, { unique: true });

// sample document - https://github.com/dschnelldavis/angular2-json-schema-form (contentType must be snake-cased (e.g. product_types)
// var newCustomSchema = {
// id: 1,
//    orgId: 1,
//    name: 'Applicant',
//    contentType: 'applicant',
//    description: 'this is cool'
//    jsonSchema: {
//        "type": "object",
//        "properties": {
//        "affiliatedWith": {
//            "type": "string",
//            "description": "Affiliated With"
//        },
//        "favoriteNumber": {
//            "type": "number",
//            "description": "Favorite Number"
//        },
//        "likes": {
//            "type": "string",
//            "description": "Likes"
//        }
//    }
// };



// ***** Templates ****************************************
db.createCollection('templates', {});
db.templates.createIndex( { "nameId": 1}, { unique: true });
// Case-insensitive index
db.templates.createIndex( { "orgId": 1, "name": 1 }, { unique: true }, { collation: { locale: 'en', strength: 1 }});

// sample document (nameId must be kebab-cased)
// var newTemplate = { orgId: 1, siteId: 1, name: '$Test Template1', nameId: 'test-template1', layout: 'master', description: 'cool template   ', template: '#Test Page 1 - Existing',
//                      dependencies: [], regenerate: 0,
//                      created: new Date(), createdBy: 1, updated: null, updatedBy: null};




// ***** Queries ****************************************
db.createCollection('queries', {});
db.queries.createIndex( { "nameId": 1}, { unique: true });
// Case-insensitive index (requires MongoDb 3.4)
db.queries.createIndex( { "orgId": 1, "name": 1 }, { unique: true }, { collation: { locale: 'en', strength: 1 }});

// sample document (nameId must be kebab-cased)
// var newQuery = { orgId: 1, siteId: 1, name: '$Test Query1', nameId: 'test-query1', query: 'blah blah', results: [],
//                      description: 'this is a cool query',
//                      dependencies: [], regenerate: 0,
//                      created: new Date(), createdBy: 1, updated: null, updatedBy: null};





// ***** Organizations ****************************************
db.createCollection('organizations', {});
// force code to always be lowercase (and disallow anything that can't go in a url hostname)
db.organizations.createIndex( { "code": 1 }, { unique: true });
// Case-insensitive index
db.organizations.createIndex( { "name": 1 }, { unique: true }, { collation: { locale: 'en', strength: 1 }} );


// sample document
// var newOrg = { name: 'Acme Corp', code: 'acme', description: 'A cool company.', statusId: 1, isMetaOrg: false,
//                      created: new Date(), createdBy: 1, updated: null, updatedBy: null};





// ***** Sites ****************************************
db.createCollection('sites', {});
db.sites.createIndex( { "orgId": 1, "code": 1 }, { unique: true });

// sample document
// var newSite = { orgId: 1, code: 1, name: 'Acme Corp', domainName: 'mydomain.com',
//                      created: new Date(), createdBy: 1, updated: null, updatedBy: null};






// ***** Users ****************************************
db.createCollection('users', {});
db.users.createIndex({ "email": 1 }, { unique: true }, { collation: { locale: 'en', strength: 1 }});

//sample document
// var newUser = { orgId: 1, email: "joe@test.com", password: "lkj234oiulkj", firstName: "Joe", lastName: "Smith", lastLoggedIn: "1/1/2017",
//                 isMetaAdmin: false,
//                 facebook: {
//                     id: String,
//                     token: String,
//                     email: String,
//                     name: String
//                 },
//                 google: {
//                     id: String,
//                     token: String,
//                     email: String,
//                     name: String
//                 },
//                 created: new Date(), createdBy: 1, updated: null, updatedBy: null};
