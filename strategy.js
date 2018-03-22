// Require passport-auth0 in a Auth0Strategy variable.
const Auth0Strategy = require('passport-auth0');
// Require config.js.
const config = require(`${__dirname}/config.js`);
// The values for domain, clientID, and clientSecret should be taken from config.js.
const { domain, clientID, clientSecret } = config;

// Use module.exports to export a new Auth0Strategy.
module.exports = new Auth0Strategy({
    domain: domain,
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: '/login'
},
function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
  }
)