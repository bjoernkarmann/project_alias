var socket = io.connect('10.0.0.16:8000');
import * as Canvas from './canvas.js';
socket.emit('msg', 'train');
// resive data from server
socket.on('msg', function(data) {
  Canvas.drawSpecto(data.server.spectogram); // send data to canvas
  //Canvas.drawButton(data.server.spectogram); // send data to canvas
  // update GUI with data from server
  $("#noise").text("Noise: "+data.server.noise);
  $("#info" ).text("Examples: "+data.server.examples);
});

$('#canvas').mouseHold(function(data){
  socket.emit('msg', 'train');
});

$('#nullState').mouseHold(function(data){
  socket.emit('msg', 'nullState');
});

$('#reset').on('mousedown touch',function(){
  socket.emit('msg', 'reset');
});

$('#noise').on('mousedown touch',function(){
  socket.emit('msg', 'noise');
});
