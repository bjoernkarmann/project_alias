
// Init K-near algorithm
var knn = new kNear(3);

// Init variables for sound input and spectogram
var mic, fft;
var specInterval;
var r, g, b;
var Pixels = [];

// Init input and output variables for K-near algorithm
var pixelToKnn = [];
var inputToKnn = 625;

// Init layout variables
var resolution;
var step;

// Init variables for K-near output smoothing
var sampleSize = 12;
var classSample = [];
var index = 0;
var realOutput, oldOutput = 0;

//Variables for recording preData
var table, trainingExamples;
var recordData = false; // if true a new predata set will be recorded while traiing the null state, and saved as csv.
var recordCounter = 0;
var preRecordLimit = 3000; // amout of samples before recording is stoped and saved as csv
var doneTraining = false;

// Create device object to hold different home-assitences
var device = [];
var Device = function(name, command){
  this.name = name;
  this.command = command;
  this.executeCmd = function(){
     if(this.command.isPlaying() === false){
        this.command.play();
    }
  }
}

//-----------------------------------------------------------
// S E T U P
//-----------------------------------------------------------
function setup() {
    var canvas = createCanvas(500, 250);
    canvas.parent('sketch-holder');
    frameRate(30);

    //load activation sounds
    helloGoogle = loadSound('assets/google.mp3');
    alexa = loadSound('assets/alexa.mp3');
    //init devices
    device[0] = new Device("Google home", helloGoogle);
    device[1] = new Device("Amazon Echo", alexa);

    // Layout
    background(255);
    resolution = floor(sqrt(inputToKnn));
    step = height / resolution;
    //Create interface
    dropDown();
    slidersInit()
    buttons();

    // Init pixel array for spectrogram
    for (var i = 0; i < inputToKnn; i++) {
        Pixels[i] = color(50,50,70);
    }

    // Mic Input
    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT(0.1, 1024);
    fft.setInput(mic);
    specInterval = 22000 / 1024;

    //Variables for recording and loading preData
    trainingExamples = loadTable('assets/predata_3000.csv', 'csv', trainSilence);
    table = new p5.Table();
    for(var i = 0; i < inputToKnn; i++){
      table.addColumn(str(i));
    }
}


//-----------------------------------------------------------
// D R A W
//-----------------------------------------------------------
function draw() {

   if(!doneTraining){
        // nothing
   }
   else {
    //reset array of pixels to k-near algorithm
    pixelToKnn = [];
    //fill array with spectrogram pixels
    pixelToKnn = soundAnalyze();
    //train k-near algorithm with data
    trainOnData(pixelToKnn);
    //get the output from classification of data
    var keyWord = classifyData(pixelToKnn);
    //If keyword matches the command class, play device command when keyWord is said
    if(keyWord == cmdBtn.identity){
     setTimeout(function(){device[dropDown.value()].executeCmd(); }, 1000);
   }

    //update sliders
    for(var i = 0; i < sliderArr.length; i++){
    if(sliderArr[i].updateState) sliderArr[i].updateValues();
   }
 }
}


//-----------------------------------------------------------
// Handles to control the training
function trainOnData(arr) {
    if(cmdBtn.onState){
        knn.learn(arr, cmdBtn.identity);
        console.log("training " + cmdBtn.identity + " with: " + arr.length + " inputs");
    }
    else if(nullBtn.onState){
        knn.learn(arr, nullBtn.identity);
        console.log("training " + nullBtn.identity + " with: " + arr.length + " inputs");
    }
  }

  function classifyData(arr){
    var output;
    if(startBtn.onState){
      if(recordData) recordSamples(arr);
      else if( device[dropDown.value()].command.isPlaying() === false ){
        output = knn.classify(arr);
        output = avrOutput(output);
        console.log("output from " + arr.length + " inputs is: " + output);
      }
      return output;
    }
}

//-----------------------------------------------------------
// Load premaded traiing examples for null state and train K-near
function trainSilence(table){
for(var r = 1; r < table.getRowCount(); r++){
  var prePixels = [];
  for(var c = 0; c < trainingExamples.getColumnCount(); c++){
    prePixels[c] = trainingExamples.getNum(r,c);
  }
  knn.learn(prePixels, nullBtn.identity);
  console.log(prePixels.length);
  }
  doneTraining = true;
}

//-----------------------------------------------------------
// Load premaded traiing examples for null state and train K-near
function recordSamples(arr){
  var newRow = table.addRow();
  for(var i = 0; i < inputToKnn; i++){
    newRow.setNum(str(i), arr[i]);
  }
    recordCounter++;
    console.log("counter: " + recordCounter)
    if(recordCounter > preRecordLimit){
      console.log("save table");
      saveTable(table, 'new_2000.csv');
      recordData = false;
    }
}

//-----------------------------------------------------------
// Smoother for K-near
var avrOutput = function(output_) {
  var match = true;
  classSample = splice(classSample, output_, 0);
  classSample = subset(classSample, 0, sampleSize);

  var first = classSample[0];
  for (var i = 1; i < classSample.length; i++) {
    if (classSample[i] != first) match = false;
  }

  if (match) {
    realOutput = output_;
    oldOutput = output_;
  } else realOutput = oldOutput;

  return realOutput;
}
