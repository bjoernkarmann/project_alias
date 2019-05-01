from modules import globals
from modules import led

# Audio
import os
from pygame import mixer
mixer.init()


# Use $aplay -L to find sound card
def speak(txt):
    os.system('espeak "'+txt+'" --stdout | aplay -D "sysdefault:CARD=seeed2micvoicec"')
    print("TtS: " + txt)


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

    def play(self):
        print("playing " + self.name)
        self.player.play(loops=self.loop)
        if not self.loop:
            self.check_if_playing()

    def stop(self):
        print("stopping " + self.name)
        self.player.stop()
