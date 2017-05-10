const localOauth = require('../index');

const options = {
  authCode: {
    endpoint: 'https://api.freeagent.com/v2/approve_app',
    redirectUrl: 'http://localhost:8080',
  },
  accessToken: {
    endpoint: 'https://api.freeagent.com/v2/token_endpoint',
    clientAuth: 'basic',
  },
  client: {
    id: process.env.FREEAGENT_CLIENT_ID,
    secret: process.env.FREEAGENT_CLIENT_SECRET,
  },
}

localOauth(options, {}, (error, credentials) => {
  console.log(credentials);
});
