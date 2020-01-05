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

import json
from modules import globals

def write(data):
    with open(globals.SETTINGS_PATH, 'w') as outfile:
        json.dump(data, outfile)


def read():
    with open(globals.SETTINGS_PATH) as json_file:
        data = json.load(json_file)
        globals.SETTING = data
        return data

# get setting and write names into keyphrase.list file
def updateServer(data):
    print(data)
    #sensitivity = data['setting']['sensitivity'] # 0 - 10

    with open(globals.KEYWORD_PATH, 'w') as f:
        for item in data['keyphrase']:
            #threshold = int(mapF(len(item['name']),4, 15, 0 , 30)) + int(sensitivity)
            keyphrase = item['name'] + " /1e-" + str(item['sensitivity']) + "/"
            keyphrase = keyphrase.lower()
            f.write("%s\n" % keyphrase)

def mapF(x, in_min, in_max, out_min, out_max):
    return (x - in_min) * (out_max - out_min) / (in_max-in_min) + out_min;
