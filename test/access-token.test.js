const nock = require('nock');
const getAccessToken = require('../access-token');

const options = {
  authCode: {
    redirectUrl: 'http://localhost:9090',
  },
  accessToken: {
    endpoint: 'http://example.com/v1/token_endpoint',
  },
  client: {
    id: '112abc', secret: 'shh',
  },
};

describe('getAccessToken', () => {
  it('creates (requests) access token', (done) => {
    const user = { authCode: 'authCode1234' };
    const mock = nock('http://example.com')
      .post('/v1/token_endpoint')
      .query(true)
      .reply(200, {
          access_token: 'newAccessToken',
          refresh_token: 'newRefreshToken',
          expires_in: 5,
        });
    getAccessToken(options, user, (error, result) => {
      expect(error).to.be.null
      expect(result.accessToken).to.equal('newAccessToken');
      expect(result.expiry <= Date.now() + 5000 ).to.be.true;
      expect(result.refreshToken).to.equal('newRefreshToken');
      mock.done();
      done();
    });

  });

  it('refreshes expired access token', (done) => {
    const user = {
      accessToken: 'existingAccessToken',
      expiry: Date.now() - 5 * 60 * 1000,
      refreshToken: 'existingRefreshToken'
    };
    const mock = nock('http://example.com')
      .post('/v1/token_endpoint')
      .query(true)
      .reply(200, {
        access_token: 'newAccessToken',
        expires_in: 5,
      });
    getAccessToken(options, user, (error, result) => {
      expect(error).to.be.null
      expect(result.accessToken).to.equal('newAccessToken');
      expect(result.expiry <= Date.now() + 5000).to.be.true;
      expect(result.refreshToken).to.equal('existingRefreshToken');
      mock.done();
      done();
    });
  });

  it('simply returns and existing non-expired access token', (done) => {
    const user = {
      accessToken: 'existingAccessToken',
      expiry: Date.now() + 60 * 60 * 1000,
    };
    getAccessToken(options, user, (error, { accessToken }) => {
      expect(error).to.be.null;
      expect(accessToken).to.equal(user.accessToken);
    });
    done();
  });

  it('handles request errors', (done) => {
    const user = { authCode: 'authCode1234' };
    const invalidOptions = Object.assign({}, options, {
      accessToken: { endpoint: 'invalid URL' }
    });
    getAccessToken(invalidOptions, user, (error, result) => {
      expect(error).to.not.be.null
      expect(result).to.be.undefined
      done();
    });
  });

  it('handles non-2xx responses', (done) => {
    const user = { authCode: 'authCode1234' };
    const mock = nock('http://example.com')
      .post('/v1/token_endpoint')
      .query(true)
      .reply(500, { error: 'oops' });
    getAccessToken(options, user, (error, result) => {
      expect(error).to.eql({ error: 'oops'});
      expect(result).to.be.undefined
      done();
    });
  });

  it.skip('sends client id and secret with Basic Auth', () => {
    // TODO
  });

  it.skip('sends client id and secret in body', () => {
    // TODO
  });
});
