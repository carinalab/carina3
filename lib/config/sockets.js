/* sockets.js file  Alexander Toscano Ricardo */
//https://socket.io/docs/

var io;

module.exports = function(params) {
  ({ io } = params);

  io.on("connection", function(socket) {
    console.log("A user connected");

    socket.emit("news", { hello: "world" });

    socket.on("SEND_MESSAGE", function(data) {
      console.log(`${data} ${socket.id}`);
      io.emit("GET_ID", { id: socket.id });
    });

    socket.on("my other event", function(data) {
      console.log(data);
    });

    socket.on("chat message", function(msg) {
      io.emit("chat message", "Conect to apirest");
      console.log("message: " + msg);
    });

    socket.on("disconnect", function() {
      console.log("user disconnected");
    });
  });
};
