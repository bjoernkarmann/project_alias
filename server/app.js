var knn    =     require('./js/knear.js')(3); // number of classes
var sound  = new(require('./js/sound.js'));
var io     = new(require('./js/io.js'));
var client = new(require('./js/client.js'));

sound.startRecord(function(data){
  console.log(data); // sending back buffer
})

sound.setVolume(80);
sound.playFile('server/data/noise.wav');
io.setRGB(0, 0, 200);

console.log("Alias is Ready!");
