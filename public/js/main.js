var socket = io.connect('http://localhost:3000');
import * as Canvas from './canvas.js';
var pixels = [];

// resive data from server
socket.on('msg', function(data) {
  pixels = data.server.color;
  Canvas.drawSpecto(pixels);
});

var train = false;
// send data to server
var train = document.getElementById('train');
var reset = document.getElementById('reset');
var noise = document.getElementById('noise');


var timeout;
train.onmousedown = function() {
  timeout = setInterval(function() {
    socket.emit('msg', 'train');
    console.log("hej");
  }, 10);
  return false;
};

train.onmouseup = function() {
  clearInterval(timeout);
  return false;
};

// train.onmousedown = function(){socket.emit('msg', 'train');};
// train.onmouseup   = function(){socket.emit('msg', 'trainoff');};
// train.onmousedown = function(){socket.emit('msg', 'train');};

reset.addEventListener('click', function() {
  socket.emit('msg', 'reset');
});
noise.addEventListener('click', function() {
  socket.emit('msg', 'noise');
});
