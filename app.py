# coding=utf-8
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
import os

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

# send result back to app

# sd card image (try again)
# new readme (update instructables)



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
        settings.updateKeyphrase(newSetting)
        globals.CONFIG_HAS_CHANGED = True

    if('request' in msg):
        # send settings when client requests them
        print('settings request send')
        connect.sendMsg(settings.read())

# End of socket
#====================================================#

def speechInit():
    print("init live speech")
    return LiveSpeech(
        audio_device = None,
        sampling_rate=16000,
        lm=False,
        kws='data/keyphrase.list')

def socket_thread():
    print("starting socket thread")
    connect.socketio.run(connect.app, host=connect.HOST, port=connect.PORT, debug=False, log_output=False)

def speech_thread():
    # when a keyphrase is detected, the for loop runs (LiveSpeech magic)
    for phrase in globals.SPEECH:
        topWord = phrase.segments()[0]
        print(topWord)
        lookup = globals.SETTING['setting'] # get setting
        # lookup the setting words
        led.LED.on()
        for data in lookup:
            # check the topword with setting list
            if data['name'].lower().strip() == topWord.lower().strip():
                # get the whisper command matching the word
                noise.stop()
                print('say:', data['whisper'])
                sound.speak(data['whisper'])
        time.sleep(2) # delay for 2 second
        led.LED.off()
        noise.play()


def main():
    # Global inits
    #====================================================#

    #Initialize the sound objects
    globals.initialize()
    settings.read() # load settings from json file and save in globals

    noise.play()
    #init and setup RPI LEDs
    led.LED.off()
    globals.SPEECH = speechInit()

    thread_speech = Thread(target=speech_thread)
    thread_speech.daemon = True
    thread_speech.start()

    thread = Thread(target=socket_thread)
    thread.daemon = True
    thread.start()


    print('')
    print("============================================")
    print("SERVER RUNNING ON: http://" + str(connect.HOST) + ":" + str(connect.PORT))
    print("============================================")
    print('')

    while True:
        time.sleep(0.3)
        print("loop")

        #reset program when config is changed
        if globals.CONFIG_HAS_CHANGED:
            globals.CONFIG_HAS_CHANGED = False
            main()


# Start socket io
if __name__ == '__main__':
     noise = sound.audioPlayer("data/noise.wav")
     main()


def exit_handler():
    led.LED.off()
    connect.socketio.stop()
    sound.mixer.stop()
    os.system("ps -fA | grep python")
    thread._stop()
    thread_speech.stop()

atexit.register(exit_handler)
