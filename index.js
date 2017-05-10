const getAuthCode = require('./auth-code');
const getAccessToken = require('./access-token');

const defaults = {
  authCode: {
    redirectUrl: 'http://localhost:8080',
  },
  accessToken: {
    clientAuth: 'basic',
  },
}

// TODO refactor
// TODO apply defaults
module.exports = (options, user, callback) => {
  getAuthCode(options, user)
    .then(authCode => {
      user.authCode = authCode;

      getAccessToken(options, user, (tokenError, tokenData) => {
        if(tokenError) return callback(tokenError);
        Object.assign(user, tokenData);
        callback(null, user);
      });
    })
    .catch(error => callback(error));
};
