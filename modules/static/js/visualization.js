 /////////////////////////////////////////////////////////////
    // Visualization 
    var centerX, centerY;
    var colLength = 20;
    var rowLength = 22; 
    var radius = 100;
    var angle;
    var recordBtn = false;
    var vis = [];
    var canvas; 
    var bgCol = 255; 

    function setup() {
      var canvasDiv = document.getElementById('canvas-wrapper')
      var width = canvasDiv.offsetWidth;
      var height = canvasDiv.offsetHeight;
      canvas = createCanvas(width, height);
      canvas.parent('canvas-wrapper');
      background(255);
      frameRate(30);

      centerY = height/2;
      centerX = width/2;
      angle = radians(360/colLength);
      vis.push(new Visualization());
      vis[0].init();
    }



    function draw(){
      background(bgCol);
      for(var i = 0; i < vis.length; i++){
        if(recordBtn && i == vis.length-1){
          vis[i].active = true;
          vis[i].col = 0;
        }
        else if (i == vis.length-1){
          vis[i].col = bgCol;
        } 
        else{
          vis[i].active = false;     
        }
        vis[i].drawVisualization();
      }

      if(recordBtn){
        if(rowCount != rowLength){
          fill(0);
          //rect( round((width-176)/2) , 4 , rowCount*round((176/rowLength)) , 4 ); 
          rect( 0 , 0 , rowCount*round((width/rowLength)) , 8 ); 
        }
      } 
    } 



    function receiveData(data){
      if(rowCount < rowLength){
        vis[vis.length-1].updateVisualization(data);
      }
      else{
        if(recordBtn && !record_BG){
          vis.push(new Visualization());
          vis[vis.length-1].init(); 
        }
      vis[vis.length-1].shrink = true; 
      }
    }



    function resetVisualizations(){
      vis = []; 
      vis.push(new Visualization());
      vis[0].init();
    }



    function Visualization(){
      this.x = []; 
      this.y = [];
      this.initX = [];
      this.initY = []; 
      this.opacity = 0; 
      this.col = 0; 
      this.active = true;
      this.shrink = false; 

      this.init = function(){
        for(var i = 0; i <= colLength-1; i++){
          this.x[i] = cos(angle * i) * radius;
          this.y[i] = sin(angle * i) * radius;
          this.initX[i] = this.x[i];
          this.initY[i] = this.y[i];
        }
      }

      this.decreaseVisualization = function(){
        for(var i = 0; i <= colLength-1; i++){
          var distance = dist(this.x[i], this.y[i], this.initX[i], this.initY[i]);
          var decreaseVal = map(distance,5,50,1,7);
          
           if(distance > 5 ){
            this.x[i] -= cos(angle * i) * decreaseVal;
            this.y[i] -= sin(angle * i) * decreaseVal;
          }
          else{
            this.x[i] = this.initX[i]
            this.y[i] = this.initY[i];
            if(compareArray(this.x,this.initX)) this.shrink = false;  
          }
        }
      }

      this.updateVisualization = function(data){
        for(var i = 0; i < colLength; i++){
          var val = abs(data[i])
          if(val < 20) val = 0; 
          val = val/8;
          //console.log("val: " + val + " | " + "data abs: " + abs(data[i]) + " | " + "data: " +data[i]);
          this.x[i] += cos(angle * i) * val;
          this.y[i] += sin(angle * i) * val;
        }
      }

      this.drawVisualization = function(){
        strokeWeight(4);
        stroke(0);

        if(this.active){
          this.opacity = 255;
        }else{
          if(this.opacity > 0) this.opacity -= 50; 
        }

        fill(this.col,this.opacity);
        if(this.shrink) this.decreaseVisualization(); 
        
        beginShape();
        curveVertex(this.x[colLength-1] + centerX, this.y[colLength-1] + centerY);
        for(var i = 0; i <= colLength-1; i++){
          curveVertex(this.x[i] + centerX, this.y[i] + centerY);
        }
        curveVertex(this.x[0] + centerX, this.y[0] + centerY);
        curveVertex(this.x[1] + centerX, this.y[1] + centerY);
        endShape();
      }
    }



    function compareArray(a,b){
      for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    }

    function windowResized() {
      var canvasDiv = document.getElementById('canvas-wrapper')
      var width = canvasDiv.offsetWidth;
      var height = canvasDiv.offsetHeight;
      resizeCanvas(width , height);
      centerY = height/2;
      centerX = width/2;
    } 