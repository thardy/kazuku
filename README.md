# kazuku

> A cms.

## Setting Up Your Development Environment
Clone the repository.

Run npm install in the server folder and again in client folder.

Install MongoDb.

Uncomment the server/database/mongoInit.js file and execute that on your database to setup indexes.

Create a development.json file in the server/src/server/config folder. Here is a sample, minus the social media client ids and secrets...



```json
{
  "env": "dev",
  "host": "http://localhost:3001",
  "sessionSecret": "asecretkey",
  "saltWorkFactor": 10,
  "port": 3001,
  "mongoDbUrl": "mongodb://localhost:27017/kazuku",
  "jobTypes": "publishingJobs",
  "fb": {
    "clientID": "yourFacebookClientId",
    "clientSecret": "yourFacebookClientSecret",
    "callbackURL": "//localhost:3001/auth/facebook/callback",
    "profileFields": ["id", "email", "displayName", "photos"]
  },
  "google": {
    "clientID": "yourGoogleAppClientId.apps.googleusercontent.com",
    "clientSecret": "yourGoogleClientSecret",
    "callbackURL": "//localhost:3001/auth/google/callback",
    "profileFields": ["id", "email", "displayName", "photos"]
  },
  "redis": {
    "host": "127.0.0.1",
    "port": 6379,
    "password": ""
  }
}
```

## Running Locally
Run the NodeJs server by executing the following in the server folder...

```
nodemon
```

Run the Angular 4 client by executing the following in the client folder.  Changes to client code will be recompiled and copied to the appropriate location in the server folder...

```
npm run watch
```

Open up a browser and go to http://localhost:3001/#/setup for first time setup.

After initial setup, you can go to http://localhost:3001/#/dashboard.  You will be redirected to the login page, where you can use the following to login:

* username: admin
* password: <whateverYouChoseInInitalSetup>