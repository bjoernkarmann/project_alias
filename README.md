# Project: Alias

*A trainable parasite for the surveillance age.*

<span style="color:red;">**IMPORTANT! THIS PROJECT IS STILL UNDER CONSTRUCITON!**</span>

[![Build Status](https://travis-ci.org/bjoernkarmann/project_alias.svg?branch=master)](https://travis-ci.org/bjoernkarmann/project_alias)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/project_alias)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


Project Alias is a open-source parasite to train custom wake-up names for smart home devices while disturbing the their build in microphone. 

# Requirements

- Raspberry Pi A+
- ReSpkeaker hat
- Tiny speakers


*NOTE: for best results use...*

# Setup 
First we need to setup a Raspberry Pi. You can use this easy [setup guide](https://github.com/bjoernkarmann/RPI-Setup) to prepare your Raspberry Pi.  


# Installing 

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

Open a browser on your phone and go to ```raspberrypi.local:8000```


## Contributers
Made with love by [Bjørn Karmann](http://bjoernkarmann.dk) and [Tore Knudsen](). 


## License 

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

