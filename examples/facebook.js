const localOauth = require('../index');

const options = {
  authCode: {
    endpoint: 'https://www.facebook.com/v2.9/dialog/oauth',
    redirectUrl: 'http://localhost:8080/',
  },
  accessToken: {
    endpoint: 'https://graph.facebook.com/v2.9/oauth/access_token',
    clientAuth: 'query',
  },
  client: {
    id: process.env.FACEBOOK_CLIENT_ID,
    secret: process.env.FACEBOOK_CLIENT_SECRET,
  },
}

localOauth(options, {}, (error, credentials) => {
  console.log(credentials);
});
