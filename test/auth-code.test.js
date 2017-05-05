let lastOpened;
const request = require('request');

describe('getAuthCode', () => {
  it('gets new auth codes', (done) => {
    const baseUrl = 'https://api.example.com/v1';
    const testAuthCode = '1234';
    const getAuthCode = proxy('../auth-code', {
      opener: (toOpen) => {
          expect(toOpen).to.equal(
            `${baseUrl}/approve_app?response_type=code` +
            '&redirectUrl=http%3A%2F%2Flocalhost%3A9090' +
            '&clientId=someOauthClientId'
          );
          request(`http://localhost:9090?code=${testAuthCode}`);
      },
    });
    getAuthCode({
      client: { id: 'someOauthClientId' },
      urls: {
        baseUrl,
        redirectUrl: 'http://localhost:9090',
        approvePath: ({ clientId, redirectUrl }) => ({
          pathname: '/approve_app',
          query: { response_type: 'code', redirectUrl, clientId }
        })
      }
    }, {}, (error, authCode) => {
      expect(error).to.be.null;
      expect(authCode).to.equal(testAuthCode);
      done();
    });
  });

  it('returns existing auth code', (done) => {
    const user = { authCode: '122'};
    const getAuthCode = proxy('../auth-code', { opener: () => {}});
    getAuthCode({}, user, (error, authCode) => {
      expect(error).to.be.null;
      expect(authCode).to.equal(user.authCode);
      done();
    });
  });
});
