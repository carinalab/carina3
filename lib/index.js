/* index.js file  Alexander Toscano Ricardo */
var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var bodyParser = require("body-parser");
var session = new Object();
var crypto = require("crypto");
var morgan = require("morgan");
var fs = require("fs");
var path = require("path");
var jwt = require("jsonwebtoken");
var { conf } = require("./config/apirest");

/** require databases */
require("./Databases");

/** require midlewares */
require("./config/midleware")({
  app: app,
  bodyParser: bodyParser,
  morgan: morgan,
  fs: fs,
  path: path
});

/** require auth */
require("./config/auth")({
  app: app,
  session: session,
  crypto: crypto,
  jwt: jwt,
  fs: fs,
  io: io
});

/** require routes of APIREST */
require("./routes/index")({
  app: app
});

/** require routes of carina */
require("./routes/carinaRoutes")({
  app: app,
  io: io
});

//models
//require("./models")(app);

/** export server */
exports.server = server;
