import numpy as np
from modules import globals
from modules import connection
from modules import led
from python_speech_features import mfcc
from python_speech_features import logfbank
from python_speech_features import sigproc
from queue import Queue

# Audio
import os
import pyaudio
import pygame.mixer
pygame.mixer.init()

# Audio settings
#====================================================#
RATE                = 16000
CHUNK_SAMPLES       = 1024
FEED_DURATION       = 1.5 # Duration in seconds
FEED_LENGTH         = np.floor(RATE * FEED_DURATION / CHUNK_SAMPLES)
WIN_LEN             = 1/(RATE/CHUNK_SAMPLES) #IN SECONDS
FORMAT              = pyaudio.paInt16
CHANNELS            = 1
DATA                = np.zeros(CHUNK_SAMPLES, dtype='int16')
RUNNING_SPECTOGRAM  = np.empty([0,13], dtype='int16')
print(FEED_LENGTH)
silence_threshhold = 700
q = Queue()

def initialize():
    os.system('sudo amixer -c 1 sset Speaker 83')
    return pyaudio.PyAudio().open(format=FORMAT,
                     channels=CHANNELS,
                     rate=RATE,
                     output=False,
                     input=True,
                     frames_per_buffer=CHUNK_SAMPLES,
                     stream_callback=audio_callback)



# Callback on mic input
def audio_callback(in_data, frame_count, time_info, flag):
    global DATA
    audio_data = np.frombuffer(in_data, dtype='int16')
    if np.abs(audio_data).mean() > silence_threshhold and not globals.MIC_TRIGGER:
        globals.MIC_TRIGGER = True
    if globals.MIC_TRIGGER:
        q.put(audio_data)
    return in_data, pyaudio.paContinue




def make_spectrogram():
    global RUNNING_SPECTOGRAM,FINISHED_SPECTOGRAM
    data = q.get()

    if(len(RUNNING_SPECTOGRAM) < FEED_LENGTH):
        #preemphasis the signal to weight up high frequencies
        signal = sigproc.preemphasis(data, coeff=0.95)
        #apply mfcc on the frames
        mfcc_feat = mfcc(signal, RATE, winlen= 1/(RATE/CHUNK_SAMPLES), nfft=CHUNK_SAMPLES*2, winfunc=np.hamming)
        RUNNING_SPECTOGRAM = np.vstack([mfcc_feat,RUNNING_SPECTOGRAM])
        connection.send_spectogram(mfcc_feat,len(RUNNING_SPECTOGRAM))
        print(len(RUNNING_SPECTOGRAM))
    else:
        FINISHED_SPECTOGRAM = RUNNING_SPECTOGRAM
        RUNNING_SPECTOGRAM = np.empty([0,13], dtype='int16')
        globals.EXAMPLE_READY = True
        globals.MIC_TRIGGER = False

def get_spectrogram():
    global FINISHED_SPECTOGRAM
    FINISHED_SPECTOGRAM = np.expand_dims(FINISHED_SPECTOGRAM, axis=0)
    globals.EXAMPLE_READY = False
    return FINISHED_SPECTOGRAM




# Audio player class
#====================================================#
class audioPlayer():
    def __init__(self,filepath, loop, name, canPlay):
        super(audioPlayer, self).__init__()
        self.filepath = os.path.abspath(filepath)
        self.loop = loop
        self.name = name
        self.canPlay = canPlay
        self.player = pygame.mixer.Sound(file=self.filepath)

    def check_if_playing(self):
        while pygame.mixer.get_busy():
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
