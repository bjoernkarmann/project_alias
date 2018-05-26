var socket = io.connect('http://localhost:3000');
import * as Canvas from './canvas.js';

// resive data from server
socket.on('msg', function(data) {
  //Canvas.drawSpecto(data.server.spectogram); // send data to canvas
  Canvas.drawButton(data.server.spectogram); // send data to canvas
  // update GUI with data from server
  $("#noise").text("Noise: "+data.server.noise);
  $("#info" ).text("Examples: "+data.server.examples);
});

$('#canvas').mouseHold(function(){
  socket.emit('msg', 'train');
});

$('#reset').on('mousedown touch',function(){
  socket.emit('msg', 'reset');
});

$('#noise').on('mousedown touch',function(){
  socket.emit('msg', 'noise');
});
