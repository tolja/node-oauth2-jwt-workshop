var JWT = require('jsonwebtoken');

var model = module.exports;

var JWT_SECRET_FOR_ACCESS_TOKEN = "SuPeRSEcRETKeY" // secret, um JWT zu generieren
model.JWT_ACCESS_TOKEN_EXPIRY_SECONDS = 1800;  // läuft nach 30 Minuten ab


// TODO: Was erhält ein Client vom Auth Server?
var oauthClients = [{
  // Hier die Daten eintragen
'': '',
'': ''
}];

// TODO: autorisierte Client ID eintragen
var authorizedClientIds = {
  password: [
   ''
  ]
};

// current registered users
var users = [ {
    id : '123',
    username: 'authworkshop',
    password: 'authworkshop'
  }
];


// Functions required to implement the model for oauth2-server

// generateToken
// This generateToken implementation generates a token with JWT.
// the token output is the Base64 encoded string.
model.generateToken = function(type, req, callback) {
  var token;
  var secret;
  var user = req.user;
  var exp = new Date();
  var payload = {
    // public claims

    // TODO: Wer vergibt das JWT? Welche Variable ist nötig?
    dummyValue: 'dummyVar',

//    jti: '',         // unique id for this token - needed if we keep a store of issued tokens
    // private claims
    userId: user.id // Über das JWT kommen wir an die Daten des Benutzers
  };
  var options = {
    algorithms: ['HS256']  // HMAC using SHA-256 hash algorithm
  };

    secret = JWT_SECRET_FOR_ACCESS_TOKEN;
    exp.setSeconds(exp.getSeconds() + model.JWT_ACCESS_TOKEN_EXPIRY_SECONDS);
    payload.exp = exp.getTime(); // the expiry date

  token = JWT.sign(payload, secret, options);

  callback(false, token);
};

// The bearer token is a JWT, so we decrypt and verify it. We get a reference to the
// user in this function which oauth2-server puts into the req object
model.getAccessToken = function (bearerToken, callback) {

  return JWT.verify(bearerToken, JWT_SECRET_FOR_ACCESS_TOKEN, function(err, decoded) {

    if (err) {
      return callback(err, false);   // the err contains JWT error data
    }

    return callback(false, {
      expires: new Date(decoded.exp),
      user: getUserById(decoded.userId)
    });
  });
};


// As we're using JWT there's no need to store the token after it's generated
model.saveAccessToken = function (accessToken, clientId, expires, userId, callback) {
  return callback(false);
};

// authenticate the client specified by id and secret
model.getClient = function (clientId, clientSecret, callback) {
  for(var i = 0, len = oauthClients.length; i < len; i++) {
    var elem = oauthClients[i];
    if(elem.clientId === clientId &&
      (clientSecret === null || elem.clientSecret === clientSecret)) {
      return callback(false, elem);
    }
  }
  callback(false, false);
};

// determine whether the client is allowed the requested grant type
model.grantTypeAllowed = function (clientId, grantType, callback) {
  callback(false, authorizedClientIds[grantType] &&
    authorizedClientIds[grantType].indexOf(clientId.toLowerCase()) >= 0);
};

// authenticate a user
// for grant_type password
model.getUser = function (username, password, callback) {
  for (var i = 0, len = users.length; i < len; i++) {
    var elem = users[i];
    if(elem.username === username && elem.password === password) {
      return callback(false, elem);
    }
  }
  callback(false, false);
};

var getUserById = function(userId) {
  for (var i = 0, len = users.length; i < len; i++) {
    var elem = users[i];
    if(elem.id === userId) {
      return elem;
    }
  }
  return null;
};
