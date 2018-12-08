const {GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLInt, GraphQLNonNull} = require('graphql');
const {simpleQuery, simpleCreateMutation, simpleUpdateMutation, simpleDeleteMutation} = require('./graphql.helper');
const {GraphQLDateTime} = require('graphql-iso-date');
const {makeExecutableSchema} = require('apollo-server-express');
const CustomDataService = require('../../customData/customDataService');
const CustomSchemaService = require('../../customSchemas/customSchemaService');
const _ = require("lodash");

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
                orgCustomSchemas = allCustomSchemas;

                const contentTypeActions = [];

                for (const customSchema of orgCustomSchemas) {
                    const contentTypeAction = this.getGraphQLActionForCustomSchema(customSchema);
                    contentTypeActions.push(contentTypeAction);
                }

                const rootQueryFields = contentTypeActions.reduce((acc, action) => {
                    acc[action.id] = action.query;
                    return acc;
                }, {});

                const rootQuery = new GraphQLObjectType({
                    name: 'root_query',
                    fields: rootQueryFields
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

    getGraphQLActionForCustomSchema(customSchema) {
        const graphQLFriendlyTypeName = _.camelCase(customSchema.name.trim()); //.replace(/ /g, '');
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
            const graphQLType = this.getGraphQLTypeForSchemaProperty(customSchema.jsonSchema.properties[property].type);

            customDataTypeFields[propertyName] = {
                type: graphQLType
            };
        }

        const customDataType = new GraphQLObjectType({
            name: graphQLFriendlyTypeName,
            fields: customDataTypeFields
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

    getGraphQLTypeForSchemaProperty(propertyType) {
        let graphQLType = GraphQLString;

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
            default:
                graphQLType = GraphQLString;
                break;
        }
        // todo: types to be implemented: GraphQLID, GraphQLFloat

        return graphQLType;
    }

}

module.exports = SchemaService;