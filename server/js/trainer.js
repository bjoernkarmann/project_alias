var trainer = function(knn) {
  this.result = 0;
  this.examples = 0;

  this.feed = function(data) {

  }

  this.startTraining = function(data) {
    this.examples++;
    console.log(this.examples);
  }

  this.resetTraining = function(data) {
    this.examples=0;
    console.log(this.examples);
  }
};

module.exports = trainer;
