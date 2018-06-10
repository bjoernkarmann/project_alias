# Project: Alias

*A trainable parasite for the surveillance age.*

<span style="color:red;">**IMPORTANT! THIS PROJECT IS STILL UNDER CONSTRUCITON!**</span>

[![Build Status](https://travis-ci.org/bjoernkarmann/project_alias.svg?branch=master)](https://travis-ci.org/bjoernkarmann/project_alias)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/project_alias)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


Project Alias is a open-source parasite to train custom wake-up names for smart home devices while disturbing the their build in microphone. This node app is a sound classifier running on a raspberry pi zero and can be trained from a web-app.

# Requirements

- Raspberry Pi zero W
- ReSpkeaker hat
- Tiny speakers


*NOTE: for best results use...*
 
# Setup 🔧
How to prepare and setup a raspberry pi zero for this project. 

1. Download the latest version of [Raspbian](https://www.raspberrypi.org/downloads/raspbian/) and flash your micro SD card with [Etcher](https://etcher.io/)

2. Copy the **ssh** and **wpa_supplicant.conf** files from the **setup folder** to the SD card (boot) 

3. Edit the **wpa_supplicant.conf** in a text editor to match your wifi settings. Insert the card to the raspberry pi

4. In terminal ssh into the pi: ```sudo ssh pi@raspberrypi.local```<br>*Defult password is 'raspberry'. To change password use the 'passwd' command*

5. Update the pi: ```sudo apt-get update && sudo apt-get upgrade```<br>

6. Install **nodejs** : ```sudo apt-get install nodejs npm git-core```<br>

7. Reboot ```sudo reboot```

*Optional:* install nettalk for easy file sharing ```sudo apt-get install netatalk```<br>



# Installing 

Clone and install the sound driver for the [ReSpeaker](http://wiki.seeedstudio.com/ReSpeaker_2_Mics_Pi_HAT/) hat and reboot.<br>
*This is only required when using the ReSpeaker hat, this code will also work with other sound drivers.*

```
cd && git clone https://github.com/respeaker/seeed-voicecard.git
cd seeed-voicecard && sudo ./install.sh
```

Install the **Alias** project: 

```
npm i project_alias
```

Setup a bootscript. Open this file:

```
sudo nano /etc/rc.local
```

# Use Alias 🍄

Explain how to run the automated tests for this system

Open a browser on your phone and go to ```raspberrypi.local:8000```


## Contributers
Made with love by [Bjørn Karmann](http://bjoernkarmann.dk) and [Tore Knudsen](). 


## License 

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

