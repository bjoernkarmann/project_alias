"""
Project Alias - Rename your assistant and makes sure it never listens.
Copyright (C) 2020  Bjørn Karmann & Tore Knudsen

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
"""

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



    global ROOT_PATH, KEYWORD_PATH, NOISE_PATH, OKGOOGLE_PATH, ALEXA_PATH, SETTINGS_PATH

    # absolute file paths
    ROOT_PATH        = os.path.dirname(os.path.abspath(__file__))
    KEYWORD_PATH     = os.path.join(ROOT_PATH, '../data/keyphrase.list')
    NOISE_PATH       = os.path.join(ROOT_PATH, '../data/noise.wav')
    OKGOOGLE_PATH    = os.path.join(ROOT_PATH, '../data/ok_google.wav')
    ALEXA_PATH       = os.path.join(ROOT_PATH, '../data/alexa.wav')
    SETTINGS_PATH    = os.path.join(ROOT_PATH, '../data/settings.txt')
