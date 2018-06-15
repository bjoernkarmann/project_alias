var trainer = function(knn) {
  this.result = 0;
  this.examples = 0;

  var trainingState = false;

  this.feed = function(data){
    //knn.learn(data,2);
  }

  this.startTraining = function(data){
    trainingState = true;
  }

  this.stopTraining = function(){
    if(trainingState == true){ //only when state has changed
      trainingState = false;
      this.examples++; // add to example counter
      console.log(this.examples);
    }
  }

  this.resetTraining = function(data){
    this.examples = 0;
  }

  this.beginTraining = function(delay) {
    var repeater =  setInterval(continuesTraining, delay);
    function continuesTraining(){
    //console.log(trainingState);
    }
  }

};

module.exports = trainer;
