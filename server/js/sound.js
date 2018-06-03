
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
  var math = require('mathjs');
  //mic config object

  var wav = require('node-wav');
  const config = {
    rate: 4096, // 4096 44100 2048 4000
    channels: 2,
    debug: true
  };
  var size = 1024; // size to slice

  this.startRecord = function(callback){
    var buffers = [];
    var micInstance =  mic(config);
    var stream = micInstance.getAudioStream();

    stream.on('data', buffer => {
      buffers.push(buffer); // -> save previous recorded data
      var headerBuf = header(config.rate, config); // ->  create wav header
      buffers.unshift(headerBuf); // -> set header in top of buffers
      var length = math.sum(buffers.map(b => b.length));
      try{
        var result = wav.decode(Buffer.concat(buffers, length)) // -> decode buffers to float array
        var wave = result.channelData[0]; // sample rate is 44100

        //   rate 44100 -> 11025 wav length (only 5512) -> 2048 FFT (4096 slice)
        //   rate 16000 -> 4000 wav length (full)       -> 1024 FFT (2048 slice)
        //   rate 8000  -> 2000 wav length (full)       -> need more numbers
        //   rate 8000  -> 2000 wav length (sliced)     -> 512 FFT (1024 slice)
        // * rate 8192  -> 2048 wav length (only 1024)  -> 512 FFT (1024 slice)
        //   rate 4096  -> 1024 wav length (full)       -> 512 FFT (gives errors)

        //console.log(wave);

        var slice = wave.slice(0,size);
        var fftValues = makeFFT(slice);
        console.log(fftValues);
        // callback(fftValues);
      }catch(err){
        console.error(err);
      }
      buffers = []; // free recorded data
    });
    micInstance.start();
  }

  //=====================//
  //   SOUND ANALYTICS   //
  //=====================//

  var ft = require('fourier-transform');
  // Private function for Fast Fourier Transformation
  function makeFFT(dataStream){
    try{
      var spectrum = ft(dataStream);
    }catch(err){
      console.error(err);
    }
    //Convert from Object to Array
    var arr = [];
    var i = 0;
    Object.keys(spectrum).map(function(key){
      arr[i] = Math.round(spectrum[key]*100, 4);
      i++;
    })
    return arr; // --> Return array of FFT values
  }
}

module.exports = sound;
