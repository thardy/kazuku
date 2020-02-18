const {GraphQLSchema, GraphQLObjectType, GraphQLInputObjectType, GraphQLID,
       GraphQLString, GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLList} = require('graphql');
const {simpleQuery, simpleCreateMutation, simpleUpdateMutation, simpleDeleteMutation} = require('./graphql.helper');
const {GraphQLDateTime} = require('graphql-iso-date');
const {makeExecutableSchema} = require('apollo-server-express');
const CustomDataService = require('../../customData/customDataService');
const CustomSchemaService = require('../../customSchemas/customSchemaService');
const OrganizationService = require('../../organizations/organizationService');
const current = require('../../common/current');
const ObjectId = require('mongodb').ObjectID;
const mongoHelper = require('../../common/mongoHelper');
const pluralize = require('pluralize')
const _ = require("lodash");

const typesThatNeedFurtherProcessing = ['$ref', 'array'];
const jsonSchemaMappingKeys = ['jsonSchemaSchema', 'jsonSchemaId', 'jsonSchemaRef'];

class SchemaService {

    constructor(database) {
        this.customDataService = new CustomDataService(database);
        this.customSchemaService = new CustomSchemaService(database);
        this.orgService = new OrganizationService(database);

        // this.thanosTypedefs = `
        //     scalar GraphQLDateTime
        //
        //     type BlogPost {
        //         _id: GraphQLID
        //         orgId: GraphQLString
        //         contentType: GraphQLString
        //         name: GraphQLString
        //         shortDescription: GraphQLString
        //         body: GraphQLString
        //         created: GraphQLDateTime
        //         createdBy: GraphQLString
        //         updated: GraphQLDateTime
        //         updatedBy: GraphQLString
        //     }
        //
        //     type NavItem {
        //         _id: GraphQLID
        //         orgId: GraphQLString
        //         contentType: GraphQLString
        //         name: GraphQLString
        //         url: GraphQLString
        //         sortOrder: GraphQLInt
        //         created: GraphQLDateTime
        //         createdBy: GraphQLString
        //         updated: GraphQLDateTime
        //         updatedBy: GraphQLString
        //     }
        //
        //     type Query {
        //         blogPosts: [BlogPost]
        //         blogPost(id: GraphQLID!): BlogPost
        //     }
        // `;
        // todo: add mutations (blogPosts_create, blogPosts_update, blogPosts_delete)

        // this.thanosResolvers = {
        //     Query: {
        //         blogPosts: () => this.customDataService.getByContentType('5ab7fe90da90fa0fa857a557', 'blog-posts'),
        //         blogPost: (id) => this.customDataService.getByTypeAndId('5ab7fe90da90fa0fa857a557', 'blog-posts', id),
        //     },
        // };

        // this.adminTypedefs = `
        //     scalar GraphQLDateTime
        //
        //     type Product {
        //         _id: GraphQLID
        //         orgId: GraphQLString
        //         contentType: GraphQLString
        //         name: GraphQLString
        //         favoriteColor: GraphQLString
        //         fathersMaidenName: GraphQLString
        //         created: GraphQLDateTime
        //         createdBy: GraphQLString
        //         updated: GraphQLDateTime
        //         updatedBy: GraphQLString
        //     }
        //
        //     type Query {
        //         products: [Product]
        //         product(id: GraphQLID!): Product
        //     }
        // `;
        //
        // this.adminResolvers = {
        //     Query: {
        //         products: () => this.customDataService.getByContentType('59781da087c7f925f49f90bf', 'products'),
        //         product: (id) => this.customDataService.getByTypeAndId('59781da087c7f925f49f90bf', 'products', id),
        //     },
        // };
        //
        // this.thanosSchema = {
        //     typeDefs: this.thanosTypedefs,
        //     resolvers: this.thanosResolvers,
        // };
        //
        // this.adminSchema = {
        //     typeDefs: this.adminTypedefs,
        //     resolvers: this.adminResolvers,
        // };

    }

    async getSchemaByRepoCode(orgCode) {
        let schema = {};
        //const orgId = await this.getOrgIdByRepoCode(orgCode);
        // get orgId from auth.  I don't think we will have different schemas per site, just by org.
        const orgId = current.context.orgId;
        //const orgId = '5ab7fe90da90fa0fa857a557';

        // todo: try to pull from cache

        // todo: debug and make sure it works!
        // todo: refactor naming to make some sort of sense.  This is complicated stuff.
        // if not found in cache, retrieve schema from database
        let orgCustomSchemas = [];
        return this.customSchemaService.getAll(orgId)
            .then((allCustomSchemas) => {
                orgCustomSchemas = allCustomSchemas.map((orgCustomSchema) => {
                    return this.mapJsonSchemaProperties(orgCustomSchema);
                });

                const allContentTypesFields = {}; // the simplified graphQL field data for each custom contentType
                const jsonSchemaIdToNameMappings = {}; // used to map jsonSchema ids to contentTypeNames
                const allContentTypesByFriendlyName = {}; // the GraphQLObjectType objects for each contentType
                // todo: refactor to get rid of this
                const allObjectDefinitionsByFriendlyName = {};
                const allInputTypeFieldsByFriendlyName = {};
                const allInputTypesByFriendlyName = {};
                const contentTypeActions = []; // used to create the root query and mutations

                // first pass
                for (const customSchema of orgCustomSchemas) {
                    const contentTypeName = _.camelCase(customSchema.name.trim()); //.replace(/ /g, '');
                    const firstPassContentTypeFields = this.getContentTypeFieldsForCustomSchema(customSchema, jsonSchemaIdToNameMappings);
                    allContentTypesFields[contentTypeName] = firstPassContentTypeFields;
                    // we need a placeholder to hold all the finished GraphQLObjectType objects because we have to reference them by their
                    //  contentTypeNames before we've even defined the contentType objects (***see this complicated thing***)
                    allContentTypesByFriendlyName[contentTypeName] = GraphQLString;
                }

                // create inputTypes from allContentTypeFields
                for (const contentTypeName in allContentTypesFields) {
                    const inputTypeFields = this.getInputTypeFieldsFromContentTypeFields(allContentTypesFields[contentTypeName]);
                    allInputTypeFieldsByFriendlyName[contentTypeName] = inputTypeFields;

                    const inputType = new GraphQLInputObjectType({
                        name: contentTypeName + 'Input',
                        fields: inputTypeFields
                    });

                    allInputTypesByFriendlyName[contentTypeName] = inputType;
                }

                // second pass - we have all the simplified type data, knowing which types reference other types and which ones they reference.
                // loop through all the types, replacing all reference types with references to those type objects (or at least their
                //  GraphQLObjectType placeholders)
                // todo: TRY THIS NEXT. pretty sure this entire second pass loop needs to go INSIDE the fields: () => thing
                // for (const contentTypeName in allContentTypesFields) {
                //     const contentTypeFields = allContentTypesFields[contentTypeName];
                //     for (const contentFieldName in contentTypeFields) {
                //         //  whenever we see a customDataTypeFields[propertyName].type that starts with either 'array:' or '$ref:',
                //         const jsonSchemaType = contentTypeFields[contentFieldName].type;
                //         let referencedTypeId = '';
                //         let referencedTypeName = '';
                //
                //         if (jsonSchemaType.startsWith('array:')) {
                //             referencedTypeId = jsonSchemaType.replace('array:', '');
                //             referencedTypeName = jsonSchemaIdToNameMappings[referencedTypeId];
                //             const graphQLTypeObject = allContentTypesByFriendlyName[referencedTypeName];
                //             // ***this complicated thing***
                //             // e.g. what an actual object looks like with relationships. Note the categoryType - it's referenced before it's even
                //             //  defined, but it works because of the timing of the () => {} evaluation (javascript for the win :)...
                //             // const categoryType = new GraphQLObjectType({
                //             //     name: 'CategoryType',
                //             //     fields: () => ({
                //             //         name: { type: GraphQLString },
                //             //         children: { type: new GraphQLList(categoryType) } // self-referencing relationship
                //             //     })
                //             // });
                //             // todo: I think I need to delay the wrapping new GraphQLList() around the type name until the fields definition - do all this stuff (the whole loop) below?
                //             //contentTypeFields[contentFieldName].type = new GraphQLList(graphQLTypeObject);
                //             contentTypeFields[contentFieldName].type = GraphQLList(graphQLTypeObject); // todo: THIS has to happen inside the fields: () => thing
                //         }
                //         else if (jsonSchemaType.startsWith('$ref:')) { // we might be able to do these outside, but I'm pretty sure the GraphQLList ones must go inside
                //             referencedTypeId = jsonSchemaType.replace('$ref:', '');
                //             referencedTypeName = jsonSchemaIdToNameMappings[referencedTypeId];
                //             const graphQLTypeObject = allContentTypesByFriendlyName[referencedTypeName];
                //             contentTypeFields[contentFieldName].type = graphQLTypeObject;
                //         }
                //         else {
                //             const graphQLType = this.getGraphQLTypeForScalarProperty(jsonSchemaType);
                //             contentTypeFields[contentFieldName].type = graphQLType;
                //         }
                //     }
                // }
                // second pass - create the actual GraphQLObjectType objects
                for (const contentTypeName in allContentTypesFields) {
                    const objectDefinition = this.getGraphQLObjectDefinition(contentTypeName, allContentTypesFields, jsonSchemaIdToNameMappings, allContentTypesByFriendlyName);
                    allObjectDefinitionsByFriendlyName[contentTypeName] = objectDefinition;
                    const contentType = new GraphQLObjectType(objectDefinition);

                    // ***this complicated thing*** this is where we replace the placeholder with the actual GraphQLObjectType object.
                    // Whenever GraphQL accesses the fields, it gets the actual referenced types
                    allContentTypesByFriendlyName[contentTypeName] = contentType;
                }


                // last pass - create the actions for queries and mutations
                for (const contentTypeName in allContentTypesFields) {
                    const contentTypeAction = this.getGraphQLActionForCustomSchema(contentTypeName,
                        allContentTypesByFriendlyName[contentTypeName],
                        allInputTypesByFriendlyName[contentTypeName],
                        allInputTypeFieldsByFriendlyName[contentTypeName]);
                    contentTypeActions.push(contentTypeAction);
                }

                const rootQueryFields = contentTypeActions.reduce((actions, action) => {
                    actions[action.id] = action.query;
                    return actions;
                }, {});

                const rootQuery = new GraphQLObjectType({
                    name: 'root_query',
                    fields: () => rootQueryFields
                });

                const rootMutationFields = contentTypeActions.reduce((acc, action) => {
                    for (let key in action.mutation) {
                        acc[key+'_'+action.id] = action.mutation[key];
                    }
                    return acc;
                }, {});

                const rootMutation = new GraphQLObjectType({
                    name: 'root_mutation',
                    fields: rootMutationFields
                });

                schema = new GraphQLSchema({
                    query: rootQuery,
                    mutation: rootMutation,
                    subscription: undefined, // TODO: Find a solution for Subscriptions
                });

                return Promise.resolve(schema);
            });
    }

    // getGraphQLObjectType(contentTypeName, allContentTypeFields, allContentTypesByFriendlyName) {
    //
    // }

    getGraphQLActionForCustomSchema(contentTypeName, contentType, inputType, inputTypeFields) {
        // figuring out what I need to dynamically put these together...
        // const contentType = {
        //     name: 'CategoryType',
        //     fields: {
        //         name: { type: GraphQLString },
        //         birthdate: { type: GraphQLDateTime },
        //         author: { type: authorType }, // authorType = allContentTypesByFriendlyName[referencedTypeName]
        //         tags: { type: GraphQLList(tagType)} // tagType = allContentTypesByFriendlyName[referencedTypeName]
        //     }
        // };
        // const contentTypeFieldMetaData = {
    //         name: {
        //         type: 'string'
        //     },
    //         birthdate: {
        //         type: 'date'
        //     },
    //         author: {
        //         type: '$ref:authorType'
        //     }, // authorType = allContentTypesByFriendlyName[referencedTypeName]
    //         tags: {
        //         type: 'array:tagType'
        //     } // tagType = allContentTypesByFriendlyName[referencedTypeName]
        // };

        // const contentType = new GraphQLObjectType(this.getGraphQLObjectDefinition(contentTypeName, allContentTypeFields));
        //
        // // ***this complicated thing*** this is where we replace the placeholder with the actual GraphQLObjectType object.
        // // Whenever GraphQL accesses the fields, it gets the actual referenced types
        // allContentTypesByFriendlyName[contentTypeName] = contentType;

        const contentTypeAction = {
            id: contentTypeName,
            query: simpleQuery(contentType, inputType),
            mutation: {
                create: simpleCreateMutation(contentType, inputTypeFields),
                update: simpleUpdateMutation(contentType, inputType),
                delete: simpleDeleteMutation(contentType, inputType),
            }
        };

        return contentTypeAction;
    }

    getGraphQLObjectDefinition(contentTypeName, allContentTypesFields, jsonSchemaIdToNameMappings, allContentTypesByFriendlyName) {
        const graphQLObjectDefinition = {
            name: contentTypeName,
            // the loop that looks for "needsFurtherProcessing" has to go inside fields: () =>
            fields: () => {
                const contentTypeFields = {};
                const firstPassContentTypeFields = allContentTypesFields[contentTypeName];
                // handle any reference fields by pointing them to the appropriate contentType
                for (const contentFieldName in firstPassContentTypeFields) {
                    //  whenever we see a firstPassContentTypefields[contentFieldName].type that starts with either 'array:' or '$ref:',
                    const jsonSchemaType = firstPassContentTypeFields[contentFieldName].type;
                    let referencedTypeId = '';
                    let referencedTypeName = '';

                    if (jsonSchemaType.startsWith('array:')) {
                        const arrayType = jsonSchemaType.replace('array:', '');
                        referencedTypeName = jsonSchemaIdToNameMappings[arrayType];
                        const graphQLTypeObject = referencedTypeName ? allContentTypesByFriendlyName[referencedTypeName] : this.getGraphQLTypeForScalarProperty(arrayType);
                        // ***this complicated thing***
                        // e.g. what an actual object looks like with relationships. Note the categoryType - it's referenced before it's even
                        //  defined, but it works because of the timing of the () => {} evaluation (javascript for the win :)...
                        // const categoryType = new GraphQLObjectType({
                        //     name: 'CategoryType',
                        //     fields: () => ({
                        //         name: { type: GraphQLString },
                        //         children: { type: new GraphQLList(categoryType) } // self-referencing relationship
                        //     })
                        // });
                        // we need to delay the wrapping new GraphQLList() around the type name until the fields definition - hence we do it here
                        contentTypeFields[contentFieldName] = {};
                        contentTypeFields[contentFieldName].type = GraphQLList(graphQLTypeObject); // THIS has to happen inside the fields: () => thing

                        if (referencedTypeName) {
                            // create the resolve function to retrieve the array of related items
                            contentTypeFields[contentFieldName].resolve = async (parent, {ignoredFilter}, context) => {
                                // todo: for preview functionality, we need to check the customDataDrafts db for results here, then pull the same results from
                                //  the normal/live db.  Have the drafts results override any live results, but only if present (nulls/nodata don't override anything).
                                //  If a draft result exists with the same _id as a live result, the draft result wins.

                                // need singular of the contentFieldName
                                const singularContentFieldName = pluralize.singular(contentFieldName);
                                const relationIdField = singularContentFieldName + "Ids";
                                const relationIdFieldValues = mongoHelper.convertArrayOfStringIdsToObjectIds(parent[relationIdField]);
                                let convertedResults = null;

                                if (relationIdFieldValues && relationIdFieldValues.length > 0) {
                                    const snakeCasedReferencedContentTypeName = _.snakeCase(referencedTypeName);
                                    const filter = {_id: { $in: relationIdFieldValues }};

                                    filter['orgId'] = {$eq: current.context.orgId};
                                    filter['contentType'] = {$eq: snakeCasedReferencedContentTypeName};

                                    const results = await context.db.collection('customData').find(filter).toArray();
                                    convertedResults = results.map(mongoHelper.convertObjectIdToStringId);
                                }

                                return convertedResults;
                            }
                        }
                    }
                    else if (jsonSchemaType.startsWith('$ref:')) {
                        referencedTypeId = jsonSchemaType.replace('$ref:', '');
                        referencedTypeName = jsonSchemaIdToNameMappings[referencedTypeId];
                        const graphQLTypeObject = allContentTypesByFriendlyName[referencedTypeName];
                        contentTypeFields[contentFieldName] = {};
                        contentTypeFields[contentFieldName].type = graphQLTypeObject;

                        // create the resolve function to retrieve the single related item
                        contentTypeFields[contentFieldName].resolve = async (parent, {ignoredFilter}, context) => {
                            const relationIdField = contentFieldName + "Id";
                            const relationIdFieldValue = parent[relationIdField];
                            let convertedResult = null;

                            if (relationIdFieldValue) {
                                const snakeCasedReferencedContentTypeName = _.snakeCase(referencedTypeName);
                                const filter = {_id: new ObjectId(relationIdFieldValue)};

                                filter['orgId'] = {$eq: current.context.orgId};
                                filter['contentType'] = {$eq: snakeCasedReferencedContentTypeName};

                                const result = await context.db.collection('customData').findOne(filter);
                                convertedResult = mongoHelper.convertObjectIdToStringId(result);
                            }

                            return convertedResult;
                        }
                    }
                    else {
                        const graphQLType = this.getGraphQLTypeForScalarProperty(jsonSchemaType);
                        contentTypeFields[contentFieldName] = {};
                        contentTypeFields[contentFieldName].type = graphQLType;
                    }
                }
                return contentTypeFields;
            }
        };

        return graphQLObjectDefinition;
    }

    getContentTypeFieldsForCustomSchema(customSchema, jsonSchemaIdToNameMappings) {
        const contentTypeName = _.camelCase(customSchema.name.trim()); //.replace(/ /g, '');

        if (customSchema.jsonSchema['$id']) {
            // map the jsonSchemaId to the friendly name - we will map any customSchema that comes through with an '$id' specified
            // (e.g.  jsonSchemaIdToNameMappings['https://thanos.kazuku.com/api/jsonschemas/tags.schema.json'] = 'tags')
            jsonSchemaIdToNameMappings[customSchema.jsonSchema['$id']] = contentTypeName;
        }

        const contentTypeFields = {
            _id: {
                type: 'graphQLID'
            },
            orgId: {
                type: 'string'
            },
            contentType: {
                type: 'string'
            },
            created: {
                type: 'date'
            },
            createdBy: {
                type: 'string'
            },
            updated: {
                type: 'date'
            },
            updatedBy: {
                type: 'string'
            }
        };

        for (const property in customSchema.jsonSchema.properties) {
            const propertyName = _.camelCase(property);
            const rawJsonSchemaType = customSchema.jsonSchema.properties[property].type || customSchema.jsonSchema.properties[property]['$ref'];
            let jsonSchemaType = this.getJsonSchemaTypeForSchemaProperty(rawJsonSchemaType);

            const needsFurtherProcessing = typesThatNeedFurtherProcessing.includes(jsonSchemaType);

            if (needsFurtherProcessing) {
                switch(jsonSchemaType) {
                    case 'array':
                        // example jsonSchema for scalar array
                        // "additionalName": {
                        //     "type": "array",
                        //     "items": {
                        //         "type": "string"
                        //     }
                        // }
                        // or..............
                        // example json Schema for referential array
                        // "tags" : {
                        //     "type" : "array",
                        //     "items" : {
                        //         "$ref" : "https://thanos.kazuku.com/api/jsonschemas/tags.schema.json"
                        //     },
                        // }
                        let typeInArray = '';
                        if (customSchema.jsonSchema.properties[property].items.type) {
                            // need to store this as a meta-type, something like 'array: something' and translate to new GraphQLList(GraphQLString) later
                            // const jsonSchemaType = customSchema.jsonSchema.properties[property].items.type;
                            // const graphQLType = this.getGraphQLTypeForScalarProperty(jsonSchemaType);
                            // jsonSchemaType = new GraphQLList(graphQLType);
                            // new fix attempt
                            jsonSchemaType = `array:${customSchema.jsonSchema.properties[property].items.type}`;
                            // it was this... the above is my first attempt to fix it
                            //jsonSchemaType = new GraphQLList(customSchema.jsonSchema.properties[property].items.type);
                        }
                        else if (customSchema.jsonSchema.properties[property].items['$ref']) {
                            // this will just be a placeholder.  We have to make a second pass after all other types are done to replace with
                            // the actual customDataType object created for that type - something like...
                            // graphQLType = new GraphQLList(allCustomDataTypes[customDataType.name]);
                            jsonSchemaType = `array:${customSchema.jsonSchema.properties[property].items['$ref']}`;
                        }
                        else {
                            throw new Error(`Invalid array type found in jsonSchema for property ${property}.  'items' object must contain either 'type' or '$ref'`);
                        }

                        break;
                    case '$ref':
                        // example jsonSchema for one-to-one ref
                        // "author" : {
                        //     "$ref" : "https://thanos.kazuku.com/api/jsonschemas/authors.schema.json"
                        // }
                        jsonSchemaType = `$ref:${customSchema.jsonSchema.properties[property]['$ref']}`;
                        break;
                    default:
                        throw new Error(`Unrecognized graphQLType fell into needsFurtherProcessing - ${graphQLType}`);
                        break;
                }
            }

            contentTypeFields[propertyName] = {
                type: jsonSchemaType
            };

        }

        // what an actual object looks like with relationships...
        // const categoryType = new GraphQLObjectType({
        //     name: 'CategoryType',
        //     fields: () => ({
        //         name: { type: GraphQLString },
        //         children: { type: new GraphQLList(categoryType) }
        //     })
        // });
        // const customDataTypeData = {
        //     name: graphQLFriendlyTypeName,
        //     fields: customDataTypeFields
        // };
        //
        // // we will need all the customDataTypes easily accessible by name after we are done creating them all
        // allCustomDataTypes[customDataType.name] = customDataTypeData;

        return contentTypeFields;
    }

    getJsonSchemaTypeForSchemaProperty(propertyType) {
        let jsonSchemaType = 'string';

        if (!propertyType.startsWith('https://')) {
            switch(propertyType) {
                case 'array':
                    jsonSchemaType = 'array';
                    break;
                default:
                    jsonSchemaType = propertyType;
                    break;
            }
        }
        else {
            jsonSchemaType = '$ref';
        }

        return jsonSchemaType;
    }

    getGraphQLTypeForScalarProperty(propertyType) {
        let graphQLType = GraphQLString;

        switch(propertyType) {
            case 'graphQLID':
                graphQLType = GraphQLID;
                break;
            case 'string':
                graphQLType = GraphQLString;
                break;
            case 'number':
                graphQLType = GraphQLInt;
                break;
            case 'date':
                graphQLType = GraphQLDateTime;
                break;
            default:
                graphQLType = GraphQLString;
                break;
        }
        // todo: types to be implemented: GraphQLFloat, ???

        return graphQLType;
    }

    mapJsonSchemaProperties(customSchema) {
        if (customSchema.jsonSchema) {
            this.recursivelyFindPropertyName(customSchema.jsonSchema, jsonSchemaMappingKeys, (source, property) => {
                const translatedKey = this.translateJsonSchemaKey(property);
                // replace the property with a new property using the translatedKey name, then delete the old property
                source[translatedKey] = source[property];
                delete source[property];
            }, 4);


            // for (const property in customSchema.jsonSchema) {
            //     if (jsonSchemaMappingKeys.includes(property)) {
            //         const translatedKey = this.translateJsonSchemaKey(property);
            //         customSchema.jsonSchema[translatedKey] = customSchema.jsonSchema[property];
            //         delete customSchema.jsonSchema[property];
            //     }
            // }
            //
            // if (customSchema.jsonSchema.properties) {
            //     for (const propertyName in customSchema.jsonSchema.properties) {
            //         if (jsonSchemaMappingKeys.includes(propertyName)) {
            //             const translatedKey = this.translateJsonSchemaKey(propertyName);
            //             customSchema.jsonSchema.properties[translatedKey] = customSchema.jsonSchema.properties[propertyName];
            //             delete customSchema.jsonSchema.properties[propertyName];
            //         }
            //     }
            // }
        }

        return customSchema;
    }

    recursivelyFindPropertyName(source, namesToLookFor, someAction, maxLevels, currentLevel = 0) {
        currentLevel += 1;

        if (currentLevel > maxLevels) {
            // only search down to maxLevels deep
            return;
        }

        if (source !== null && typeof source === 'object') {
            for (const property in source) {
                if (namesToLookFor.includes(property)) {
                    // we found a property whose name is in our list - do the thing
                    someAction(source, property);
                }
            }

            // start checking for child objects, and search their properties
            for (const property in source) {
                if (source[property] !== null && typeof source[property] === 'object') {
                    this.recursivelyFindPropertyName(source[property], namesToLookFor, someAction, maxLevels, currentLevel)
                }
            }
        }
    }

    translateJsonSchemaKey(jsonSchemaKey) {
        let translatedKey = '';

        switch(jsonSchemaKey) {
            case 'jsonSchemaSchema':
                translatedKey = '$schema';
                break;
            case 'jsonSchemaId':
                translatedKey = '$id';
                break;
            case 'jsonSchemaRef':
                translatedKey = '$ref';
                break;
        }
        return translatedKey;
    }

    getInputTypeFieldsFromContentTypeFields(contentTypeFields) {
        let inputTypeFields = _.cloneDeep(contentTypeFields);
        const idFieldNames = ['_id', 'id'];

        for (const property in inputTypeFields) {
            if (inputTypeFields.hasOwnProperty(property)) {
                // I've decided I want the id filed in the input type
                // if (idFieldNames.includes(property)) {
                //     // remove id field
                //     delete inputTypeFields[property];
                // }
                //else
                if (this.isReferenceField(inputTypeFields[property])) {
                    // remove all reference fields
                    delete inputTypeFields[property];
                }
                else {
                    // convert from jsonSchemaTypes to graphQLTypes
                    const jsonSchemaType = inputTypeFields[property].type;
                    let graphQLScalarType = GraphQLString;

                    if (jsonSchemaType.startsWith('array:')) {
                        const arrayType = jsonSchemaType.replace('array:', '');
                        const graphQLTypeObject = this.getGraphQLTypeForScalarProperty(arrayType);
                        graphQLScalarType = GraphQLList(graphQLTypeObject);
                    }
                    else {
                        graphQLScalarType = this.getGraphQLTypeForScalarProperty(jsonSchemaType);
                    }
                    inputTypeFields[property].type = graphQLScalarType;
                }
            }
        }

        return inputTypeFields;
    }

    isReferenceField(field) {
        let result = false;

        if (field.type) {
            if (field.type.startsWith('$ref:')) {
                result = true;
            }
            else if (field.type.startsWith('array:')) {
                const arrayType = field.type.replace('array:', '');
                if (arrayType.startsWith('https://') || arrayType.startsWith('$ref:')) {
                    result = true;
                }
            }
        }

        return result;
    }

    // Calling this getOrgIdByRepoCode because we intend to use Repos at some point.
    //  Currently there is only one repo per org, so we are just using orgCode.
    async getOrgIdByRepoCode(orgCode) {
        const org = await this.orgService.findOne({code: orgCode});
        return org.id;
    }
}

module.exports = SchemaService;