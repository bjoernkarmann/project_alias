var socket = io.connect('localhost:8000');
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

var timeOut = 0;
//Canvas.stopFeedback();

// while mousehold for training button
$('#canvas').on('mousedown touchstart', function(e) {
  $(this).addClass('active');
  timeOut = setInterval(function(){
    socket.emit('msg', 'train');
    //Canvas.startFeedback();
  }, 100);
}).bind('mouseup mouseleave touchend', function() {
  $(this).removeClass('active');
  socket.emit('msg', 'stop');
  //Canvas.stopFeedback();
  clearInterval(timeOut);
});

// while mousehold for nullstate button
$('#nullState').on('mousedown touchstart', function(e) {
  $(this).addClass('active');
  timeOut = setInterval(function(){
    socket.emit('msg', 'nullState');
  }, 100);
}).bind('mouseup mouseleave touchend', function() {
  $(this).removeClass('active');
  socket.emit('msg', 'stop');
  clearInterval(timeOut);
});


$('#reset').on('mousedown touch',function(){
  socket.emit('msg', 'reset');
});

$('#noise').on('mousedown touch',function(){
  socket.emit('msg', 'noise');
});
