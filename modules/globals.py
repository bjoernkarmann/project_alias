import os

def initialize():
    global SETTING, RESET, SILENCE,TRIGGERED, GLOW, SPEECH, CONFIG_HAS_CHANGED, STOP_THREAD
    SETTING     = []
    RESET       = False
    SILENCE		= False
    TRIGGERED   = False
    GLOW        = False
    SPEECH      = 0
    CONFIG_HAS_CHANGED = False
    STOP_THREAD = False



    global ROOT_PATH, KEYWORD_PATH, NOISE_PATH, SETTINGS_PATH

    # absolute file paths
    ROOT_PATH        = os.path.dirname(os.path.abspath(__file__))
    KEYWORD_PATH     = os.path.join(ROOT_PATH, '../data/keyphrase.list')
    NOISE_PATH       = os.path.join(ROOT_PATH, '../data/noise.wav')
    SETTINGS_PATH    = os.path.join(ROOT_PATH, '../data/settings.txt')
