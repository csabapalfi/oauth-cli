const localOauth = require('../index');

const options = {
  authCode: {
    endpoint: 'https://auth.getmondo.co.uk/',
    redirectUrl: 'http://localhost:8080',
  },
  accessToken: {
    endpoint: 'https://api.monzo.com/oauth2/token',
    clientAuth: 'form',
  },
  client: {
    id: process.env.MONZO_CLIENT_ID,
    secret: process.env.MONZO_CLIENT_SECRET,
  },
}

localOauth(options, {}, (error, credentials) => {
  console.log(credentials);
});
