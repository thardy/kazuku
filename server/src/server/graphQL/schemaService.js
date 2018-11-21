const {GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLInt, GraphQLNonNull} = require('graphql');
const {simpleQuery, simpleCreateMutation, simpleUpdateMutation, simpleDeleteMutation} = require('./graphql.helper');
const {GraphQLDateTime} = require('graphql-iso-date');
const {makeExecutableSchema} = require('apollo-server-express');
const CustomDataService = require('../../customData/customDataService');

class SchemaService {
    constructor(database) {
        this.customDataService = new CustomDataService(database);

        this.thanosTypedefs = `
            scalar GraphQLDateTime
            
            type BlogPost {
                _id: GraphQLID
                orgId: GraphQLString
                contentType: GraphQLString
                name: GraphQLString
                shortDescription: GraphQLString
                body: GraphQLString
                created: GraphQLDateTime
                createdBy: GraphQLString                    
                updated: GraphQLDateTime
                updatedBy: GraphQLString
            }
            
            type NavItem {
                _id: GraphQLID
                orgId: GraphQLString
                contentType: GraphQLString
                name: GraphQLString
                url: GraphQLString
                sortOrder: GraphQLInt
                created: GraphQLDateTime
                createdBy: GraphQLString                    
                updated: GraphQLDateTime
                updatedBy: GraphQLString
            }
            
            type Query {
                blogPosts: [BlogPost]
                blogPost(id: GraphQLID!): BlogPost
            }
        `;
        // todo: add mutations (blogPosts_create, blogPosts_update, blogPosts_delete)

        // todo: Pull graphql.helper.js into kazuku.  Drive that process from a hardcoded json schema.
        //  Start by creating type from jsonSchema.

        this.thanosResolvers = {
            Query: {
                blogPosts: () => this.customDataService.getByContentType('5ab7fe90da90fa0fa857a557', 'blog-posts'),
                blogPost: (id) => this.customDataService.getByTypeAndId('5ab7fe90da90fa0fa857a557', 'blog-posts', id),
            },
        };

        this.adminTypedefs = `
            scalar GraphQLDateTime
            
            type Product {
                _id: GraphQLID
                orgId: GraphQLString
                contentType: GraphQLString
                name: GraphQLString
                favoriteColor: GraphQLString
                fathersMaidenName: GraphQLString
                created: GraphQLDateTime
                createdBy: GraphQLString                    
                updated: GraphQLDateTime
                updatedBy: GraphQLString
            }
            
            type Query {
                products: [Product]
                product(id: GraphQLID!): Product
            }    
        `;

        this.adminResolvers = {
            Query: {
                products: () => this.customDataService.getByContentType('59781da087c7f925f49f90bf', 'products'),
                product: (id) => this.customDataService.getByTypeAndId('59781da087c7f925f49f90bf', 'products', id),
            },
        };

        this.thanosSchema = {
            typeDefs: this.thanosTypedefs,
            resolvers: this.thanosResolvers,
        };

        this.adminSchema = {
            typeDefs: this.adminTypedefs,
            resolvers: this.adminResolvers,
        };

    }

    getSchemaBySiteCode(siteCode) {
        const schema = this.retrieveSchemaDefinition(siteCode);
        return schema;
        // const executableSchema = makeExecutableSchema(schema);
        // return executableSchema;
    }

    retrieveSchemaDefinition(siteCode) {
        let schema = {};
        // todo: try to pull from cache

        // todo: if not found in cache, retrieve schema from database

        // temp - pull from predefined, hardcoded schemas
        // _id: GraphQLID
        // orgId: GraphQLString
        // contentType: GraphQLString
        // name: GraphQLString
        // shortDescription: GraphQLString
        // body: GraphQLString
        // created: GraphQLDateTime
        // createdBy: GraphQLString
        // updated: GraphQLDateTime
        // updatedBy: GraphQLString
        const BlogPostType = new GraphQLObjectType({
            name: 'BlogPostType',
            fields: {
                _id: {
                    type: GraphQLID
                },
                orgId: {
                    type: GraphQLString
                },
                contentType: {
                    type: GraphQLString
                },
                name: {
                    type: GraphQLString
                },
                shortDescription: {
                    type: GraphQLString
                },
                body: {
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
            }
        });

        const blogPostAction = {
            id: 'blogPosts',
            query: simpleQuery('blog-posts', BlogPostType),
            mutation: {
                create: simpleCreateMutation('blog-posts', BlogPostType),
                update: simpleUpdateMutation('blog-posts', BlogPostType),
                delete: simpleDeleteMutation('blog-posts', BlogPostType),
            }
        };

        const actions = [
            blogPostAction
        ];

        const rootQueryFields = actions.reduce((acc, action) => {
            acc[action.id] = action.query;
            return acc;
        }, {});

        const rootQuery = new GraphQLObjectType({
            name: 'root_query',
            fields: rootQueryFields
        });

        const rootMutation = new GraphQLObjectType({
            name: 'root_mutation',
            fields: actions.reduce((acc, action) => {
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

        // attempt with string-based typedef
        // switch(siteCode) {
        //     case 'thanosblog':
        //         schema = this.thanosSchema;
        //         break;
        //     case 'admin':
        //         schema = this.adminSchema;
        //         break;
        // }

        return schema;
    }


}

module.exports = SchemaService;