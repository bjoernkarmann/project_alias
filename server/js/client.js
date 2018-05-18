function client() {

  //https://github.com/socketio/socket.io
  var express = require('express');
  var app = express();
  var server = app.listen(3000);
  app.use(express.static('./public'));
  var socket = require('socket.io').listen(server);

  // When  client connects
  socket.on('connection', function (socket) {
      console.log('A client is connected!');
      socket.emit('message', 'You are connected!');
  });
}
module.exports = client;
