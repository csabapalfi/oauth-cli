const url = require('url');
const request = require('request');
const debug = require('debug')('oauth:access-token');

module.exports = (options, user, callback) => {
  const { accessToken: existingAccessToken, expiry} = user;
  if (existingAccessToken && Date.now() + 5000 < expiry) {
    debug(`existing: ${existingAccessToken}`);
    return callback(null, { accessToken: existingAccessToken });
  }

  const { refreshToken: existingRefreshToken } = user;
  debug(`${existingRefreshToken ? 'refreshing' : 'requesting'}...`);

  const { id: client_id, secret: client_secret } = options.client;
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

  switch (clientAuth) {
    case 'query':
      requestOptions.qs = { client_id, client_secret };
      break;
    case 'form':
      requestOptions.form.client_id = client_id;
      requestOptions.form.client_secret = client_secret;
      break;
    case 'basic':
    default:
      requestOptions.auth = { user: client_id, pass: client_secret };
  }

  debug(`request - url: ${requestOptions.url}`);
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
    debug(`new: ${accessToken}`);
    callback(null, {
      accessToken,
      refreshToken,
      expiry: Date.now() + expiresIn * 1000,
    });
  });
}
