/* index.js file  Alexander Toscano Ricardo */

var path = require("path");
var app;

module.exports = function(params) {
  ({ app } = params);

  //Landing pages routes
  app.get("/version", (req, res) => {
    res.send({ version: "ApiRest v2.0.0" });
  });

  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../../app", "index.html"));
  });

  app.get("/login", function(req, res) {
    res.sendFile(path.join(__dirname, "../../app", "login.html"));
  });
};
