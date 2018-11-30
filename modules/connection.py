# Socket I/O
from flask import Flask, render_template, session, request
from flask_socketio import SocketIO, emit

from modules import globals
from threading import Thread
from modules import sound

import numpy as np
import json
import logging

# Socket I/O
#====================================================#
PORT            = 5050
HOST            = '0.0.0.0'
app             = Flask(__name__)
app.debug       = False
socketio        = SocketIO(app, async_mode='threading', logger=False)
socket_thread   = None

logging.getLogger('werkzeug').setLevel(logging.ERROR) # remove socket io logs

# this thread is running in the background sending data to the client when connected
def response_thread():
    print("nothing")
     #while True:

def send_spectogram(data, row):
    spec_as_list = data.tolist() # convert from numpy to regular list
    spec_to_server = json.dumps(spec_as_list) # convert list to json format
    socketio.emit('sound', {'spectogram': spec_to_server,'count': row},namespace='/socket')

def send_response():
    socketio.emit('response',{
                    'result'         : globals.RESULT,
                    'bg_examples'    : globals.BG_EXAMPLES,
                    'tr_examples'    : globals.TR_EXAMPLES,
                    'train_state'    : globals.TRAIN,
                    'predict_state'  : globals.PREDICT,
                    'reset_state'    : globals.RESET,
                    'hasbeentrained' :globals.HAS_BEEN_TRAINED,
                    'triggered'      :globals.TRIGGERED
                    },namespace='/socket')

@app.route('/')
def index():
    print('Someone Connected!')
    global socket_thread
    if socket_thread is None:
        socket_thread = Thread(target=response_thread)
        socket_thread.start()
        send_response()
    return render_template('index.html')
