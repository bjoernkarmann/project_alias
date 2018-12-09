import pyaudio
import wave
import sys
import numpy as np
 
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
CHUNK = 1024
STEPS_PR_SECOND = np.floor((RATE / CHUNK))
RECORD_SECONDS = 60	
audio = pyaudio.PyAudio()
secCount = 0

try:
    WAVE_OUTPUT_FILENAME = sys.argv[1] + ".wav"
    print(len(WAVE_OUTPUT_FILENAME))
except:
    print("you must give the file a name as an argument to the sound-recorder.py file")
 
# start Recording
stream = audio.open(format=FORMAT, channels=CHANNELS,
                rate=RATE, input=True,
                frames_per_buffer=CHUNK)
print("recording")
frames = []
 
for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
    data = stream.read(CHUNK)
    frames.append(data)
    if i % STEPS_PR_SECOND == 0:
    	secCount += 1
    	print("recording for %d" %secCount)
print("finished recording")
 
 
# stop Recording
stream.stop_stream()
stream.close()
audio.terminate()
 
waveFile = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
waveFile.setnchannels(CHANNELS)
waveFile.setsampwidth(audio.get_sample_size(FORMAT))
waveFile.setframerate(RATE)
waveFile.writeframes(b''.join(frames))
waveFile.close()