var trainer = function(knn) {
  var result = 0;
  var examples = 0;

  this.feed = function(data) {

  }

  this.startTraining = function(data) {
    console.log("Starting training");
  }

  this.stopTraining = function(data) {
    console.log("Stopping training");
  }

  this.resetTraining = function(data) {
    console.log("Resetting training");
  }
};

module.exports = trainer;
