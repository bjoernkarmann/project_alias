var trainer = function(knn) {
  this.result = 0;
  this.examples = 0;

  this.feed = function(data){
    //knn.learn(data,2);
  }

  this.startTraining = function(data){
    this.examples++;
    console.log(this.examples);
  }

  this.resetTraining = function(data){
    this.examples = 0;
  }
};

module.exports = trainer;
