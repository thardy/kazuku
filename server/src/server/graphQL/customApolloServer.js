/* Have to import these extra libraries */
const { renderPlaygroundPage } = require('@apollographql/graphql-playground-html');
const { json } = require('body-parser');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
//const schema = require('./schema/schema');
const accepts = require('accepts');
const SchemaService = require('./schemaService');
const database = require("../../database/database").database;
const authHelper = require('../../common/authHelper');

/* Don't think it's exported normally, get directly */
const { graphqlExpress } = require('apollo-server-express/dist/expressApollo');

class CustomApolloServer extends ApolloServer {
    constructor(options) {
        super(options);

        this.schemaService = new SchemaService(database);
        this.alphaSchema = {
            typeDefs: `
          type Query {
            "Alpha type"
            alpha: String
          }
        `,
            resolvers: {
                Query: {
                    alpha: () => ' is alpha cool'
                }
            }
        };

        this.betaSchema = {
            typeDefs: `
          type Query {
            "Beta type"
            beta: String
          }
        `,
            resolvers: {
                Query: {
                    beta: () => ' is beta cool'
                }
            }
        };
    }

    applyGraphQlPlaygroundMiddleware({ app, path }) {
        /* Adds project specific middleware inside, just to keep in one place */
        //app.use(path, json(), authHelper.isAuthenticated, async (req, res, next) => {
        app.use(path, json(), authHelper.isAuthenticated, async (req, res, next) => {
            if (req.method === 'GET') {
                // todo: maybe do the normal passport auth here, since this page will be hosted in our angular admin app
                // perform more expensive content-type check only if necessary
                // XXX We could potentially move this logic into the GuiOptions lambda,
                // but I don't think it needs any overriding
                const accept = accepts(req);
                const types = accept.types();
                const prefersHTML =
                    types.find(x => x === 'text/html' || x === 'application/json') ===
                    'text/html';

                if (prefersHTML) {
                    const playgroundRenderPageOptions = {
                        // todo: change to be orgCode.api.metaSiteCode.com (e.g. thanos.api.kazuku.com)
                        endpoint: `http://thanosblog.kazuku.com:3001/graphql-api`,
                        subscriptionEndpoint: this.subscriptionsPath,
                        //...this.playgroundOptions,
                        settings: {
                            'editor.theme': 'dark',
                            'editor.cursorShape': 'line',
                        },
                        version: '1.7.25'
                    };
                    res.setHeader('Content-Type', 'text/html');
                    const playground = renderPlaygroundPage(playgroundRenderPageOptions);
                    res.write(playground);
                    res.end();
                    return;// next();
                }

                //return next();
            }
        });
    }

    applyGraphQlApiMiddleware({ app, path, db }) {
        /* Adds project specific middleware inside, just to keep in one place */
        //app.use(path, json(), authHelper.isAuthenticated, async (req, res, next) => {
        app.use(path, json(), async (req, res, next) => {
            // todo: maybe do the api auth here, since this section is all api-driven (

            /* Not necessary, but removing to ensure schema built on the request */
            // this will create two new objects, schema and serverObj (using rest operator).  serverObj will be a clone of this, minus the schema property
            const { schema, ...serverObj } = this;

            const customSchema = await this.getCustomSchema(req);

            /**
             * This is the main reason to extend, to access graphqlExpress(),
             * to be able to modify the schema based on the request
             * It binds to our new object, since the parent accesses the schema
             * from this.schema etc.
             */
            return graphqlExpress(
                super.createGraphQLServerOptions.bind({
                    ...serverObj,
                    graphqlPath: path,
                    /* Retrieves a custom graphql schema based on request */
                    schema: customSchema, //makeExecutableSchema(this.getCustomSchema(req))
                    context: {
                        db: db,
                        request: req
                    },
                    playground: false,
                })
            )(req, res, next);
        });
    }

    getCustomSchema(req) {
        const siteCode = req.vhost[0];
        // todo: enforce auth - make sure the creds match the requested siteCode

        // todo: create tests and make this work!!!
        return this.schemaService.getSchemaBySiteCode(siteCode);
        //
        // let schema = '';
        // switch(req.query['orgId']) {
        //     case '1':
        //         schema = this.alphaSchema;
        //         break;
        //     case '2':
        //         schema = this.betaSchema;
        //         break;
        //
        // }
        // return schema;
    }

}

module.exports = CustomApolloServer;