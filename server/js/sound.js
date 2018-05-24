
function sound() {

  //=====================//
  //       SPEAKER       //
  //=====================//

  var cmd = require('node-cmd'); //https://www.npmjs.com/package/node-cmd
  var Sound = require('aplay'); //https://www.npmjs.com/package/aplay
  var music = new Sound();

  this.noise = false; // Public toogle for noise

  // Public function to controle the volume
  this.setVolume = function(n){
    cmd.run('amixer -c 1 sset Speaker '+n);
  }
  // Public functions to play and pause soundfiles
  this.playFile = function(path) {
    music.play(path);
    music.on('complete', function () {
      console.log('Done playing');
    });
  }
  this.loopFile = function(path) {
    music.play(path);
    music.on('complete', function () {
      music.play(path);
    });
  }
  this.pauseFile = function(path) {
    music.pause();
  }

  //=====================//
  //     MICROPHONE      //
  //=====================//

  var fs = require('fs');
  var mic = require('mic'); //https://github.com/ashishbajaj99/mic
  //Decoder dependecies
  var header = require("waveheader"); https:// https://www.npmjs.com/package/waveheader
  var WavDecoder = require('wav-decoder'); // https://www.npmjs.com/package/wav-decoder
  //For calculations
  var _ = require('lodash');// https://lodash.com

  //mic config object
  const config = {
    rate: 44100,
    channels: 2,
    debug: false,
    fileType: 'wav'
  };

  var micInstance = mic(config);
  // Public function start recording from the microphone
  // For debugging use on mac use sox

  this.startRecord = function(callback){
    let buffers = [];
    var micInstance =  mic(config);
    var stream = micInstance.getAudioStream();

    stream.on('data', buffer => {
      buffers.push(buffer); // -> save previous recorded data
      var headerBuf = header(config.rate, config); // ->  create wav header
      buffers.unshift(headerBuf); // -> set header in top of buffers
      var length = _.sum(buffers.map(b => b.length));
      WavDecoder.decode(Buffer.concat(buffers, length)) // -> decode buffers to float array
        .then(audioData => {
          var wave = audioData.channelData[0]; // get audiostream array
         // makeFFT(wave);
          callback(wave);
          //var fttStream = makeFFT(wave);
        })
      buffers = []; // free recorded data
    });
    micInstance.start();
  }

  //=====================//
  //   SOUND ANALYTICS   //
  //=====================//

  var fjs = require("frequencyjs"); // https://www.npmjs.com/package/frequencyjs
  // Private function for Fast Fourier Transformation
  function makeFFT(dataStream){
     var maxAmp = _.max(dataStream);
     var minAmp = _.min(dataStream);

  /*  console.log("#52 bin " + _.round(dataStream[52],3));
    console.log("#1000 bin " + _.round(dataStream[1000],3));
    console.log("#683 bin " + _.round(dataStream[683],3));
    console.log("#230 bin " + _.round(dataStream[230],3));
    console.log("#1700 bin " + _.round(dataStream[1700],3));
    console.log("_____________");
    */

      var activeFreq = [];
     for(var i = 0; i < dataStream.length; i++){
       if(dataStream[i] > 0.1){
        var stream_ = {bin: i, vol: dataStream[i]};

        activeFreq.push(stream_);
      }
     }
     //console.log(activeFreq);

     // print the dominant frequency bin and amplitude
     var spectrum = fjs.Transform.toSpectrum(dataStream,{ method: 'fft'});
     var freq = spectrum.dominantFrequency().frequency;

     //print amount of frequency bins affected
  //   console.log("dominant freq: " + freq + " | " + " num of freq-bins affected: " + count + " | " +
   //  " max-Amplitude: " + _.round(maxAmp,2) + " | " + " min-Amplitude: " + _.round(minAmp,2));
  }
}
module.exports = sound;
