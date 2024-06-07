import request from 'supertest';
import { app } from '#root/app';
import testUtils from '#test/test.utils';

describe('auth.controller', () => {
  it('/auth/register should return a 201 on successful register', async () => {
    const newUser = {
      orgId: testUtils.testOrgId,
      email: "test@test.com",
      password: "test"
    };
    return request(app)
      .post('/api/auth/register')
      .send(newUser)
      .expect(201);
  });
});

// it("should create a new user", () => {
//   var newUser = {
//     orgId: testHelper.testOrgId,
//     email: "test@test.com",
//     password: "test"
//   };
//   return request
//     .post('/api/auth')
//     .set('Cookie', [authCookie])
//     .set('Authorization', authorizationHeaderValue)
//     .send(newUser)
//     .expect(201)
//     .then(result => {
//       result.body.should.have.property('_id');
//       result.body.should.have.property('id');
//       result.body.should.have.property("orgId").deep.equal(newUser.orgId);
//       result.body.should.have.property("email").deep.equal(newUser.email);
//     });
// });
//
// it("should not create a new user if user with same email already exists", () => {
//   return request
//     .post('/api/auth')
//     .set('Cookie', [authCookie])
//     .set('Authorization', authorizationHeaderValue)
//     .send(testHelper.newUser1)
//     .expect(409)
//     .then(result => {
//       result.body.should.have.property('errors').deep.equal(['Duplicate Key Error']);
//     });
// });
//
// it("should log the user in if correct credentials are given", () => {
//   var user = {
//     orgId: testHelper.testOrgId,
//     email: "one@test.com",
//     password: "one"
//   };
//   return request
//     .post('/api/auth/login')
//     .set('Cookie', [authCookie])
//     .set('Authorization', authorizationHeaderValue)
//     .send(user)
//     .expect(200)
//     .then(result => {
//       result.body.userContext.user.should.have.property('id');
//       result.body.userContext.user.should.have.property("email").deep.equal(user.email);
//     });
// });
//
// it("should return unauthenticated if there is no logged in user", () => {
//   return request
//     .get('/api/auth/random-number')
//     .expect(401)
//     .then(result => {
//       result.error.text.should.equal('Unauthenticated');
//     });
// });
