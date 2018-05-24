
	// Init input and output variables for K-near algorithm
 	var resolution;
	var step;
	var canvas;
	var ctx; 
	//Setup canvas
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext("2d");
	canvas.width = 300;
	canvas.height = 300; 

	resolution = Math.floor(Math.sqrt(625));
	step = canvas.height / resolution;

	export function drawSpecto(data){
	    //Draw the spectrogram
	    for (var x = 0; x < resolution; x++) {
	        for (var y = 0; y < resolution; y++) {
	            var loc = x + (y * resolution);

	            var r = Math.floor(data[loc].r);
	            var g = Math.floor(data[loc].g);
	            var b = Math.floor(data[loc].b);

	          	ctx.fillStyle = 'rgb('+r+','+g+','+b+')';
				ctx.fillRect(step * x, step * y, step, step);
	    }
	}
}

	function constrain(val, min, max) {
	    return  (val > max ? max : val < min ? min : val);
	}
	function norm(val, min, max){
		return (val - min) / (max - min);
	}

 
