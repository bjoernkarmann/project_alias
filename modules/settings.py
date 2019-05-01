import json
from modules import globals

def write(data):
    with open('data/settings.txt', 'w') as outfile:
        json.dump(data, outfile)


def read():
    with open('data/settings.txt') as json_file:
        data = json.load(json_file)
        globals.SETTING = data
        return data

# get setting and write names into keyphrase.list file
def updateKeyphrase(data):
    print(data)
    with open('data/keyphrase.list', 'w') as f:
        for item in data['setting']:
            threshold = int(mapF(len(item['name']),0,15,1,30))
            keyphrase = item['name'] + " /1e-" + str(threshold) + "/"
            keyphrase = keyphrase.lower()
            f.write("%s\n" % keyphrase)


def mapF(x,in_min, in_max, out_min, out_max):
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
