
var nullCount = 0; 
var cmdCount = 0;
var dropDown;

//---------------------------------------------------------------------------
//SLIDER SETUP
var sliderX;
var Slider = function(min, max, val, para, x, y){
    this.min = min;
    this.max = max;
    this.val = val;
    this.para = para;
    this.x = x;
    this.y = y 
    this.slider = createSlider(this.min, this.max, this.val);
    this.slider.addClass("slider");
    this.slider.position(x,y);
    this.updateState = false;

    this.val = this.slider.value();
    this.text = createP(this.para+": " + this.val);
    this.text.addClass('slider-text');
    this.text.position(x,y-2);

    this.updateValues = function(){
         this.val = this.slider.elt.value;
         this.text.elt.innerHTML = this.para+": " + this.val;
         console.log(this.val);
    }
}

var cutOff_slider, maxVal_slider, speed_slider, freqCut_slider;
var sliderArr = [];
function slidersInit(){
    // INIT SLIDERS 
    sliderX = width/2+30;
    sliderArr[0] = new Slider(0,1024,600, "freqCut", sliderX, 140); 
    sliderArr[1] = new Slider(0,255,75,"cutoff", sliderX, 20);
    sliderArr[2] = new Slider(0,255,220,"maxVal", sliderX,60);
    sliderArr[3] = new Slider(0,10,2,"speed", sliderX, 100);

   for(let i = 0; i < sliderArr.length; i++){
    sliderArr[i].slider.mousePressed(() => slider_toogle(i));
    sliderArr[i].slider.mouseReleased(() => slider_toogle(i));
   }
}

function slider_toogle(i){
    if(!sliderArr[i].updateState) sliderArr[i].updateState = true;
    else sliderArr[i].updateState = false;
}

//---------------------------------------------------------------------------
//DROPDOW SETUP
function dropDown(){
    //INIT DROPDOWN 
    dropDown = createSelect();
    dropDown.option(device[0].name, 0);
    dropDown.option(device[1].name, 1);
    dropDown.addClass('dropdown');
    dropDown.changed(mySelectEvent);
}

function mySelectEvent(){
    var selected = this.selected();
    console.log(selected);
}

//---------------------------------------------------------------------------
//BUTTON SETUP
var nullBtn, cmdBtn, startBtn;
var Button = function(name,class_, identity){
    this.identity = identity;
    this.onState = false;
    this.name = name;
    this.class_ = class_;
    this.btn = createButton(this.name);
    this.btn.addClass(this.class_);

    this.toogle = function(){
        if(this.name != "on/off") {
            startBtn.onState = false;
            startBtn.btn.removeClass('active');
        }
        if(!this.onState){
            this.onState = true;
            this.btn.addClass('active');
        }
        else{
            this.onState = false;
            this.btn.removeClass('active');
        }
    }
}

function buttons(){   
    startBtn = new Button("on/off","btn", "toggle");
    startBtn.btn.mousePressed(() => startBtn.toogle());

    nullBtn = new Button("train null state", "btn", "null");
    nullBtn.btn.mousePressed(() => nullBtn.toogle());
    nullBtn.btn.mouseReleased(() => nullBtn.toogle());

    cmdBtn = new Button("train command", "btn", "command");
    cmdBtn.btn.mousePressed(() => cmdBtn.toogle());
    cmdBtn.btn.mouseReleased(() => cmdBtn.toogle());
}







