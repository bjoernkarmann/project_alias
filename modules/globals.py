def initialize():
    global RESULT, BG_EXAMPLES, TR_EXAMPLES, TRAIN, PREDICT, RESET, SILENCE, SPECTOGRAM_FULL, MIC_TRIGGER, EXAMPLE_READY, UPDATE_BG_DATA, BUTTON_PRESSED,HAS_BEEN_TRAINED, TRIGGERED

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
