var socket = io.connect('http://localhost:3000');

// resive data from server
socket.on('connection', function (socket) {
  socket.emit('msg', 'hello');
});

socket.on('msg', function (data) {
  console.log(data);
});

var train = false;
// send data to server
var train = document.getElementById('train');
var reset = document.getElementById('reset');
var noise = document.getElementById('noise');


train.onmousedown = function(){socket.emit('msg', 'train');};
train.onmouseup   = function(){socket.emit('msg', 'trainoff');};

train.onmousedown = function(){socket.emit('msg', 'train');};
reset.addEventListener('click', function() {
    socket.emit('msg', 'reset');
});
noise.addEventListener('click', function() {
    socket.emit('msg', 'noise');
});
