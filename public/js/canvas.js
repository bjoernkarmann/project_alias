//Setup canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

resize(canvas);
window.addEventListener('resize', function() {
  resize(canvas);
  xRes = canvas.width / resolution;
  yRes = canvas.height / resolution;
}, false);

var resolution = Math.floor(Math.sqrt(625));
var xRes = canvas.width / resolution;
var yRes = canvas.height / resolution;

export function drawSpecto(data) {
  //Draw the spectrogram
  for (var x = 0; x < resolution; x++) {
    for (var y = 0; y < resolution; y++) {
      var loc = x + (y * resolution);

      var value = Math.floor(data[loc]);
      var hue = 140+(value/6);
      var bri = (100-value/3);

      if(value<1){
          ctx.fillStyle = 'hsl(0,100%,100%)';
      }else{
          ctx.fillStyle = 'hsl('+ hue +',100%,'+bri+'%)';
      }
      ctx.fillRect(xRes * x, yRes * y, xRes, yRes);
    }
  }
}

export function drawButton(data){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  var interval=(Math.PI*2)/resolution;
  var centerX=canvas.width/2;
  var centerY=canvas.height/2;

  for (var x = 1; x < 10; x++) {
    var points = [];
    var lastValue = 0;
    for (var y = 0; y < resolution; y++) {
      var loc = (resolution-x) + (y * resolution);

      var value = Math.floor(data[loc])*20;
      var avg_value = (value+lastValue)/2;

      var angle = interval*y;
      var sec_angle = interval*(y-0.5); // take avage

      var r = (x*10)+100 + value/2; // radius of circe
      var sec_r = (x*10)+100 + avg_value/2; // radius of circe
      var polarX     = centerX+r*Math.cos(angle);
      var polarY     = centerY+r*Math.sin(angle);
      var sec_polarX = centerX+sec_r*Math.cos(sec_angle);
      var sec_polarY = centerY+sec_r*Math.sin(sec_angle);

      ctx.fillStyle = 'hsl('+ 53 +',0%,'+(x*10)+'%)';
      ellipse(ctx,polarX,polarY,2);
      ellipse(ctx,sec_polarX,sec_polarY,2);
      lastValue = avg_value;
    }
    points = [];
  }
}

function ellipse(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
}

function resize(canvas) {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  if (canvas.width != displayWidth ||
    canvas.height != displayHeight) {

    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
}
