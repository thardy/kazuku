import {GraphQLList} from "graphql";

const {GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLInt, GraphQLNonNull} = require('graphql');
const {simpleQuery, simpleCreateMutation, simpleUpdateMutation, simpleDeleteMutation} = require('./graphql.helper');
const {GraphQLDateTime} = require('graphql-iso-date');
const {makeExecutableSchema} = require('apollo-server-express');
const CustomDataService = require('../../customData/customDataService');
const CustomSchemaService = require('../../customSchemas/customSchemaService');
const _ = require("lodash");

const typesThatNeedFurtherProcessing = ['$ref', 'array'];

class SchemaService {

    constructor(database) {
        this.customDataService = new CustomDataService(database);
        this.customSchemaService = new CustomSchemaService(database);

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

    getSchemaBySiteCode(siteCode) {
        let schema = {};
        // todo: get orgId from auth (current stuff) just as soon as I lock down apis.  I don't think we will have different schemas per site, just by org.
        const orgId = '5ab7fe90da90fa0fa857a557';

        // todo: try to pull from cache

        // todo: if not found in cache, retrieve schema from database
        let orgCustomSchemas = [];
        return this.customSchemaService.getAll(orgId)
            .then((allCustomSchemas) => {
                orgCustomSchemas = allCustomSchemas.map((orgCustomSchema) => {
                    return this.mapJsonSchemaProperties(orgCustomSchema);
                });

                const allCustomDataTypeFields = {};
                const jsonSchemaIdToNameMappings = {};
                const contentTypeActions = [];

                for (const customSchema of orgCustomSchemas) {
                    const graphQLFriendlyTypeName = _.camelCase(customSchema.name.trim()); //.replace(/ /g, '');
                    const customDataTypeFields = this.getCustomDataTypeFieldsForCustomSchema(customSchema);
                    allCustomDataTypeFields[graphQLFriendlyTypeName] = customDataTypeFields;
                }

                // todo: make the second pass here, once we've got customDataTypeFields for every customSchema for this org
                // todo: keep looping until we didn't have to change anything <- is this necessary???
                // loop through allCustomDataTypes
                for (const customDataTypeName in allCustomDataTypeFields) {
                    const customDataTypeFields = allCustomDataTypeFields[customDataTypeName];
                    for (const customDataTypeName in customDataTypeFields) {
                        //  whenever we see a customDataTypeFields[propertyName].type that starts with either 'array:' or '$ref:',
                        const graphQLType = customDataTypeFields[customDataTypeName].type;

                        if (graphQLType.startsWith('array:')) {

                        }
                        else if (graphQLType.startsWith('$ref:')) {

                        }

                        //  replace with...
                        //  let predefinedTypeName = jsonSchemaIdToNameMappings[customDataTypeFields[propertyName].type]
                        //  customDataTypeFields[propertyName].type = allCustomDataTypes[predefinedTypeName] or new GraphQLList(...) for arrays
                        //graphQLType = new GraphQLList(allCustomDataTypes[customDataType.name])
                    }




                }




                const rootQueryFields = contentTypeActions.reduce((actions, action) => {
                    actions[action.id] = action.query;
                    return actions;
                }, {});

                const rootQuery = new GraphQLObjectType({
                    name: 'root_query',
                    fields: () => rootQueryFields
                });

                const rootMutation = new GraphQLObjectType({
                    name: 'root_mutation',
                    fields: contentTypeActions.reduce((acc, action) => {
                        for (let key in action.mutation) {
                            acc[key+'_'+action.id] = action.mutation[key];
                        }
                        return acc;
                    }, {})
                });

                schema = new GraphQLSchema({
                    query: rootQuery,
                    mutation: rootMutation,
                    subscription: undefined, // TODO: Find a solution for Subscriptions
                });

                return Promise.resolve(schema);
            });
    }

    getGraphQLActionForCustomSchema(graphQLFriendlyTypeName, customDataTypeFields) {
        const customDataType = new GraphQLObjectType({
            name: graphQLFriendlyTypeName,
            fields: () => (customDataTypeFields)
        });

        const contentTypeAction = {
            id: graphQLFriendlyTypeName,
            query: simpleQuery(customSchema.contentType, customDataType),
            mutation: {
                create: simpleCreateMutation(customSchema.contentType, customDataType),
                update: simpleUpdateMutation(customSchema.contentType, customDataType),
                delete: simpleDeleteMutation(customSchema.contentType, customDataType),
            }
        };

        return contentTypeAction;
    }

    getCustomDataTypeFieldsForCustomSchema(customSchema, jsonSchemaIdToNameMappings) {
        const graphQLFriendlyTypeName = _.camelCase(customSchema.name.trim()); //.replace(/ /g, '');

        if (customSchema['$id']) {
            // map the jsonSchemaId to the friendly name - we will map any customSchema that comes through with an '$id' specified
            // (e.g.  jsonSchemaIdToNameMappings['https://thanos.kazuku.com/api/jsonschemas/tags.schema.json'] = 'tags')
            jsonSchemaIdToNameMappings[customSchema['$id']] = graphQLFriendlyTypeName;
        }

        const customDataTypeFields = {
            _id: {
                type: GraphQLID
            },
            orgId: {
                type: GraphQLString
            },
            contentType: {
                type: GraphQLString
            },
            created: {
                type: GraphQLDateTime
            },
            createdBy: {
                type: GraphQLString
            },
            updated: {
                type: GraphQLDateTime
            },
            updatedBy: {
                type: GraphQLString
            }
        };

        for (const property in customSchema.jsonSchema.properties) {
            const propertyName = _.camelCase(property);
            const jsonSchemaType = customSchema.jsonSchema.properties[property].type || customSchema.jsonSchema.properties[property]['$ref'];
            let graphQLType = this.getGraphQLTypeForSchemaProperty(jsonSchemaType);

            const needsFurtherProcessing = typesThatNeedFurtherProcessing.includes(graphQLType);

            if (needsFurtherProcessing) {
                switch(graphQLType) {
                    case 'array':
                        // example jason Schema for scalar array
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
                            graphQLType = new GraphQLList(customSchema.jsonSchema.properties[property].items.type);
                        }
                        else if (customSchema.jsonSchema.properties[property].items['$ref']) {
                            // this will just be a placeholder.  We have to make a second pass after all other types are done to replace with
                            // the actual customDataType object created for that type - something like...
                            // graphQLType = new GraphQLList(allCustomDataTypes[customDataType.name]);
                            graphQLType = `array:${customSchema.jsonSchema.properties[property].items['$ref']}`;
                        }
                        else {
                            throw new Error(`Invalid array type found in jsonSchema for property ${property}.  'items' object must contain either 'type' or '$ref'`);
                        }

                        break;
                    case '$ref':
                        graphQLType = `ref:${customSchema.jsonSchema.properties[property].items['$ref']}`;
                        break;
                    default:
                        throw new Error(`Unrecognized graphQLType fell into needsFurtherProcessing - ${graphQLType}`);
                        break;
                }
            }

            customDataTypeFields[propertyName] = {
                type: graphQLType
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

        return customDataTypeFields;
    }

    getGraphQLTypeForSchemaProperty(propertyType) {
        let graphQLType = GraphQLString;

        if (!propertyType.startsWith('https://')) {
            switch(propertyType) {
                case 'string':
                    graphQLType = GraphQLString;
                    break;
                case 'number':
                    graphQLType = GraphQLInt;
                    break;
                case 'string':
                    graphQLType = GraphQLDateTime;
                    break;
                case 'array':
                    graphQLType = 'array';
                    break;
                default:
                    graphQLType = GraphQLString;
                    break;
            }
            // todo: types to be implemented: GraphQLID, GraphQLFloat
        }
        else {
            graphQLType = '$ref';
        }

        return graphQLType;
    }

    mapJsonSchemaProperties(orgCustomSchema) {
        if (customSchema.jsonSchema) {
            for (const property in customSchema.jsonSchema) {
                if (jsonSchemaMappingKeys.includes(property)) {
                    const translatedKey = this.translateJsonSchemaKey(property);
                    customSchema.jsonSchema[translatedKey] = customSchema.jsonSchema[property];
                    delete customSchema.jsonSchema[property];
                }
            }

            if (customSchema.jsonSchema.properties) {
                for (const propertyName in customSchema.jsonSchema.properties) {
                    if (jsonSchemaMappingKeys.includes(propertyName)) {
                        const translatedKey = this.translateJsonSchemaKey(propertyName);
                        customSchema.jsonSchema.properties[translatedKey] = customSchema.jsonSchema.properties[propertyName];
                        delete customSchema.jsonSchema.properties[propertyName];
                    }
                }
            }
        }

        return schema;
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
}

module.exports = SchemaService;