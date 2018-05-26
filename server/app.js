var trainer = new(require('./js/trainer.js'))(require('./js/knear.js')(3));
var sound = new(require('./js/sound.js'));
var spectogram = new(require('./js/spectogram.js'));
var io = new(require('./js/io.js'));
var client = new(require('./js/client.js'));

sound.setVolume(80);

sound.startRecord(function(data) {
  var pixelArray = spectogram.convertToSpec(data);
  trainer.feed(pixelArray); // Feed the audio data to the training module
  var clientPackage = { // Prepere clientPackage for client
    spectogram: pixelArray,
    class: trainer.result,
    examples: trainer.examples,
    noise: sound.noise
  }
  client.sendData(clientPackage); // Send clientPackage for client
});

// Listen for commands from the client
client.listen(function(data) {
  if (data == 'train') trainer.startTraining();
  if (data == 'reset') trainer.resetTraining();
  if (data == 'noise') sound.noise = !sound.noise; // toggle noise
});


//sound.playFile('server/data/noise.wav');
//io.setRGB(0, 0, 200);

console.log("Alias is Running!");
