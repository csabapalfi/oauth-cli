const url = require('url');
const request = require('request');
const debug = require('debug')('oauth:access-token');

module.exports = (options, user, callback) => {
  const { accessToken: existingAccessToken, expiry} = user;
  if (existingAccessToken && Date.now() < expiry) {
    return callback(null, { accessToken: existingAccessToken });
  }

  const { refreshToken: existingRefreshToken } = user;
  debug(
    `${existingRefreshToken ? 'Refreshing' : 'Creating'} access token...`
  );

  const { id: clientId, secret: clientSecret } = options.client;
  const { endpoint, clientAuth } = options.accessToken;
  const { authCode } = user;
  const { redirectUrl: redirect_uri } = options.authCode;

  const requestOptions = {
    url: endpoint,
    method: 'POST',
    json: true,
    form: existingRefreshToken ?
      { grant_type: 'refresh_token', refresh_token: existingRefreshToken } :
      { grant_type: 'authorization_code', code: authCode, redirect_uri },
  };

  if (clientAuth === 'form') {
    requestOptions.form.client_id = clientId;
    requestOptions.form.client_secret = clientSecret;
  } else {
    requestOptions.auth = { user: clientId, pass: clientSecret };
  }

  request(requestOptions, (error, response, body) => {
      if(error) {
        return callback(error);
      }
      if(response.statusCode >= 400) {
        return callback(body);
      }
      const {
        access_token: accessToken,
        expires_in: expiresIn,
        refresh_token: refreshToken = existingRefreshToken
      } = body;
    callback(null, {
      accessToken,
      refreshToken,
      expiry: Date.now() + expiresIn * 1000,
    });
  });
}
