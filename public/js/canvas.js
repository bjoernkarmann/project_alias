//Setup canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

window.addEventListener('resize', function(){
  resize(canvas);
}, false);
resize(canvas);

var resolution = Math.floor(Math.sqrt(625));
var xRes = canvas.width / resolution;
var yRes = canvas.height / resolution;

export function drawSpecto(data){
    //Draw the spectrogram
    for (var x = 0; x < resolution; x++) {
        for (var y = 0; y < resolution; y++) {
            var loc = x + (y * resolution);

            var r = 255-(Math.floor(data[loc]))*10;

            ctx.fillStyle = 'rgb('+r+','+r+','+r+')';
      ctx.fillRect(xRes * x, yRes * y, xRes, yRes);
    }
}

}
// export function drawButton(data){
//
//   ctx.clearRect(0,0,canvas.width,canvas.height);
//   var dotsPerCircle=78;
//   var interval=(Math.PI*2)/dotsPerCircle;
//
//   var centerX=canvas.width/2;
//   var centerY=canvas.height/2;
//   ctx.beginPath();
//   for(var i=0;i<dotsPerCircle;i++){
//
//     var value = constrain(norm(data[i*25],0,1) * (255 / 2 - data[i*25]),0,255);
//
//     var angle = interval*i;
//     var r = 100+(value*2);
//     var x = centerX+r*Math.cos(angle);
//     var y = centerY+r*Math.sin(angle);
//     var dowR = 2;
//     ellipse(ctx,x,y,dowR);
//   }
//   ctx.closePath();
//   ctx.fill();
//
// }

function ellipse(ctx,x,y,r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
}

function constrain(val, min, max) {
  return (val > max ? max : val < min ? min : val);
}

function norm(val, min, max) {
  return (val - min) / (max - min);
}

function resize(canvas) {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  if (canvas.width  != displayWidth ||
      canvas.height != displayHeight) {

    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
}
