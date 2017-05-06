# local-oauth

Play around with OAuth2 APIs locally. Kind of like [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/) but as a node module that's easy to turn into a CLI or a basic server-side batch job.

* Create an app with your API provider of choice and set callback URL to `http://localhost:8080`
* Just drop endpoints, client id and secret, etc in options

Some examples:

* [Monzo](examples/monzo.js)
* [FreeAgent](examples/freeagent.js)
* Google Sheets (coming soon...)
* TransferWise (coming soon...)
