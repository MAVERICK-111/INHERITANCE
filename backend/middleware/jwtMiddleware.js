const { expressjwt: jwt } = require("express-jwt");
const jwks = require("jwks-rsa");
const { domain, audience } = require("../config/auth0Config");

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`,
  }),
  audience: audience,
  issuer: `https://${domain}/`,
  algorithms: ["RS256"],
});

module.exports = jwtCheck;
