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