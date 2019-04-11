import numpy as np
from modules import globals
from modules import led

import subprocess # to send commands to espeak

# Audio
import os
import pyttsx3 # text to speech
from pygame import mixer
mixer.init()

# print('s')
# engine = pyttsx3.init()
# engine.say("I will speak this text")
# engine.runAndWait()
# print('e')

# def execute_unix(inputcommand):
#    p = subprocess.Popen(inputcommand, stdout=subprocess.PIPE, shell=True)
#    (output, err) = p.communicate()
#    return output

# Audio player class
#====================================================#
class audioPlayer():
    def __init__(self,filepath, loop, name, canPlay):
        super(audioPlayer, self).__init__()
        self.filepath = os.path.abspath(filepath)
        self.loop = loop
        self.name = name
        self.canPlay = canPlay
        self.player = mixer.Sound(file=self.filepath)

    def check_if_playing(self):
        while mixer.get_busy():
            pass
        led.LED.on()

    def play(self):
        print("playing " + self.name)
        self.player.play(loops=self.loop)
        if not self.loop:
            self.check_if_playing()

    def stop(self):
        print("stopping " + self.name)
        self.player.stop()
