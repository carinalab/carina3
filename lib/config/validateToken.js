var moment = require("moment");
var fs = require("fs");
var privateKEY = fs.readFileSync(__dirname + "/private.key", "utf8");
var publicKEY = fs.readFileSync(__dirname + "/public.key", "utf8");

module.exports = function verifyToken(req, res, next) {
  if (req.headers.authorization) {
    var token = req.headers.authorization;
    var verifyOptions = {
      expiresIn: "12h",
      algorithm: ["HS256"]
    };
    jwt.verify(token, publicKEY, (err, result) => {
      if (err == null) {
        next();
      } else {
        res.status(200).send({ err: err, result: result });
      }
    });
  } else {
    return res
      .status(403)
      .send({ message: "Your request has no authorization header" });
  }
};
