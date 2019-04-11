# coding=utf-8
import numpy as np
import time
import atexit
from threading import Thread
from pocketsphinx import LiveSpeech
# Import modules
from modules import globals
from modules import connect
from modules import sound
from modules import settings
from modules import led

# 2.0 to do:
# add settings on app:
#   noise on/of
#   noise delay slider
#   volume controle
#   select language model
#   sensitivity controle (1-10) this ads a number on mapping
#   set defult (tbd)
#   write that we recomemend more that 5 syllables

# style app
# built in recomendation (random on plus )

# add timer
# send result back to app
# add text to speach
# update speech object

# sd card image (try again)
# new readme (update instructables)

# Global inits
#====================================================#
#init and setup RPI LEDs
led.LED.off()
#Initialize the sound objects
noise = sound.audioPlayer("data/noise.wav",-1,"noise",True)
#wakeup = sound.audioPlayer("data/ok_google2.wav",0,"wakeup", False)

globals.initialize()
settings.read() # load settings from json file and save in globals

# Socket connection between client
#====================================================#
@connect.socketio.on('msgEvent', namespace='/socket')
def incoming(message):
    msg = message['data']
    if('update' in msg):
        # client has a updated the settings
        newSetting = message['setting']
        print('settings update recieved')
        settings.write(newSetting)
        settings.updateKeywords(newSetting)
        speech.kws='data/keyphrase.list'
        # at this point we want to reset the speech model or reload kws
    if('request' in msg):
        # send settings when client requests them
        print('settings request send')
        connect.sendMsg(settings.read())

# End of socket
#====================================================#

speech = LiveSpeech(
    audio_device = None,
    sampling_rate=16000,
    lm=False,
    kws='data/keyphrase.list')

def main_thread():
    while True:
        # when a new word is detected
        for phrase in speech:
            topWord = phrase.segments()[0]
            lookup = globals.SETTING['setting'] # get setting
            # lookup the setting words
            led.LED.on()
            for data in lookup:
                # check the topword with setting list
                if data['name'].lower().strip() == topWord.lower().strip():
                    # get the whisper command matching the word
                    print('say:', data['whisper'])
            time.sleep(1) # delay for 1 second
            led.LED.off()

thread = Thread(target=main_thread)
thread.daemon = True
thread.start()

noise.play()

print('')
print("============================================")
print("SERVER RUNNING ON: http://" + str(connect.HOST) + ":" + str(connect.PORT))
print("============================================")
print('')

# Start socket io
if __name__ == '__main__':
    connect.socketio.run(connect.app, host=connect.HOST, port=connect.PORT, debug=False, log_output=False)

def exit_handler():
    led.LED.off()
    connect.socketio.stop()
    sound.mixer.stop()

atexit.register(exit_handler)
