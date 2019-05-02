# Socket I/O
from flask import Flask, render_template, session, request
from flask_socketio import SocketIO, emit

from modules import globals
from modules import settings

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

def sendMsg(obj):
    socketio.emit('response',obj,namespace='/socket')

@app.route('/')
def index():
    print('Someone Connected!')
    sendMsg(settings.read())
    return render_template('index.html')
