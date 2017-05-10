# oauth

Pre-auth OAuth2 APIs locally

...then request/refresh access tokens easily

## why?

I have some personal scripts that need to interact with OAuth2 APIs for a single user.

## usage

### register your app
* create/register an app with your API provider of choice
* set callback URL to `http://localhost:8080`

### configure the module

* drop endpoints, client id and secret, etc in options
* you can pre-configure previously acquired auth code and tokens

### single function to call

* returns access token (and auth code, refresh token, token expiry)
* requests auth code (if not pre-configured)
    * starts local server for auth code callback
    * opens your browser with the approve URL
* requests or refreshes access token (if not pre-configured or expired)

### some examples

* [Monzo](examples/monzo.js)
* [FreeAgent](examples/freeagent.js)
* [Google](examples/google.js)
* [Facebook](examples/facebook.js) (no refresh tokens, needs manual re-auth)
* TransferWise (coming soon...)
