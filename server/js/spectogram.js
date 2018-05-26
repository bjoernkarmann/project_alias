function Spectogram(){
	var _ = require('lodash');// https://lodash.com
	// Init input and output variables for K-near algorithm
	var pixelToKnn = [];
	var Pixels = []; 
	var inputToKnn = 625; // 625
	var thresh = 0; 
    resolution = Math.floor(Math.sqrt(inputToKnn));

    var r,g,b; 
    var Pixels = []; 
	for (let i = 0; i < inputToKnn; i++) {
	     Pixels[i] = 50;
	}
		        
	this.convertToSpec = function(dataStream) {
	    
	  var binSize = dataStream.length;
	  for (let i = 0; i < binSize; i++) {

	  		// calculate the vertical location of the pixel
	        var vLoc = _.floor(i * resolution / (binSize));
	        var value = dataStream[i];
	        // else value = map(value,thresh,maxVal ,0,255);
	        // value = constrain(value,0,255);
	        // create colors from values
	        r = constrain(50 + norm(value,0,0.4) * (370), 0, 255);
	        g = constrain(50 + norm(value, 0, 0.4) * norm(value, 0, 0.4) * 220, 0, 255);
	        b = constrain((70 + norm(value, 0, 0.4) * (255 / 2 - value)), 0, 255);
	       	    	
	 		var index = resolution + (((resolution - 1) - vLoc) * resolution - 1);	       

	 		//convert to B/W
	    	Pixels[index] = (r + g + b) / 3; 
	    }
     // Update the spectrogram one step to the left
	 for (let r = 0; r < resolution; r++) {
	        for (let p = 0; p < 1; p++) {
	            Pixels.copyWithin(resolution * r, resolution * r + 1, (resolution * r + 1)+ (resolution - 1));
	        }
	   	}
	   	return Pixels;	  
	}

	// MAth Functions 
	function constrain(val, min, max) {
	    return  (val > max ? max : val < min ? min : val);
	}
	function norm(val, min, max){
		return (val - min) / (max - min);
	}
}
module.exports = Spectogram;
