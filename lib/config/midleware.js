/* midleware.js file  Alexander Toscano Ricardo */
var express = require("express");

module.exports = function(params) {
  ({ app, bodyParser, morgan, fs, path } = params);

  var accessLogStream = fs.createWriteStream(
    path.join(__dirname, "./logs/access.log"),
    { flags: "a" }
  );

  app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(morgan("combined", { stream: accessLogStream }));
  app.use(express.static(__dirname + "/app"));
  app.use(bodyParser.json());
  // CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
    );
    res.header("Access-Control-Allow-Credentials", "true");    
    next();
  });
};
