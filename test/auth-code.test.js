const request = require('request');

describe('getAuthCode', () => {
  it('gets new auth codes', () => {
    const endpoint = 'https://api.example.com/v1/approve_app';
    const testAuthCode = '1234';
    const getAuthCode = proxy('../auth-code', {
      opener: (toOpen) => {
          expect(toOpen).to.equal(
            `${endpoint}?response_type=code` +
            '&access_type=offline' +
            '&client_id=someOauthClientId' +
            '&redirect_uri=http%3A%2F%2Flocalhost%3A9090'
          );
          request(`http://localhost:9090?code=${testAuthCode}`);
      },
    });
    return getAuthCode({
      client: { id: 'someOauthClientId' },
      authCode: { endpoint, redirectUrl: 'http://localhost:9090' },
    }, {}).then(authCode =>
      expect(authCode).to.equal(testAuthCode)
    );
  });

  it('returns existing auth code', () => {
    const user = { authCode: '122'};
    const getAuthCode = proxy('../auth-code', {
      opener: () => { throw new Error('opener should not be called'); }
    });
    return getAuthCode({ authCode: {}, client: {} }, user)
      .then(authCode =>
        expect(authCode).to.equal(user.authCode)
      );
  });
});
