'use strict';
import path from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
// Setup passport auth strategies
import passportConfig from './server/passport/index.js';
const passportAuthStrategies = passportConfig(passport); // pass passport for configuration
import config from './server/config/index.js';
import logger from './server/logger/index.js';
import routes from './server/routes/index.js';
import yaml from 'js-yaml';
import fs from 'fs-extra';
import swaggerUi from 'swagger-ui-express';
import jsonRefs from 'json-refs';
import CustomApolloServer from './server/graphQL/customApolloServer.js';
import apolloServerExpress from 'apollo-server-express';
const {makeExecutableSchema} = apolloServerExpress;
import morgan from 'morgan';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
global.appRoot = path.resolve(__dirname);

const playgroundApolloServer = createApolloServer();

console.log('app.js - beginning'); // todo: deleteme
// this app handles the api server - the api that powers the admin site for Kazuku
const app = express();
app.set('port', config.port || 3001);

app.use(setupAuthZone);
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: config.corsAllowedOrigin
}));
app.use(passport.initialize());
// sets up the graphQl playground page in the admin site - which will call the graphQl api for the selected org
// todo: the graphQl api (the contentApi) is not currently handled - I haven't setup the contentApi yet since I split
//  out all the apis - it will be a separate api
playgroundApolloServer.applyGraphQlPlaygroundMiddleware({
    app: app,
    path: '/graphql', //`http://thanosblog.kazuku.com:3001/graphql`,
});

if (config.env !== 'test') {
    // Only use morgan if we aren't running tests.  It clutters up the test output.
    app.use(morgan('combined', {
        stream: {
            write: (message) => {
                // Write to logs
                logger.log('info', message);
            }
        }
    }));
}

// todo: super temporary!!! -- BEGIN
app.get('/', (req, res) => {
    res.send('Hi there!');
});
app.get('/api/products', async (req, res) => {
    const products = [
        {
            name: "Widget",
            description: "It's a Widget.",
            price: 19.95,
            quantity: 100,
            createdDate: "2022-12-19T10:04:58-06:00"
        },
        {
            name: "Doohicky",
            description: "The best, like, ever.",
            price: 29.95,
            quantity: 20,
            createdDate: "2022-07-05T10:04:58-06:00"
        },
        {
            name: "Thingamajig",
            description: "No one know what this is.",
            price: 99.99,
            quantity: 43,
            createdDate: "2022-03-01T10:04:58-06:00"
        }

    ];

    res.send(products);
});
// todo: super temporary!!! -- END

// setup our swagger page
const openApiSpecPath = path.join(__dirname, '..', 'docs', 'open-api.yml');
const openApiSpecFile  = fs.readFileSync(openApiSpecPath, 'utf8');
const swaggerDocument = yaml.load(openApiSpecFile);

const resolvedSwaggerDocument = await jsonRefs.resolveRefs(swaggerDocument, {
    location: openApiSpecPath,
    loaderOptions: {
        processContent: function (res, callback) {
            callback(yaml.load(res.text)); // this callback is required to resolve those JSON references
        }
    }
});

app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(resolvedSwaggerDocument.resolved));
// const openApiSpecPath = path.join(__dirname, '..', 'docs', 'open-api.yml')
// const openApiSpecFile  = fs.readFileSync(openApiSpecPath, 'utf8')
// const swaggerDocument = yaml.load(openApiSpecFile)
// app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

console.log('app.js - about to call routes()'); // todo: deleteme
// Map the routes - this creates the controllers, and routes are mapped in each controller via the mapRoutes function called in each constructor
routes(app);

// custom 404 handler.  This will prevent html being returned for 404s.
app.use((req, res, next) => {
    res.status(404).json({error: "Not Found"});
});

// custom error handler.  This will prevent html being returned for errors.
app.use((err, req, res, next) => {
    if (req.app.get('env') !== 'development') {
        delete err.stack;
    }

    if (typeof err === 'string' || err instanceof String) {
        err = { error: err };
    }
    else {
        let newErr = {};
        newErr.message = err.message || '';
        newErr.stack = err.stack || '';
        err = newErr;
    }

    res.status(err.statusCode || 500).json(err);
});

function setupAuthZone(req, res, next) {
    return Zone.current.fork({
        name: 'api'
    })
    .run(() => {
        Zone.current.id = Math.random();
        next();
    });
}

// create a simple Apollo server
function createApolloServer() {
    const typeDefs = `
      type Query {
        "A simple type for getting started!"
        hello: String
      }
    `;

    const resolvers = {
        Query: {
            hello: () => 'world'
        }
    };

    // adding a default graphql schema initially
    const server = new CustomApolloServer({typeDefs, resolvers});

    return server;
}

// **** Exporting app ********
export default app;
// module.exports = app;
// ***************************
