var express = require('express');
var bodyParser = require('body-parser');
var oauthserver = require('oauth2-server');
var simpleoauth = require('./model.js');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.oauth = oauthserver({
  model: simpleoauth,
  grants: ['password'],
  accessTokenLifetime: simpleoauth.JWT_ACCESS_TOKEN_EXPIRY_SECONDS
});

app.all('/oauth/token', app.oauth.grant());

app.get('/', app.oauth.authorise(), function (req, res) {
  res.send('Abgesicherte Ressource\n'+JSON.stringify(req.user));

});

app.use(app.oauth.errorHandler());

app.listen(3000, function () {
  console.log("Server ist listening on http://localhost:3000/");
});
