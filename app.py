"""
Project Alias - Rename your assistant and makes sure it never listens.
Copyright (C) 2020  Bjørn Karmann & Tore Knudsen

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
"""

# coding=utf-8
import time
import atexit
import ctypes
import signal
import threading
from threading import Thread
import multiprocessing
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

# Socket connection between client
#====================================================#
@connect.socketio.on('msgEvent', namespace='/socket')
def incoming(message):
    msg = message['msg']
    if('updateServer' in msg):
        # client has a updated the settings
        #print(message)
        #print('----')
        newSetting = message['data']
        print('serverData update recieved')
        settings.write(newSetting)
        settings.updateServer(newSetting)
        settings.read()

    if('volumeChange' in msg):
        vol = globals.SETTING['setting']['volume']
        print('change: volume', vol)
        sound.setVolume()

    if('noiseChanged' in msg):
        onOff = globals.SETTING['setting']['noise']
        print(onOff)
        if(onOff):
            noise.play()
        else:
            noise.stop()


    if('request' in msg):
        # send settings when client requests them
        print('settings request send')
        connect.sendMsg('response', settings.read())

    if('reloadSpeech' in msg):
        print('reloading speech class')
        globals.STOP_THREAD = True


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





# Speech thread
#====================================================#

class thread_with_exception(threading.Thread):
    def __init__(self, name):
        threading.Thread.__init__(self)
        self.name = name

    def run(self):
        try:
            while True:
                #main
                # when a keyphrase is detected, the for loop runs (LiveSpeech magic)
                print("running speech")
                for phrase in globals.SPEECH:

                    topWord = phrase.segments()[0]
                    print('trigger: ', topWord)
                    lookup = globals.SETTING['keyphrase'] # get setting
                    # lookup the setting words
                    for data in globals.SETTING['keyphrase']:
                        # check the topword with setting list
                        if data['name'].lower().strip() == topWord.lower().strip():
                            connect.sendMsg('activated', data['name'].lower().strip())
                            # get the whisper command matching the word
                            globals.GLOW = True
                            noise.stop()
                            print('say:', data['whisper'])
                            if data['whisper'].lower() == "ok google":
                                okgoogle.play()
                                time.sleep(0.6)
                                okgoogle.stop()
                            elif data['whisper'].lower() == "alexa":
                                alexa.play()
                                time.sleep(0.5)
                                alexa.stop()
                            else:
                                sound.speak(data['whisper'])
                            time.sleep(int(globals.SETTING['setting']['delay']))
                            noise.play()

        finally:
            print('ended')

    def get_id(self):
        # returns id of the respective thread
        if hasattr(self, '_thread_id'):
            return self._thread_id
        for id, thread in threading._active.items():
            if thread is self:
                return id

    def raise_exception(self):
        thread_id = self.get_id()
        res = ctypes.pythonapi.PyThreadState_SetAsyncExc(thread_id,
              ctypes.py_object(SystemExit))
        if res > 1:
            ctypes.pythonapi.PyThreadState_SetAsyncExc(thread_id, 0)
            print('Exception raise failure')



def main():
    # Global inits
    #====================================================#
    settings.read() # load settings from json file and save in globals
    sound.setVolume()
    led.LED.off()
    globals.SPEECH = speechInit()

    t1 = thread_with_exception('Speech thread')
    t1.start()
    #init and setup RPI LEDs


    globals.GLOW = True; # glow on startup once
    count = 1
    speed = 0
    up = True

    while True:

        if(globals.GLOW == True):
            time.sleep(0.01)
            led.LED.on(count)

            if(up == True):
                count = count + 1

            if(up == False):
                count = count - 1

            if(count > 100):
                up = False
                time.sleep(int(globals.SETTING['setting']['delay'])) # wait 2 secounds

            if( count < 1 & up == False):
                globals.GLOW = False
                up = True
                count = 0
        else:
            time.sleep(0.3)


        if globals.STOP_THREAD:
            globals.STOP_THREAD = False
            t1.raise_exception()
            t1.join()
            print("thread killed")

            globals.SPEECH = speechInit()
            t1 = thread_with_exception('Speech thread')
            time.sleep(1)
            t1.start()


# Start socket io
if __name__ == '__main__':
    #Initialize the sound objects
     globals.initialize()
     noise = sound.audioPlayer(globals.NOISE_PATH)
     okgoogle = sound.audioPlayer(globals.OKGOOGLE_PATH)
     alexa = sound.audioPlayer(globals.ALEXA_PATH)

     thread_socket = Thread(target=socket_thread)
     thread_socket.daemon = True
     thread_socket.start()
     noise.play()
     main()
     print("runs once");

def exit_handler():
    print("program stopped")
    globals.STOP_THREAD = True
    led.LED.off()
    connect.socketio.stop()
    sound.mixer.stop()
    os.system("ps -fA | grep python")

signal.signal(signal.SIGINT, exit_handler)
atexit.register(exit_handler)
