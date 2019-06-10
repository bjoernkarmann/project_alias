from modules import globals
from modules import led
from modules import settings

# Audio
import os
from pygame import mixer
mixer.init()

language = [['Afrikaans',   '-vaf'],
            ['Czech',       '-vcs'],
            ['Danish',      '-vda'],
            ['German',      '-vde'],
            ['Greek',       '-vel'],
            ['Esperanto',   '-veo'],
            ['English',     '-ven'],
            ['Spanish',     '-ves'],
            ['Finnish',     '-vfi'],
            ['French',      '-vfr'],
            ['Croatian',    '-vhr'],
            ['Hungarian',   '-vhu'],
            ['Italian',     '-vit'],
            ['Polish',      '-vpl'],
            ['Dutch',       '-vnl'],
            ['Portuguese',  '-vpt'],
            ['Swedish',     '-vsv'],
            ['Swahihi',     '-vsw'],
            ['Mandarin',    '-vzh']]

# Use $aplay -L to find sound card
def speak(txt):
    gender = globals.SETTING['setting']['gender']
    if(gender == 'Male'):
        gender = '+m3'
    if(gender == 'Female'):
        gender = '+f3'

    lang = globals.SETTING['setting']['language']

    for lan in language:
        if lan[0] == lang:
            lang = lan[1]

    cmd = 'espeak '+lang+gender+' "'+txt+'"'
    os.system(cmd)

def setVolume():

    vol = globals.SETTING['setting']['volume']
    vol = str(settings.mapF(int(vol),0,100,80,100))
    os.system('amixer -c 0 sset Headphone '+vol+'%')
    os.system('amixer -c 0 sset Speaker '+vol+'%')


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
        self.player.play(loops=-1)

    def stop(self):
        print("stop noise")
        self.player.stop()
