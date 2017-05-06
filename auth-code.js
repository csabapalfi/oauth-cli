const url = require('url');
const { createServer } = require('http');
const open = require('opener');
const makeDestroyable = require('server-destroy');
const debug = require('debug')('oauth:auth-code');
const { assign } = Object;

module.exports = (options, user) =>
  new Promise((resolve, reject) => {
    const { authCode: existingAuthCode } = user;
    if (existingAuthCode) {
      debug(`existing: ${existingAuthCode}`);
      return resolve(existingAuthCode)
    };

    debug('requesting...');
    const { endpoint, redirectUrl: redirect_uri, scopes } = options.authCode;
    const { id: client_id } = options.client;

    const server = createServer((request, response) => {
      const { query: { code: authCode } } = url.parse(request.url, true);
      response.end('Back to your terminal...');
      debug(`new: ${authCode}`);
      resolve(authCode);
      server.destroy();
    });

    const { hostname, port } = url.parse(redirect_uri);
    server.listen(port, hostname, () => {
      debug(`redirect server listening on ${redirect_uri}...`);
      const query = {
        response_type: 'code',
        access_type: 'offline',
        client_id,
        redirect_uri
      };
      if (scopes) query.scope = scopes.join(' ');
      const approveUrl = endpoint + url.format({ query });
      debug(`opening: ${approveUrl}...`);
      open(approveUrl);
    });
    makeDestroyable(server);
  });
