var trainer    = new(require('./js/trainer.js'))(require('./js/knear.js')(3));
var sound      = new(require('./js/sound.js'));
var spectogram = new(require('./js/spectogram.js'));
var io         = new(require('./js/io.js'));
var client     = new(require('./js/client.js'));

sound.setVolume(80);
sound.startRecord(function(data){

  // Create and update spectogram from mic data
 var pixelArr = spectogram.convertToSpec(data);
  // Feed the audio data to the training module
  trainer.feed(data);
  // Prepere clientPackage for client
  var clientPackage = {
    spectogram: pixelArr,
    class: trainer.result,
    examples: trainer.examples,
    noise: sound.noise
  }
  client.sendData(clientPackage);
});

// Listen for commands from the client
client.listen(function(data){
  if(data=='train')    trainer.startTraining();
  if(data=='trainoff') trainer.stopTraining();
  if(data=='reset')    trainer.resetTraining();
  if(data=='noise')    sound.noise = !sound.noise; // toggle noise
});


//sound.playFile('server/data/noise.wav');
//io.setRGB(0, 0, 200);

console.log("Alias is Running!");
