var knn     =     require('./js/knear.js')(3); // number of classes
var trainer = new(require('./js/trainer.js'));
var sound   = new(require('./js/sound.js'));
var io      = new(require('./js/io.js'));
var client  = new(require('./js/client.js'));

sound.startRecord(function(data){

  // construct data object for client
  var dataPackage = {
    audio: data,
    class: false,
    examples: 1,
  }
  client.sendData(dataPackage);

})


//sound.setVolume(80);
//sound.playFile('server/data/noise.wav');
//io.setRGB(0, 0, 200);

console.log("Alias is Ready!");
