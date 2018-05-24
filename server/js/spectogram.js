function Spectogram() {
  var _ = require('lodash'); // https://lodash.com
  // Init input and output variables for K-near algorithm
  var pixelToKnn = [];
  var Pixels = [];
  var inputToKnn = 625; // 625
  var thresh = 0;
  resolution = Math.floor(Math.sqrt(inputToKnn));

  this.convertToSpec = function(dataStream) {
    var Pixels = [];
    for (var i = 0; i < inputToKnn; i++) {
      let color = {
        r: 0,
        g: 0,
        b: 0
      };
      Pixels[i] = color;
    }

    var binSize = dataStream.length;
    for (let i = 0; i < binSize; i++) {

      // calculate the vertical location of the pixel
      var vLoc = _.floor(i * resolution / (binSize));
      var value = dataStream[i];
      if (value < thresh) value = 0;
      // else value = map(value,thresh,maxVal ,0,255);
      // value = constrain(value,0,255);
      // create colors from values
      let r_ = constrain(50 + norm(value, 0, 1) * (370), 0, 255);
      let g_ = constrain(50 + norm(value, 0, 1) * norm(value, 0, 1) * 220, 0, 255);
      let b_ = constrain((70 + norm(value, 0, 1) * (255 / 2 - value)), 0, 255);

      var index = resolution + (((resolution - 1) - vLoc) * resolution - 1);

      Pixels[index].r = Math.round(r_, 2);
      Pixels[index].g = Math.round(g_, 2);
      Pixels[index].b = Math.round(b_, 2);
    }

    /*
	    //DEBUG
	      var activeCol = [];
    	 for(var i = 0; i < Pixels.length; i++){
     	  if(Pixels[i].r > 50){
        var stream_ = {bin: i, vol: Pixels[i].r };
        activeCol.push(stream_);
      }
     }
     console.log(activeCol);
     */

    // Update the spectrogram one step to the left
    for (var r = 0; r < resolution; r++) {
      for (var p = 0; p < 1; p++) {
        Pixels.copyWithin(resolution * r, resolution * r + 1, (resolution * r + 1) + (resolution - 1));
      }
    }
    return Pixels;
  }

  // MAth Functions
  function constrain(val, min, max) {
    return (val > max ? max : val < min ? min : val);
  }

  function norm(val, min, max) {
    return (val - min) / (max - min);
  }
}
module.exports = Spectogram;
