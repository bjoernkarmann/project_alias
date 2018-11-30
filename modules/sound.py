import numpy as np
from modules import globals
from modules import connection

# Audio
import os
import pyaudio
import wave
import time
import threading
import traceback
import pygame.mixer
pygame.mixer.init()


# Audio settings
#====================================================#
CHUNK               = 512
FORMAT              = pyaudio.paInt16
CHANNELS            = 1
RATE                = 16000
SPECTOGRAM_LEN      = 22
FRAMES_RANGE        = 20 # the same as Y-axe values for convinience
RUNNING_SPECTOGRAM  = np.empty([0,FRAMES_RANGE], dtype=np.int16) # array to store thespectogram
FINISHED_SPECTOGRAM = np.empty([0,FRAMES_RANGE], dtype=np.int16) # array to store thespectogram
FRAME               = np.empty([CHUNK], dtype=np.int16) # frames to fill up spectogram

def initialize():
    os.system('amixer -c 1 set Speaker -37db')
    return pyaudio.PyAudio().open(format=FORMAT,
                     channels=CHANNELS,
                     rate=RATE,
                     output=False,
                     input=True,
                     stream_callback=audio_callback)

# Callback on mic input
def audio_callback(in_data, frame_count, time_info, flag):
    global FRAME
    audio_data = np.fromstring(in_data, dtype=np.int16)
    mic_thresh(audio_data)
    FRAME = audio_data #store the new chunk in global array.

    return None, pyaudio.paContinue

# Make threshold for microphone
def mic_thresh(volume):
    if(np.max(volume) > 2000 and not globals.MIC_TRIGGER):
        globals.MIC_TRIGGER = True
        
# Callback on mic input
pre_emphasis = 0.97
NFFT = 512
nfilt = FRAMES_RANGE

def create_mfcc(data):
    frames = np.append(data[0],data[1:] - pre_emphasis * data[:-1])
    frames = frames*np.hamming(len(data))
    mag_frames = np.absolute(np.fft.rfft(frames, NFFT))  # Magnitude of the FFT
    pow_frames = ((1.0 / NFFT) * ((mag_frames) ** 2))  # Power Spectrum
    low_freq_mel = 100
    high_freq_mel = (8000 * np.log10(1 + (RATE / 2) / 700))  # Convert Hz to Mel
    mel_points = np.linspace(low_freq_mel, high_freq_mel, nfilt + 2)  # Equally spaced in Mel scale
    hz_points = (700 * (10**(mel_points / 8000) - 1))  # Convert Mel to Hz
    bin = np.floor((NFFT + 1) * hz_points / RATE)

    fbank = np.zeros((nfilt, int(np.floor(NFFT / 2 + 1))))
    for m in range(1, nfilt + 1):
        f_m_minus = int(bin[m - 1])   # left
        f_m = int(bin[m])             # center
        f_m_plus = int(bin[m + 1])    # right

        for k in range(f_m_minus, f_m):
            fbank[m - 1, k] = (k - bin[m - 1]) / (bin[m] - bin[m - 1])
        for k in range(f_m, f_m_plus):
            fbank[m - 1, k] = (bin[m + 1] - k) / (bin[m + 1] - bin[m])
    filter_banks = np.dot(pow_frames, fbank.T)
    filter_banks = np.where(filter_banks == 0, np.finfo(float).eps, filter_banks)  # Numerical Stability
    filter_banks = 20 * np.log10(filter_banks)  # dB
    filter_banks -= (np.mean(filter_banks, axis=0) + 1e-8)
    #filter_banks = np.abs(filter_banks);
    return filter_banks

# Update spectogram and toogle when ready

def make_spectrogram():
    global RUNNING_SPECTOGRAM, FINISHED_SPECTOGRAM

    if(len(RUNNING_SPECTOGRAM) < SPECTOGRAM_LEN): #see if array is full
        new_array = (create_mfcc(FRAME));
        RUNNING_SPECTOGRAM = np.vstack([new_array,RUNNING_SPECTOGRAM]) #Stack the new sound chunk infront in the specrtogram array.
        connection.send_spectogram(new_array,len(RUNNING_SPECTOGRAM))
        print(len(RUNNING_SPECTOGRAM))

    else:
        FINISHED_SPECTOGRAM = RUNNING_SPECTOGRAM
        RUNNING_SPECTOGRAM= np.empty([0,FRAMES_RANGE], dtype=np.int16)  #remove the oldes chunk
        globals.EXAMPLE_READY = True
        globals.MIC_TRIGGER = False

# Updates and returns the finished spectogram
def get_spectrogram():
    global FINISHED_SPECTOGRAM
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

    def play(self):
        print("playing " + self.name)
        self.player.play(loops=self.loop)

    def stop(self):
        print("stopping " + self.name)
        self.player.stop()
