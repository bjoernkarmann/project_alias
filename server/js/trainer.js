var trainer = function() {

var generator = require('knear');
var knn = new generator.kNear(3)

  this.result = 0;
  this.examples = 0;
  this.data; 
  this.knn = knn;

  this.feed = function(data){
    this.data = data; // --> catch spectogram data 
    this.result = knn.classify(data); // --> classify the data
    if(this.result === undefined) this.result = 0; // --> return 0/null if no examples is given yet
    this.result = this.smoother(this.result); // --> allow a error marin by smoothhing
    console.log("result:           " + this.result);
  }

  this.trainNull = function(data){
   // console.log("train null");
    knn.learn(this.data, 0);
  }

  this.startTraining = function(data){
    this.examples++;
     knn.learn(this.data,1);
    // console.log("train command");
  }

  this.resetTraining = function(data){
    this.examples = 0;
  }


  ////////////////////////
  // Smoother algorithm //
  ////////////////////////
  var sampleSize = 3; // --> sample size / error margin size
  var classSample = []; // --> array to hold samples 
  var realResult, oldResult = 0; // --> variables used to return final result

  this.smoother = function(newResult){
    var match = true; 
    
    classSample.unshift(newResult); // --> push new result into array
    classSample = classSample.slice(0,sampleSize); // --> remove oldest sample 
    console.log(classSample);
    var first = classSample[0];
    for (var i = 1; i < classSample.length; i++) {
      if(classSample[i] != first) match = false // --> See if all samples matches the newest
    }
    if(match) { //if yes the new result is verified 
      realResult = newResult;
      oldResult = newResult; 
    }
    else realResult = oldResult; //if not stick to the last varified result
    return realResult; 
  }
};

module.exports = trainer;
