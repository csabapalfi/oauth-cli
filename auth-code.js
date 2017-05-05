const url = require('url');
const { createServer } = require('http');
const open = require('opener');
const { assign } = Object;

module.exports = ({ urls, client }, user, callback) => {
  const { authCode: existingAuthCode } = user;
  if (existingAuthCode) return callback(null, existingAuthCode);

  console.error('Reqesting authorisation code...');

  const { id: clientId } = client;
  const { redirectUrl, baseUrl, approvePath } = urls;
  const server = createServer((request, response) => {
    const { query: { code: authCode } } = url.parse(request.url, true);
    response.end('Back to your terminal...');
    callback(null, authCode);
    server.close();
  });
  const { hostname, port } = url.parse(redirectUrl);
  server.listen(port, hostname, () => {
    open(`${baseUrl}${url.format(approvePath({ clientId, redirectUrl }))}`);
  });
};
