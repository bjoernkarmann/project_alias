# Project Alias

<p float="left">
<img src="imgs/alias.jpg" width="49%"> <img src="imgs/short_alias_explained.gif" width="49%">
</p>

[![Python 3.6](https://img.shields.io/badge/python-3.6-blue.svg)](https://www.python.org/downloads/release/python-360/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Project Alias is an open-source parasite to hack smart home devices. Train custom wake-up names and commands for your devices while disturbing their built-in microphone with noise. Introduce false labelling to their algorithm by changing gender or nationality. Read more about the project **[here](http://bjoernkarmann.dk/project_alias)**.

 
```diff
- WARNING:
- V2.0 is work in progress and will be updated soon!
```

This repository has been updated to 2.0. Find the old version **[here](http://bjoernkarmann.dk/project_alias)**.

### 2.0 Features
- Multiple trigger words
- Custom whisper commands
- New and better word detection
- Change gender
- Change language
- Adjust trigger sensitivity and delay

### Build Guide
For the complete step-by-step guide and 3D files see our **[Instructables](https://www.instructables.com/id/Project-Alias)**.

### Easy Setup 🔧
We have made the setup even easier with a SD-card clone of our working Alias.
1. **[Download]()** the latest .img file
2. Use **[Etcher](https://etcher.io/)** to flash a micro SD card with the .img file.
3. Insert the micro SD card into the Raspberry Pi A+.
4. Log on to the wifi name **"Project Alias"** and open the browser.

*We recommend to use the Easy Setup but if you wish to install the project from scratch use the [Raspberry Pi Setup]() instrucrtions.*

### Using Alias 🍄
1. To start using Alias, log on the wifi network called "Project Alias" with any device.

2. Rename

3. Under the menu, click **Train Alias** and wait a few seconds for the model to learn the name. This name does not necessarily need to be a word but can be a sound and any language. So be creative! You can always reset your name on the menu. *Tip: it helps to record the name from different locations in your home.*

4. Try it out! Say the name and ask your question once you see a blue light on the device or on your phone.
Note: once trained there is no need to have the phone connected anymore.

*If you find Alias is not responding correctly, try to train a few more examples. Or if you find Alias is triggering to often, you can go to the menu and turn background sound ON. This toggles the background mode and adds any new recordings to the background examples. Record and train just as before, but try to capture unique sounds in your environment or even words that sound similar to your chosen name.*

### Settings ⚙️

Setting | Description | Default
--- | --- | ---
Noise | This will turn on/off the looping noise| `ON`
Gender | -- | `Female`
Language | Change the language Alias uses to | `English`
Volume | Change the volume of the speakers. This needs to be heigh enough for the noise to block the assistant, but low enough not to be audible. | `10`
Sensitivity | This setting changes the sensitivity of the word detection. The lower the number the less sensitive. This setting can be helpful for short words. | `3`
Noise Delay | This increase the delay after from the trigger word to the restart of the noise. This is used as a noise free window, when asking the assistant a equation. | `10s`


### Raspberry Pi Setup

How to prepare and setup a Raspberry Pi for this project:

1. Download the latest version of [Raspbian](https://www.raspberrypi.org/downloads/raspbian/) and flash your micro SD card with [Etcher](https://etcher.io/)

2. Copy the **ssh** and **wpa_supplicant.conf** files from the [setup folder](setup/) to the SD card (boot)


3. Edit the **wpa_supplicant.conf** in a text editor to match your wifi settings. Insert the card to the raspberry pi


4. In terminal ssh into the pi: ```sudo ssh pi@raspberrypi.local```<br>*Default password is 'raspberry'. To change password use the 'passwd' command*

5. Update the pi: ```sudo apt-get update && sudo apt-get upgrade```<br>

7. Reboot ```sudo reboot```


#### Installing


On the Rapsberry Pi: clone and install the sound driver for the [ReSpeaker](http://wiki.seeedstudio.com/ReSpeaker_2_Mics_Pi_HAT/) hat:<br>
*This is only required when using the ReSpeaker hat, this code will also work with other sound drivers.*

```
cd && git clone https://github.com/respeaker/seeed-voicecard.git
cd seeed-voicecard && sudo ./install.sh
```

Install **Tensorflow** and **Keras**:

```
sudo apt-get install python3-dev python3-pip git libatlas-base-dev
sudo pip3 install tensorflow keras
```

Install the required modules:

```
sudo apt-get install python3-numpy python3-spidev python-h5py
sudo apt-get install python3-pyaudio libsdl-ttf2.0-0 python3-pygame
sudo pip3 install flask flask_socketio python_speech_features
```

Clone the **Alias** project:

```
git clone https://github.com/bjoernkarmann/project_alias.git
```

Setup a bootscript. Open this file:

```
sudo nano /etc/rc.local
```
 and add at the end of the command just before **exit 0**, like:

```
cd project_alias && python3 app.py &
```
Now reboot the Pi to test it:

```
sudo reboot
```

## Calibration

- If you are using a **Amazon Alexa**, please change line 21 in **app.py** to: ```wakeup = sound.audioPlayer("data/alexa.wav",0,"wakeup", False)```

- To set the volume of the speaker you can change the line 32 in **modules/sound.py** ```os.system('sudo amixer -c 1 sset Speaker 83')```

## Contributors
Made by [Bjørn Karmann](http://bjoernkarmann.dk) and [Tore Knudsen](http://www.toreknudsen.dk/).


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
