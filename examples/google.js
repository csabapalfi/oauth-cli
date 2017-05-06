const localOauth = require('../index');

const options = {
  authCode: {
    endpoint: 'https://accounts.google.com/o/oauth2/auth',
    redirectUrl: 'http://localhost:8080',
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets'
    ]
  },
  accessToken: {
    endpoint: 'https://www.googleapis.com/oauth2/v4/token',
    clientAuth: 'form',
  },
  client: {
    id: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_CLIENT_SECRET,
  },
}

localOauth(options, {}, (error, credentials) => {
  console.log(credentials);
});
