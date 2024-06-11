import request from 'supertest';
import { app } from '#root/app';
import testUtils from '#test/test.utils';

describe('AuthController', () => {
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
    const apiEndpoint = '/api/auth/register';

    it("should return a 201 and a newly created user on successful creation", async () => {
      const newUser = {
        orgId: testUtils.testOrgId,
        email: testUtils.newUser1Email,
        password: testUtils.newUser1Password
      };
      const response = await request(app)
        .post(apiEndpoint)
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('orgId', newUser.orgId);
      expect(response.body).toHaveProperty('email', newUser.email);
    });

    it('should return a 400 with an invalid email', async () => {
      const newUser = {
        orgId: testUtils.testOrgId,
        email: 'test',
        password: testUtils.newUser1Password
      };
      return request(app)
        .post(apiEndpoint)
        .send(newUser)
        .expect(400);
    });

    it('should return a 400 with an invalid password', async () => {
      const newUser = {
        orgId: testUtils.testOrgId,
        email: testUtils.newUser1Email,
        password: 't'
      };
      return request(app)
        .post(apiEndpoint)
        .send(newUser)
        .expect(400);
    });

    it('should return a 400 with missing email or password', async () => {
      await request(app)
        .post(apiEndpoint)
        .send({ email: "shouldfail@test.com" }) // missing password
        .expect(400);

      await request(app)
        .post(apiEndpoint)
        .send({ password: "shouldfail" }) // missing email
        .expect(400);
    });

    it('should return a 400 if user with duplicate email already exists', async () => {
      const newUser = {
        orgId: testUtils.testOrgId,
        email: testUtils.testUserEmail, // testUserEmail gets created in beforeAll, so we should not be able to use the same email again
        password: testUtils.testUserPassword
      };
      return request(app)
        .post(apiEndpoint)
        .send(newUser)
        .expect(400);
    });
  });

});

