import request from 'supertest';
import { app } from '#root/app';
import testUtils from '#test/test.utils';

describe('auth.controller', () => {
  beforeAll(async () => {
    await testUtils.setupTestUsers();
  });

  afterAll(async () => {
    await testUtils.deleteAllTestUsers()
  });

  // consider clearing out auth data before each test
  // beforeEach(async () => {
  //   await testUtils.deleteAllTestUsers();
  // });

  describe('POST /auth/register', () => {
    it('should return a 201 on successful register', async () => {
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

    it('should return a 400 with an invalid email', async () => {
      const newUser = {
        orgId: testUtils.testOrgId,
        email: "test",
        password: "test"
      };
      return request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(400);
    });

    it('should return a 400 with an invalid password', async () => {
      const newUser = {
        orgId: testUtils.testOrgId,
        email: "test@test.com",
        password: "t"
      };
      return request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(400);
    });

    it('should return a 400 with missing email or password', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: "test@test.com" }) // missing password
        .expect(400);

      await request(app)
        .post('/api/auth/register')
        .send({ password: "test" }) // missing email
        .expect(400);
    });

    it('should return a 400 if user with duplicate email already exists', async () => {
      // const usersResponse = await request(app)
      //   .get('/api/users');
      // console.log(`users: ${JSON.stringify(usersResponse.body)}`);
      const newUser = {
        orgId: testUtils.testOrgId,
        email: testUtils.newUser1.email, // newUser1 gets created in beforeAll, so we should not be able to use the same email again
        password: "test"
      };
      return request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(400);
    });
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
// it("should return an auth token if correct credentials are given", () => {
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
// it("should return unauthenticated for an authenticated route without a valid token", () => {
//   return request
//     .get('/api/auth/random-number')
//     .expect(401)
//     .then(result => {
//       result.error.text.should.equal('Unauthenticated');
//     });
// });

// it ("should allow access to authenticated route with valid token", () => {
//
// }
