# coding=utf-8
import numpy as np
import time
from threading import Thread

# Import modules
from modules import globals
from modules import connection
from modules import sound
from modules import ai
from modules import led
import atexit


# Global inits 
#====================================================#
#init and setup RPI LED
LED = led.Pixels()
LED.off()
#Initialize the sound objects
noise = sound.audioPlayer("data/noise.wav",-1,"noise",True)
wakeup = sound.audioPlayer("data/ok_google.wav",0,"wakeup", False)

# Socket connection between client 
#====================================================#
@connection.socketio.on('msgEvent', namespace='/socket')
def test_message(message):
    msg = message['data']
    print(msg);
    print("----------------------")

    globals.PREDICT = False; #always stop prediction on button comman

    #Add example to class 0 - Silence / background noise
    if('class0' in msg and globals.EXAMPLE_READY):
        example = sound.get_spectrogram()
        ai.addExample(example,0)
        globals.BG_EXAMPLES += 1
        LED.listen()
    
    #Add example to class 1 - WakeWord
    elif('class1' in msg and globals.EXAMPLE_READY and not globals.UPDATE_BG_DATA):
        example = sound.get_spectrogram()
        ai.addExample(example,1)
        globals.TR_EXAMPLES += 1
        LED.listen()
    
    #Receive train command
    elif('train' in msg):    
        globals.TRAIN = True 

    #Receive reset command
    elif('reset' in msg):
        globals.RESET = True;   
        connection.send_response()  #tell client that we are reseting
        ai.reset_model()
        globals.RESET = False; 
        globals.TR_EXAMPLES = 0
        
    #Toogle Alias on and off
    elif('onoff' in msg):
        if(stream.is_active()):
            stream.stop_stream()
            noise.stop()
        else:
            stream.start_stream()
            noise.play()    

    #Receive is Button is pressed or released
    if('btn_release' in msg):
        print("released")
        globals.BUTTON_PRESSED = False
    elif('class1' in msg or 'class0' in msg):
        globals.BUTTON_PRESSED = True

    #Check if system is ready to predict
    if(globals.TRAIN or globals.RESET or globals.BUTTON_PRESSED or globals.TRIGGERED):
        globals.PREDICT = False
    else:
        globals.PREDICT = True

    connection.send_response()

# End of socket 
#====================================================#

# Main thread
def main_thread():

    noise.play() #Start noise   
    ai.create_model()  # setup keras model
    connection.send_response() #Send system info to client

    # variables to control timing between predictions 
    prev_timer = 0;
    interval = 5;

    # Program loop start here 
    #====================================================#
    while True:

        while stream.is_active():
            time.sleep(0.033)
            LED.off()
            current_sec = time.time()

            # If the mic is triggered an spectogram is not done, make a row more.
            if(globals.MIC_TRIGGER and not globals.EXAMPLE_READY):
                sound.make_spectrogram()
                
            if globals.PREDICT and globals.EXAMPLE_READY and not globals.TRAIN and not globals.RESET:
                sample = sound.get_spectrogram()
                print("get spectogram")
                print(globals.EXAMPLE_READY)
                if globals.HAS_BEEN_TRAINED: #if model has been trained then predict
                    globals.RESULT = ai.predict(sample).item()
                    print("GLOBAL RESULT: %d" %globals.RESULT)

                if globals.RESULT  == 1:
                    noise.stop()
                    wakeup.play()
                    LED.on()
                    globals.TRIGGERED = True
                    globals.PREDICT = False
                    prev_timer = current_sec
                    connection.send_response()

            elif globals.TRAIN:
                ai.train_model()
                globals.PREDICT = True
                globals.TRAIN = False
                connection.send_response() #tell client that we are done training

            else:
                globals.RESULT = 0

            if current_sec - prev_timer > interval:
                if globals.TRIGGERED:
                    noise.play()
                    print("start noise")
                    LED.off()
                    globals.TRIGGERED = False;
                    globals.PREDICT = True
                    connection.send_response()

# Setup
#====================================================#

globals.initialize()
stream = sound.initialize()
stream.start_stream() # start stream

# Setup and start main thread
thread = Thread(target=main_thread)
thread.daemon = True
thread.start()

print('')
print("============================================")
print("SERVER RUNNING ON: http://" + str(connection.HOST) + ":" + str(connection.PORT))
print("============================================")
print('')

# Start socket io
if __name__ == '__main__':
    connection.socketio.run(connection.app, host=connection.HOST, port=connection.PORT, debug=False, log_output=False)


def exit_handler():
    #noise.close()
    LED.off()
    stream.close()
    sound.pyaudio.terminate()
atexit.register(exit_handler)
