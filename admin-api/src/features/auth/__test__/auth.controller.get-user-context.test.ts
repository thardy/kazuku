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

  describe('GET /auth/get-user-context', () => {
    const apiEndpoint = '/api/auth/get-user-context';

    it('should return a 200, and a valid client userContext when a valid authToken is supplied', async () => {
      const authorizationHeaderValue = await testUtils.loginWithTestUser();
      console.log(`authorizationHeaderValue: ${authorizationHeaderValue}`);
      const response = await request(app)
        .get(apiEndpoint)
        .set('Authorization', authorizationHeaderValue)
        .expect(200);

      expect(response.body?.user?.email).toEqual(testUtils.testUserEmail);
      expect(response.body?.org?.id).toEqual(testUtils.testOrgId);
    });

    it('should return a 401 when no authToken is supplied', async () => {
      const response = await request(app)
        .get(apiEndpoint)
        .expect(401);
    });

    // test an expired authToken

  });
});
