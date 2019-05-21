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

# send result back to app
# sd card image (try again)
# new readme (update instructables)

#settings {keyphrase, setting}

# Socket connection between client
#====================================================#
@connect.socketio.on('msgEvent', namespace='/socket')
def incoming(message):
    msg = message['msg']
    if('updateServer' in msg):
        # client has a updated the settings
        print(message)
        print('----')
        newSetting = message['data']
        print('serverData update recieved')
        settings.write(newSetting)
        settings.updateServer(newSetting)
        settings.read()

    if('request' in msg):
        # send settings when client requests them
        print('settings request send')
        connect.sendMsg(settings.read())

    if('reloadSpeech' in msg):
        print('reloading speech class')
        globals.CONFIG_HAS_CHANGED = True

    if('languageChanged' in msg):
        lan = globals.SETTING['setting']['language']
        print('change: language', lan)

    if('genderChanged' in msg):
        gen = globals.SETTING['setting']['gender']
        print('change: gender', gen)

    if('volumeChange' in msg):
        vol = globals.SETTING['setting']['volume']
        print('change: volume', vol)
        sound.setVolume()

    if('sensitivityChange' in msg):
        print('change: volume')

    if('delayChange' in msg):
        print('change: volume')


# End of socket
#====================================================#

def speechInit():
    print("init live speech")
    return LiveSpeech(
        audio_device = None,
        sampling_rate=16000,
        lm=False,
        kws=globals.KEYWORD_PATH)

def socket_thread():
    print("starting socket thread")

    print('')
    print("============================================")
    print("SERVER RUNNING ON: http://" + str(connect.HOST) + ":" + str(connect.PORT))
    print("============================================")
    print('')

    connect.socketio.run(connect.app, host=connect.HOST, port=connect.PORT, debug=False, log_output=False)

def speech_thread():
    # when a keyphrase is detected, the for loop runs (LiveSpeech magic)
    for phrase in globals.SPEECH:
        topWord = phrase.segments()[0]
        print(topWord)
        lookup = globals.SETTING['keyphrase'] # get setting
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
    settings.read() # load settings from json file and save in globals
    sound.setVolume()
    noise.play()
    #init and setup RPI LEDs
    led.LED.off()
    globals.SPEECH = speechInit()

    thread_speech = Thread(target=speech_thread)
    thread_speech.daemon = True
    thread_speech.start()

    while True:
        time.sleep(0.3)

        #reset program when config is changed
        if globals.CONFIG_HAS_CHANGED:
            globals.CONFIG_HAS_CHANGED = False
            main()
            print("running main again")


# Start socket io
if __name__ == '__main__':
    #Initialize the sound objects
     globals.initialize()
     noise = sound.audioPlayer(globals.NOISE_PATH)

     thread = Thread(target=socket_thread)
     thread.daemon = True
     thread.start()

     main()


def exit_handler():
    led.LED.off()
    connect.socketio.stop()
    sound.mixer.stop()
    os.system("ps -fA | grep python")

atexit.register(exit_handler)
