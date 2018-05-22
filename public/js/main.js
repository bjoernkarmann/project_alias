var socket = io.connect('http://localhost:3000');

// resive data from server
socket.on('msg', function (data) {
  console.log(data);
});
var train = false;
// send data to server
var train = document.getElementById('train');
var reset = document.getElementById('reset');
var noise = document.getElementById('noise');

train.addEventListener('mousedown', function() {
    socket.emit('msg', 'train');
});

train.addEventListener('mouseup', function() {
    socket.emit('msg', 'trainoff');
});

reset.addEventListener('click', function() {
    socket.emit('msg', 'reset');
});

noise.addEventListener('click', function() {
    socket.emit('msg', 'noise');
});
