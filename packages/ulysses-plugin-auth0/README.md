# ulysses-plugin-auth0

## Usage

### Client side

```js
import auth0Plugin from '@smarterlabs/ulysses-plugin-auth0/client'

...
{
  plugins: [
    auth0Plugin({
        domain: process.env.AUTH0_DOMAIN,
        clientId: process.env.AUTH0_CLIENT_ID,
        redirectUri: window.location.origin,
    }),
  ],
}
...
```

### Server side

```js
import auth0Plugin from '@smarterlabs/ulysses-plugin-auth0/server'

...
{
  plugins: [
    auth0Plugin({
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENTSECRET,
    }),
  ],
}
...
```