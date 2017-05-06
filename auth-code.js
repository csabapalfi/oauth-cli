const url = require('url');
const { createServer } = require('http');
const open = require('opener');
const makeDestroyable = require('server-destroy');
const debug = require('debug')('oauth:auth-code');
const { assign } = Object;

module.exports = (options, user) =>
  new Promise((resolve, reject) => {
    const { authCode: existingAuthCode } = user;
    if (existingAuthCode) return resolve(existingAuthCode);

    debug('Reqesting authorisation code...');

    const { endpoint, redirectUrl: redirect_uri } = options.authCode;
    const { id: client_id } = options.client;

    const server = createServer((request, response) => {
      const { query: { code: authCode } } = url.parse(request.url, true);
      response.end('Back to your terminal...');
      debug(`Got authorisation code: ${authCode}`);
      resolve(authCode);
      server.destroy();
    });

    const { hostname, port } = url.parse(redirect_uri);
    server.listen(port, hostname, () => {
      open(endpoint + url.format({
        query: { response_type: 'code', client_id, redirect_uri }
      }));
    });
    makeDestroyable(server);
  });
