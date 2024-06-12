import {Express} from 'express';
import request from 'supertest';
import testUtils from './test.utils';

let app: Express;

function initialize(theApp: Express) {
  app = theApp;
}

async function loginWithTestUser() {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: testUtils.testUserEmail,
      password: testUtils.testUserPassword,
    });

  const authorizationHeaderValue = `Bearer ${response.body?.tokens?.accessToken}`;
  return authorizationHeaderValue;
}

const testApiUtils = {
  initialize,
  loginWithTestUser,
}

export default testApiUtils;
