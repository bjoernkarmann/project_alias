    var timeOut;
    var timeOut_progress = null; 

    var class_to_train = 'class1'
    var record_BG = false;
    var on_State = true;
    var showMenu = false;

  $(document).ready(function(){
    //init menu function 
    $(".menu-icon").on('click',clickMenu);

    // Toggle mechanic for buttons
    $("#canvas-wrapper").on('mousedown touchstart', function(e){
      stopBtnPress()
      if(!triggered){
        recordBtn = true;
        timeOut=setInterval(function() {
          socket.emit('msgEvent', {data: class_to_train});
        }, 100);
        e.preventDefault(); //prevent native mobile action
      }
    });

    $("#canvas-wrapper").on('mouseup touchend', function(e){
      socket.emit('msgEvent', {data:"btn_release"});
      clearInterval(timeOut)
      recordBtn = false;
      e.preventDefault(); //prevent native mobile action
    });

    //train btn
    $("#train").on('click', function(){
      if(!resetState && !triggered) socket.emit('msgEvent',{data:"train"});
      stopBtnPress();
    })

    //Reset btn
    $("#reset").mousedown(function(){
       if(!trainState && !triggered) socket.emit('msgEvent',{data:"reset"});
       stopBtnPress();
    })

    //Toggle system to be on and off 
    $("#onoff").mousedown(function(){
      stopBtnPress();
      socket.emit('msgEvent',{data:"onoff"});
      if(on_State){
        on_State = false;
        $("#onoff").text("Turn ON");
        $("#header-text").text("Inactive");
      }
      else{
        on_State = true;
        $("#onoff").text("Turn OFF");
        $("#header-text").html("Examples <span id='tr_examples'></span>");
      }
    });
    
    //Class to train toogle
    $("#bg-toggle").mousedown(function(){
      stopBtnPress();
      if(!record_BG){
        $("#bg-toggle").text("Background sound - ON");
        $("#header-meta").removeClass('hidden')
        record_BG = true;
        class_to_train = 'class0';
      }
      else{
        $("#bg-toggle").text("Background sound - OFF");
        $("#header-meta").addClass('hidden')
        record_BG = false;
        class_to_train = 'class1';
      }
      requestInfo();
    })   
    
    //Prevent selection
    $('body').disableSelection();
    $("canvas").on('touchstart click', (e)=>{
      e.preventDefault();
    });

  });


  //Feedback mechanics on commands (Training and reseting)

   //Ask server to update info
  function requestInfo(){
    socket.emit('msgEvent',{data:"get-info"});
  }   

  function stopBtnPress(){
      clearInterval(timeOut)
      recordBtn = false;
  }
  
  function progress_feedback(word){
    $("#header-text").text(word)
    var progress = ".";
    timeOut_progress = setInterval(function(){
      $("#header-text").text(word+progress);
      progress += "."; 
      if(progress.length > 3) progress = ".";
      },500);
  }

  //Menu btn
  function clickMenu(){
      console.log("clicked");
      if(!showMenu){
        $(".menu").animate({
          top:'20%'
        },700,function(){
          showMenu = true;
        })
      }
    else{
      $(".menu").animate({
        top: '80%'
        },700,function(){
          showMenu = false;
        })
      }
  }

  $.fn.extend({
    disableSelection: function() {
      this.each(function() {
        this.onselectstart = function() {
          return false;
        };
        this.unselectable = "on";
        $(this).css('-moz-user-select', 'none');
        $(this).css('-webkit-user-select', 'none');
      });
        return this;
    }
  });