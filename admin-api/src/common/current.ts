// todo: I'm looking to remove this completely. I just need to figure out how to get the userContext to all the things that need it
//  (services, etc) within a request. I'm thinking I can just add it to the req on Express, then pull it off and hand it down as a parm
//  to services, etc.

/* A helper module for retrieving data on the current request context */
// import testHelper from './test-helper.js';
// @ts-ignore
// const isInTest = typeof global.it === 'function';
//
// let current = {
//     get context() {
//         // todo: if we can find a better way to make this code not have to be aware of whether it is being run in a test.  I'm all for it.
//         // It would be nice to be able to configure what is returned for any given test.
//         if (isInTest) {
//             // we are in a testing scenario. return a test user
//             return {
//                 user: {
//                     id: testHelper.testUserId,
//                     orgId: testHelper.testOrgId,
//                     email: testHelper.testUserEmail,
//                 },
//                 orgId: testHelper.testOrgId
//             };
//         }
//         else {
//             //return { orgId: '5ab7fe90da90fa0fa857a557' }; // todo: super temporary!!!
//             // @ts-ignore
//             return Zone.current && Zone.current.context ? Zone.current.context : null;
//         }
//     }
// };
//
// export default current;
