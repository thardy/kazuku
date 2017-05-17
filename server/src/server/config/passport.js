'use strict';
const LocalStrategy = require('passport-local');
const database = require("../database/database").database;
const UserService = require('../users/user.service');

module.exports = function(passport) {
    let userService = new UserService(database);
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            userService.getByEmail(email)
                .then((user) => {
                    if (user === null) {
                        //let err = new APIError(`Email '${email}' not found`, httpStatus.UNAUTHORIZED, true);
                        return done(null, false, { message: `Email '${email}' not found` });
                    }

                    if (email === user.email && password === user.password) {
                        // todo: save new lastLoggedIn date
                        return done(null, {
                            id: user.id,
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            lastLoggedIn: user.lastLoggedIn
                        });
                    }
                    else {
                        return done(null, false, { message: `Invalid email or password` });
                    }
                })
                .catch(err => {
                    err.message = `ERROR: ${this.resourceName}Controller -> login with email = ${email}.  Message: ${err.message}`;
                    return done(err);
                });
        }
    ));
};


