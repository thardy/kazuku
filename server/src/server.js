'use strict';
import path from 'path';
import zone from 'zone.js/dist/zone-node.js';
import pureMongoService from './database/pureMongoService.js';
import { fileURLToPath } from 'url';


import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
// Setup passport auth strategies
import passportConfig from './server/passport/index.js';
const passportAuthStrategies = passportConfig(passport); // pass passport for configuration
import config from './server/config/index.js';
//import session from './server/session/index.js';
import logger from './server/logger/index.js';
import routes from './server/routes/index.js';
import vhost from 'vhost';
import CustomApolloServer from './server/graphQL/customApolloServer.js';
import apolloServerExpress from 'apollo-server-express';
const {makeExecutableSchema} = apolloServerExpress;
import morgan from 'morgan';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
global.appRoot = path.resolve(__dirname);

function setupAuthZone(req, res, next) {
    return Zone.current.fork({
        name: 'api'
    })
    .run(() => {
        Zone.current.id = Math.random();
        next();
    });
}

async function startServer(config) {
    // Connect to mongo before anything else happens because other services need mongo to be connected
    await pureMongoService.connectDb();
    const db = pureMongoService.db;

    const createApolloServer = () => {
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
    };

    const playgroundApolloServer = createApolloServer();

    // main server app
    const main = express();
    main.set('port', config.port || 3001);

// serve static files out of this folder - referenced as /css, /img, /js
    // todo: archChangesForDocker
//     console.log('about to load static middleware');
//     main.use(express.static(global.appRoot + '/public', {extensions:['html']}));
//     main.use(bodyParser.json());

    main.use(setupAuthZone);
    main.use(cookieParser());
    main.use(express.json());
    main.use(cors({
        origin: config.corsAllowedOrigin
    }));
    main.use(passport.initialize());
    playgroundApolloServer.applyGraphQlPlaygroundMiddleware({
        app: main,
        path: '/graphql', //`http://thanosblog.kazuku.com:3001/graphql`,
    });

    if (config.env !== 'test') {
        // Only use morgan if we aren't running tests.  It clutters up the test output.
        main.use(morgan('combined', {
            stream: {
                write: (message) => {
                    // Write to logs
                    logger.log('info', message);
                }
            }
        }));
    }

    // todo: super temporary!!!
    main.get('/', (req, res) => {
        res.send('Hi');
    });
    main.get('/api/products', async (req, res) => {
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

// Map the routes - this creates the controllers, and routes are mapped in each controller via the mapRoutes function called in each constructor
    routes(main);
    // have all other routes render index.html
    // main.get('/*', function(req, res, next) {
    //     // Just send the index.html for other files to support HTML5Mode
    //     res.sendFile('index.html', { root: global.appRoot + '/public'});
    // });

// custom 404 handler.  This will prevent html being returned for 404s.
    main.use((req, res, next) => {
        res.status(404).json({error: "Not Found"});
    });

// custom error handler.  This will prevent html being returned for errors.
    main.use((err, req, res, next) => {
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

// site app - maps subdomains to site folders
    // todo: archChangesForDocker
//     let siteApp = express();
//     siteApp.use(cors());
//
//     const apiApolloServer = createApolloServer();
//     apiApolloServer.applyGraphQlApiMiddleware({
//         app: siteApp,
//         //path: `http://thanosblog.kazuku.com:3001/graphql`, //'/graphql', //`http://kazuku.com:3001/graphql`,
//         path: '/graphql-api',
//         db: db,
//     });
//
//     siteApp.use((req, res) => {
//         const siteCode = req.vhost[0];
//         req.originalUrl = req.url;
//         let extension = '';
//         if (!req.url.endsWith('.html')) {
//             extension = '.html';
//         }
//         res.sendFile(__dirname + '/siteContent/' + siteCode + req.url + extension);
//     });

    // todo: archChangesForDocker
// Vhost app
    // let app = express();
    //
    // app.use(vhost(config.hostname, main)); // Serves top level domain via main server app
    // app.use(vhost(`*.${config.hostname}`, siteApp)); // Serves all subdomains via siteApp
    //
    //
    // // listen on port config.port
    // app.listen(config.port, () => {
    //     console.log(`kazuku server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
    // });

    // this changes server.js to simply serve the api and the playground on the configured port
    main.listen(config.port, (err) => {
        console.log(`kazuku api listening on port ${config.port} (${config.env})`);
    });
}



// the following is now handled in www/bin
// // module.parent check is required to support mocha watch
// // src: https://github.com/mochajs/mocha/issues/1912
// if (!module.parent) {
//     // listen on port config.port
//     app.listen(config.port, () => {
//         console.log(`kazuku server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
//     });
// }
//
//module.exports = app;



export default startServer;
