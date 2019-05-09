from modules import globals
from modules import led

# Audio
import os
from pygame import mixer
mixer.init()


# Use $aplay -L to find sound card
def speak(txt):
    os.system('espeak '+txt)
    #os.system('espeak "'+txt+'" --stdout | aplay -D "sysdefault:CARD=seeed2micvoicec"')
    print("TtS: " + txt)


class audioPlayer():
    def __init__(self,filepath):
        super(audioPlayer, self).__init__()
        self.filepath = os.path.abspath(filepath)
        self.player = mixer.Sound(file=self.filepath)

    def check_if_playing(self):
        while mixer.get_busy():
            pass

    def play(self):
        print("play noise")
        self.player.play(loops=True)

    def stop(self):
        print("stop noise")
        self.player.stop()
