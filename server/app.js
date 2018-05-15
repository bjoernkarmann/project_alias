
//var sound = new (require('./sound.js'));



//https://github.com/socketio/socket.io
var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('./public'));
var io = require('socket.io').listen(server);

//
// sound.setVolume(50);
// sound.playFile('/data/glitch.wav');
main();

function main(){
  console.log('Hej');
}

// When  client connects
// io.on('connection', function (socket) {
//     console.log('A client is connected!');
//     socket.emit('message', 'You are connected!');
// });
