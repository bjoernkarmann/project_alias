import os
def initialize():
    global SETTING, RESULT, BG_EXAMPLES, TR_EXAMPLES, TRAIN, PREDICT, RESET, SILENCE, SPECTOGRAM_FULL, MIC_TRIGGER, EXAMPLE_READY, UPDATE_BG_DATA, BUTTON_PRESSED,HAS_BEEN_TRAINED, TRIGGERED

    SETTING     = []
    RESET       = False
    TRAIN       = False
    PREDICT     = True
    RESULT      = 3
    BG_EXAMPLES = 0
    TR_EXAMPLES = 0
    SILENCE		= False
    SPECTOGRAM_FULL = False
    SPECTOGRAM_FULL_FFT = False
    MIC_TRIGGER = False
    EXAMPLE_READY = False
    UPDATE_BG_DATA = False # Set true to record new examples to background data set
    BUTTON_PRESSED = False
    HAS_BEEN_TRAINED = False
    TRIGGERED = False

    global ROOT_PATH, KEYWORD_PATH, NOISE_PATH, SETTINGS_PATH

    # absolute file paths
    ROOT_PATH        = os.path.dirname(os.path.abspath(__file__))
    KEYWORD_PATH     = os.path.join(ROOT_PATH, '../data/keyphrase.list')
    NOISE_PATH       = os.path.join(ROOT_PATH, '../data/noise.wav')
    SETTINGS_PATH    = os.path.join(ROOT_PATH, '../data/settings.txt')
