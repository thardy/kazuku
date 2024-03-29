/* Have to import these extra libraries */
import graphqlPlayground from '@apollographql/graphql-playground-html';
const {renderPlaygroundPage} = graphqlPlayground;
import bodyparser from 'body-parser';
import apolloServerExpress from 'apollo-server-express';
const {ApolloServer, defaultPlaygroundOptions, makeExecutableSchema} = apolloServerExpress;
//const schema = require('./schema/schema');
import accepts from 'accepts';
import SchemaService from './schemaService.js';
import {database} from '../../database/database.js';
import authHelper from '../../common/authHelper.js';
import OrganizationService from '../../organizations/organizationService.js';
import config from '../config/index.js';

/* Don't think it's exported normally, get directly */
import expressApollo from 'apollo-server-express/dist/expressApollo.js';
const {graphqlExpress, GraphQLOptions} = expressApollo;

class CustomApolloServer extends ApolloServer {
    constructor(options) {
        super(options);

        this.schemaService = new SchemaService(database);
        this.orgService = new OrganizationService(database);

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
        app.use(path, bodyparser.json(), authHelper.isAuthenticated, async (req, res, next) => {
            if (req.method === 'GET') {
                // perform more expensive content-type check only if necessary
                // XXX We could potentially move this logic into the GuiOptions lambda,
                // but I don't think it needs any overriding
                // todo: consider getting rid of this because I don't see what value it provides - prefersHTML?
                const accept = accepts(req);
                const types = accept.types();
                const prefersHTML =
                    types.find(x => x === 'text/html' || x === 'application/json') ===
                    'text/html';

                if (prefersHTML) {
                    const authToken = await this.getAuthTokenByRepoCode(req.user.orgId); // until we implement repos, we use orgId
                    const headers = JSON.stringify({
                        'Authorization': authToken ? `Bearer ${authToken}` : null
                    });

                    const org = await this.orgService.getById(req.user.orgId);
                    const host = `${config.hostname}:${config.port}`;
                    const endpoint = `http://${org.code}.${host}/graphql-api?headers=${encodeURIComponent(headers)}`; // (e.g. http://thanos.kazuku.com:3001/graphql-api)
                    const playgroundRenderPageOptions = {
                        ...defaultPlaygroundOptions,
                        // todo: change to be orgCode.host
                        // endpoint: `http://thanosblog.kazuku.com:3001/graphql-api`,
                        endpoint: endpoint,
                        subscriptionEndpoint: this.subscriptionsPath,
                        //...this.playgroundOptions,
                        settings: {
                            ...defaultPlaygroundOptions.settings,
                            'editor.theme': 'dark',
                            'editor.cursorShape': 'line',
                            'request.credentials': 'same-origin',
                            //'request.credentials': 'include',
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

    // derived from https://github.com/apollographql/apollo-server/issues/2560
    applyMiddleware({ app, path, db }) {
        app.use(path, async (req, res, next) => {
            // if (ENABLE_PLAYGROUND) {
            //     // copy playground code from apollo applyMiddleware source
            // }

            /* Not necessary, but cloning 'this' without 'schema' property to ensure schema built on the request */
            //  this technique will create two new objects, schema and serverObj (using rest operator).  serverObj will be a clone of this, minus the schema property
            const { schema, ...serverObj } = this;

            const customSchema = await this.getCustomSchema(req);
            const customContext = {
                ...this.context,
                db: db,
                request: req
            };

            const customThis = {
                ...serverObj,
                graphqlPath: path,
                /* Retrieves a custom graphql schema based on request */
                schema: customSchema,
                context: customContext,
                playground: false,
            };

            // todo: ok, here's what I have so far...
            //  createGraphQLServerOptions inevitably ends up using a this.schemaDerivedData, which is not at all influenced by this.schema
            //  (which we went through a whole lot of trouble to override).
            //  Either figure out a way to dynamically influence/change this.schemaDerivedData or use GraphQLOptions here instead of
            //  createGraphQLServerOptions
            const graphQLOptions = {
                schema: customSchema,
                context: customContext,
            };
            //const options = super.createGraphQLServerOptions.bind(customThis);
            return graphqlExpress(graphQLOptions)(req, res, next);



            // this.context is the current server / request context, you can keep or override below
            // const contextObj = { ...this.context, request: req } // ...other context etc
            //
            // const gqlOptions = {
            //     ...this,
            //     graphqlPath: path,
            //     schema: await makeExecutableSchema(customSchema),
            //     context: contextObj,
            // }
            // return graphqlExpress(super.createGraphQLServerOptions.bind(gqlOptions))(
            //     req,
            //     res,
            //     next
            // )
        })
    }

    applyGraphQlApiMiddleware({ app, path, db }) {
        app.use(path, bodyparser.json(), authHelper.isAuthenticatedForApi);
        this.applyMiddleware({app, path, db});

        /* Adds project specific middleware inside, just to keep in one place */
        //app.use(path, json(), authHelper.isAuthenticated, async (req, res, next) => {
        // app.use(path, bodyparser.json(), authHelper.isAuthenticatedForApi, async (req, res, next) => {
        //     /* Not necessary, but cloning 'this' without 'schema' property to ensure schema built on the request */
        //     //  this technique will create two new objects, schema and serverObj (using rest operator).  serverObj will be a clone of this, minus the schema property
        //     const { schema, ...serverObj } = this;
        //
        //     // todo: look into putting the orgId, and maybe even the entire org onto the req object or using Current (zone) to store the org once we get it once.
        //     //  We're spending a lot of cycles asking for the current org a lot, and we need to just get it once.
        //     const customSchema = await this.getCustomSchema(req);
        //
        //     /**
        //      * This is the main reason to extend, to access graphqlExpress(),
        //      * to be able to modify the schema based on the request
        //      * It binds to our new object, since the parent accesses the schema
        //      * from this.schema etc.
        //      */
        //     const customThis = {
        //         ...serverObj,
        //         graphqlPath: path,
        //         /* Retrieves a custom graphql schema based on request */
        //         schema: customSchema, //makeExecutableSchema(this.getCustomSchema(req))
        //         context: {
        //             db: db,
        //             request: req
        //         },
        //         playground: false,
        //     };
        //     const options = super.createGraphQLServerOptions.bind(customThis);
        //     return graphqlExpress(options)(req, res, next);
        // });
    }

    async getCustomSchema(req) {
        const orgCode = req.vhost[0];

        // todo: create tests and make this work!!!
        return await this.schemaService.getSchemaByRepoCode(orgCode);
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

    async getAuthTokenByRepoCode(orgId) {
        const authToken = await this.orgService.getAuthTokenByRepoCode(orgId);
        return authToken;
    }

}

export default CustomApolloServer;