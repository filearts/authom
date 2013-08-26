var OAuth2 = require("./oauth2")
  , util = require('util')

function Eventbrite(options) {
  ["code", "token", "user"].forEach(function(name) {
    this[name] = Object.create(this[name])
  }, this)

  this.code.query = {
    client_id: options.id,
    response_type: "code",
    scope: options.scope || []
  }

  this.token.query = {
    client_id: options.id,
    client_secret: options.secret,
    grant_type: "authorization_code"
  }

  this.user.query = {
    app_key: options.id
  }

  if(options.fields) {
    this.user.query.fields = options.fields.join( ',' )
  }

  this.user.prepare = function(request, data) {
    request.headers || (request.headers = {})
    request.headers["Authorization"] = "Bearer " + data.access_token
  }

  this.on("request", this.onRequest.bind(this))

  OAuth2.call(this)
}

util.inherits(Eventbrite, OAuth2)

Eventbrite.prototype.code = {
  protocol: "https",
  host: "www.eventbrite.com",
  pathname: "/oauth/authorize"
}

Eventbrite.prototype.token = {
  method: "POST",
  host: "www.eventbrite.com",
  path: "/oauth/token",
  headers: { "Content-Type": "application/x-www-form-urlencoded" }
}

Eventbrite.prototype.user = {
  host: "www.eventbrite.com",
  path: "/json/user_get"
}

Eventbrite.prototype.getId = function(data) {
  return data.user.user_id
}
module.exports = Eventbrite