import numpy as np
import time
from PIL import Image
from threading import Thread

# Socket I/O
from flask import Flask, render_template, session, request
from flask_socketio import SocketIO, emit

# Audio
import pyaudio
import matplotlib.pyplot as plt
import librosa
import librosa.display
import wave

# Keras
import keras
from keras import backend as K
from keras.layers.core import Dense
from keras.optimizers import Adam
from keras.metrics import sparse_categorical_crossentropy
from keras.preprocessing import image
from keras.models import Model
from keras.models import Sequential
from keras.layers import Dense, Activation, Flatten, Input


# Audio settings
#====================================================#
CHUNK           = 1024
FORMAT          = pyaudio.paInt16 #paFloat32
CHANNELS        = 1
RATE            = 44100
WAVE_FILENAME   = 'file.wav'
RECORD_SECONDS  = 2
#FRAMES_RANGE   = int(RATE / xCHUNK * RECORD_SECONDS)
FRAMES_RANGE    = 100
FRAMES          = [] # frames to fill up spectogram
pa              = pyaudio.PyAudio()
spectogram      = []

# Classifier settings
#====================================================#
NUM_CLASSES     = 2
LEARNING_RATE   = 0.0001
EPOCHS          = 10
BATCH_SIZE      = 16
DENSE_UNITS     = 100
TRAINING_DATA   = [] # XS Example array to be trained
TRAINING_LABELS = [] # YS Label array
predict         = False
train           = False
result          = None

# Socket I/O
#====================================================#
PORT            = 5000
HOST            = '0.0.0.0'
app             = Flask(__name__)
app.debug       = True
socketio        = SocketIO(app, async_mode='threading')
socket_thread   = None


# Functions
#====================================================#
def audio_callback(in_data, frame_count, time_info, flag):
    # triggers when resiving an audio chunk
    FRAMES.append(in_data)
    if len(FRAMES) > FRAMES_RANGE:
        del FRAMES[0] # delete oldest frame
    return None, pyaudio.paContinue

def create_spectogram():
    # creates a temp wav file and joins frames into a spectogram
    waveFile = wave.open(WAVE_FILENAME, 'wb')
    waveFile.setnchannels(CHANNELS)
    waveFile.setsampwidth(pa.get_sample_size(FORMAT))
    waveFile.setframerate(RATE)
    waveFile.writeframes(b''.join(FRAMES)) # joins all the recordings
    waveFile.close()

    # load wav file into librosa
    y, sr = librosa.load(WAVE_FILENAME)
    S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=125)
    log_S = librosa.amplitude_to_db(S, ref=np.max)
    return log_S

def prepare_frame(spectogram):
    # convert array to image and ready for keras
    img = Image.fromarray(spectogram, 'RGB')
    img = img.resize((125,125))
    img_array = np.array(img)
    img_array_extended = np.expand_dims(img_array, axis=0).astype('float32')
    return img_array_extended

def addExample(example, label):
    # add examples to training dataset
    encoded_y = keras.utils.np_utils.to_categorical(label,num_classes=NUM_CLASSES) # make one-hot
    TRAINING_LABELS.append(encoded_y[0])
    TRAINING_DATA.append(example[0])
    print('add example for label %d'%label)

def createModel():
    # create a keras classifier
    model = Sequential()
    model.add(Flatten(input_shape = (125, 125, 3))) # should be (7,7,256)
    model.add(Dense(units = DENSE_UNITS, activation = 'relu', use_bias = True))
    model.add(Dense(units = NUM_CLASSES, activation = 'softmax', use_bias = False)) # NUMBER OF CLASSES
    return model

# this thread is running in the background sending data to the client when connected
def response_thread():
     print 'In background_stuff'

     while True:
         spectogram = prepare_frame(create_spectogram())
         socketio.sleep(0.5)
         socketio.emit('response', {'data': len(FRAMES)}, namespace='/socket')
         socketio.emit('response', {'data': spectogram}, namespace='/socket')

@app.route('/')
def index():
    print('Someone Connected!')
    global socket_thread
    if socket_thread is None:
        socket_thread = Thread(target=response_thread)
        socket_thread.start()
    return render_template('index.html')


@socketio.on('msgEvent', namespace='/socket')
def test_message(message):
    msg = message['data']
    global train
    global predict

    # make sure the spectogram is full before resiving commands
    if len(FRAMES) >= FRAMES_RANGE:

        if('class0' in msg):
            addExample(prepare_frame(create_spectogram()), 0)
            emit('response', {'data': 'Example added to 0'})

        if('class1' in msg):
            addExample(prepare_frame(create_spectogram()), 1)
            emit('response', {'data': 'Example added to 1'})

        if('train' in msg):
            predict = False
            train = True
            print('start training')
    else:
        emit('response', {'data': 'Setting up'})

# Main thread
def main_thread():

    # Create a keras model
    model = createModel()
    model.compile(optimizer= 'adam',
                  loss= 'categorical_crossentropy',
                  metrics = ['accuracy'])

    while stream.is_active():
        global predict
        global result
        global train



        if train is True:
            model.fit(np.array(TRAINING_DATA),
                      np.array(TRAINING_LABELS),
                      epochs=EPOCHS,
                      batch_size=BATCH_SIZE)
            train = False
            predict = True

        if predict is True:
            prediction = model.predict(spectogram)
            result = np.argmax(prediction)
            print(result)

#====================================================#

# Start audio stream
stream = pa.open(format=FORMAT,
                 channels=CHANNELS,
                 rate=RATE,
                 output=False,
                 input=True,
                 stream_callback=audio_callback)
stream.start_stream() # start stream

# Setup and start main thread
thread = Thread(target=main_thread)
thread.daemon = True
thread.start()

# Start socket io
if __name__ == '__main__':
    socketio.run(app, host=HOST, port=PORT, debug=False)

stream.close()
pa.terminate()
