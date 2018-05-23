function client() {

  //https://github.com/socketio/socket.io
  var express = require('express');
  var app = express();
  var server = app.listen(3000);
  app.use(express.static('./public'));
  var socket = require('socket.io').listen(server);

  // When  client connects reseive messages
  socket.on('connection', function (socket) {
      socket.on('msg', function (data) {
        console.log(data);
      });
  });

  // Send data to the client
  this.sendData = function(data){
    socket.emit('msg', {server: data});
  }
}
module.exports = client;
