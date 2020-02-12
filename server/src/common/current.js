/* A helper module for retrieving data on the current request context */
'use strict';
require('zone.js/dist/zone-node.js');
const testHelper = require('./testHelper');

const isInTest = typeof global.it === 'function';

let current = {
    get context() {
        // todo: if we can find a better way to make this code not have to be aware of whether it is being run in a test.  I'm all for it.
        // It would be nice to be able to configure what is returned for any given test.
        if (isInTest) {
            // we are in a testing scenario. return a test user
            return {
                user: {
                    id: testHelper.testUserId,
                    orgId: testHelper.testOrgId,
                    email: 'imatest@test.com',
                },
                orgId: testHelper.testOrgId
            };
        }
        else {
            //return { orgId: '5ab7fe90da90fa0fa857a557' }; // todo: super temporary!!!
            return Zone.current && Zone.current.context ? Zone.current.context : null;
        }
    }
};

module.exports = current;

