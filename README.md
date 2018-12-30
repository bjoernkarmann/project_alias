# Project: Alias

![alt text](imgs/short_alias_explenation.gif)

[![Build Status](https://travis-ci.org/bjoernkarmann/project_alias.svg?branch=master)](https://travis-ci.org/bjoernkarmann/project_alias)
[![Python 3.6](https://img.shields.io/badge/python-3.6-blue.svg)](https://www.python.org/downloads/release/python-360/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*Project Alias is a open-source parasite to train custom wake-up names for smart home devices while disturbing the their build in microphone.* 

# Requirements

- Raspberry Pi A+
- ReSpkeaker hat
- Tiny speakers


*NOTE: for best results use...*

# Raspberry Pi Setup 🔧
How to prepare and setup a Raspberry Pi for this project:

1. Download the latest version of [Raspbian](https://www.raspberrypi.org/downloads/raspbian/) and flash your micro SD card with [Etcher](https://etcher.io/)

2. Copy the **ssh** and **wpa_supplicant.conf** files from the [setup folder](setup/) to the SD card (boot) 

3. Edit the **wpa_supplicant.conf** in a text editor to match your wifi settings. Insert the card to the raspberry pi

4. In terminal ssh into the pi: ```sudo ssh pi@raspberrypi.local```<br>*Defult password is 'raspberry'. To change password use the 'passwd' command*

5. Update the pi: ```sudo apt-get update && sudo apt-get upgrade```<br>

7. Reboot ```sudo reboot```


# Installing 

Install all the required software in one go with this command:

```
sudo apt-get install python3-dev python3-pip git libatlas-base-dev  
```

Clone and install the sound driver for the [ReSpeaker](http://wiki.seeedstudio.com/ReSpeaker_2_Mics_Pi_HAT/) hat and reboot.<br>
*This is only required when using the ReSpeaker hat, this code will also work with other sound drivers.*

```
cd && git clone https://github.com/respeaker/seeed-voicecard.git
cd seeed-voicecard && sudo ./install.sh
```

Clone the **Alias** project: 

```
git clone https://github.com/bjoernkarmann/project_alias.git
cd project_alias
pip install -r requirements.txt
```

Setup a bootscript. Open this file:

```
sudo nano /etc/rc.local
```

# Use Alias 🍄

Explain how to run the automated tests for this system

Open a browser on your phone and go to ```raspberrypi.local:5050```


## Contributers
Made with love by [Bjørn Karmann](http://bjoernkarmann.dk) and [Tore Knudsen](). 


## License 

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

