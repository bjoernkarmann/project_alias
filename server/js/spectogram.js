function Spectogram() {
  var _ = require('lodash'); // https://lodash.com
  // Init input and output variables for K-near algorithm
  var inputToKnn = 625; // 625
  resolution = Math.floor(Math.sqrt(inputToKnn));
  var mappingRoof = 2;
  var thresh = 0.1;
  var r, g, b;
  var Pixels = [];
  for (var i = 0; i < inputToKnn; i++) {
    Pixels[i] = 50;
  }

  this.convertToSpec = function(dataStream) {

    var binSize = dataStream.length - 600;
    for (let i = 0; i < binSize; i++) {

      // calculate the vertical location of the pixel
      var vLoc = _.floor(i * resolution / (binSize));

      //get volume from frequency bin
      var value = dataStream[i];
      // Apply threshhold
      if (value < thresh) value = 0;

      // create colors from values
      r = constrain(norm(value, thresh, mappingRoof) * (370), 0, 255);
      g = constrain(norm(value, thresh, mappingRoof) * norm(value, thresh, mappingRoof) * 220, 0, 255);
      b = constrain(norm(value, thresh, mappingRoof) * (255 / 2 - value), 0, 255);

      var index = resolution + (((resolution - 1) - vLoc) * resolution - 1);

      //convert to B/W
      Pixels[index] = (r + g + b) / 3;
    }
    // Update the spectrogram one step to the left
    for (let r = 0; r < resolution; r++) {
      for (let p = 0; p < 1; p++) {
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
