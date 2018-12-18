"use strict";
/* server.js file  Alexander Toscano Ricardo */

/**
 * API REST Server
 * Inicializa el servidor
 */
var { conf } = require("./lib/config/apirest");
var { server } = require("./lib/index");
server.listen(8080);
console.log(`System on!`);
