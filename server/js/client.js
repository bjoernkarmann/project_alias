function client() {

  //https://github.com/socketio/socket.io
  var express = require('express');
  var app = express();
  var server = app.listen(3000);
  app.use(express.static('./public'));
  var socket = require('socket.io').listen(server);
  console.log('socket running on localhost:3000');

  // When  client connects
  socket.on('connection', function (socket) {
      console.log('A client is connected!');
      socket.emit('msg', 'You are connected!');

      // resive incomming messages
      socket.on('msg', function (data) {
        console.log(data);
      });
  });


  this.sendData = function(data){
    socket.emit('msg', {data: 'foo!', id: data.id});
  }

}
module.exports = client;
