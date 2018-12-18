var moment = require("moment");
var User = require("../models/UserSchema");

module.exports = function(params) {
  ({ app, session, crypto, jwt, fs, io } = params);
  app.post("/user/auth", function(req, res) {
    var idUsuario = req.body.idUsuario;

    //User.find({ email: email }).exec((err, user) => {
    //if (err) res.status(200).send({ status: { message: "Error connect!" } });
    //if (user.length > 0) {
    // PAYLOAD

    var payload = {
      idUsuario: idUsuario
    };
    // PRIVATE and PUBLIC key
    var privateKEY = fs.readFileSync(__dirname + "/private.key", "utf8");
    var publicKEY = fs.readFileSync(__dirname + "/public.key", "utf8");

    // SIGNING OPTIONS
    var signOptions = {
      expiresIn: "1200h",
      algorithm: "RS256"
    };
    var token = jwt.sign(payload, privateKEY, signOptions);
    io.emit("user/auth", { token: token });
    res.status(200).send({ status: { message: "Auth sended!" } });
    //} else {
    //res.status(200).send({ status: { message: "User no found!" } });
    //}
    //});
  });
};

/*
Creador (iss) - Identifica a quien creo el JWT
Razón (sub) - Identifica la razón del JWT, se puede usar para limitar su uso a ciertos casos.
Audiencia (aud) - Identifica quien se supone que va a recibir el JWT. Un ejemplo puede ser web, android o ios. Quien use un JWT con este campo debe además de usar el JWT enviar el valor definido en esta propiedad de alguna otra forma.
Tiempo de expiración (exp) - Una fecha que sirva para verificar si el JWT esta vencido y obligar al usuario a volver a autenticarse.
No antes (nbf) - Indica desde que momento se va a empezar a aceptar un JWT.
Creado (iat) - Indica cuando fue creado el JWT.
ID (jti) - Un identifador único para cada JWT.
*/
