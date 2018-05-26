//Setup canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

window.addEventListener('resize', function() {
  resize(canvas);
  xRes = canvas.width / resolution;
  yRes = canvas.height / resolution;
}, false);
resize(canvas);

var resolution = Math.floor(Math.sqrt(625));
var xRes = canvas.width / resolution;
var yRes = canvas.height / resolution;

export function drawSpecto(data) {
  //Draw the spectrogram
  for (var x = 0; x < resolution; x++) {
    for (var y = 0; y < resolution; y++) {
      var loc = x + (y * resolution);

      var r = Math.floor(data[loc]);
      var hue = 140+(r/6);
      var bri = (100-r/3);

      if(r<50){
          ctx.fillStyle = 'hsl(0,100%,100%)';
      }else{
          ctx.fillStyle = 'hsl('+ hue +',100%,'+bri+'%)';
      }

      //ctx.fillStyle = 'rgb(' + r + ',' + r + ',' + r + ')';
      ctx.fillRect(xRes * x, yRes * y, xRes, yRes);
    }
  }

}
export function drawButton(data){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  var dotsPerCircle=78;
  var interval=(Math.PI*2)/dotsPerCircle;

  var centerX=canvas.width/2;
  var centerY=canvas.height/2;
  for (var x = 0; x < resolution; x++) {
    for (var y = 0; y < resolution; y++) {
      var loc = x + (y * resolution);

      var value = Math.floor(data[loc]);
      var angle = resolution*loc;
      var r = 50 + value*2; // radius of circe
      var polarX = centerX+r*Math.cos(angle);
      var polarY = centerY+r*Math.sin(angle);

      ctx.fillStyle = 'hsl('+ (value*3) +',100%,'+(value/4)+'%)';
      ellipse(ctx,polarX,polarY,3);
    }
  }
  // ctx.beginPath();
  // for(var i=0;i<dotsPerCircle;i++){
  //
  //   var value = Math.floor(data[i]);
  //
  //   var angle = interval*i;
  //   var r = 100+(value*2);
  //   var x = centerX+r*Math.cos(angle);
  //   var y = centerY+r*Math.sin(angle);
  //   var dowR = 2;
  //   ellipse(ctx,x,y,dowR);
  // }
  ctx.closePath();
  ctx.fill();

}

function ellipse(ctx, x, y, r) {
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
