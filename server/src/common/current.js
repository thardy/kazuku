/* A helper module for retrieving data on the current request context */
'use strict';
require('zone.js/dist/zone-node.js');

const isInTest = typeof global.it === 'function';

let current = {
    get user() {
        // todo: if we can find a better way to make this code not have to be aware of whether it is being run in a test.  I'm all for it.
        // It would be nice to be able to configure what is returned for any given test.
        if (isInTest) {
            // we are in a testing scenario. return a test user
            return {
                id: 1,
                orgId: 1,
                email: 'imatest@test.com',
            };
        }
        else {
            return Zone.current && Zone.current.currentUser ? Zone.current.currentUser : null;
        }
    }
};

module.exports = current;

