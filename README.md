# Project Alias

<p float="left">
<img src="imgs/alias.jpg" width="49%"> <img src="imgs/short_alias_explained.gif" width="49%">
</p>

[![Python 3.6](https://img.shields.io/badge/python-3.6-blue.svg)](https://www.python.org/downloads/release/python-360/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


Project Alias is an open-source parasite to train custom wake-up names for smart home devices while disturbing their built-in microphone. Read more about the project [here](http://bjoernkarmann.dk/project_alias).

<p style='color:red'>NOTE: this project is experimental and still in development.</p>


## Build Guide


For the complete step-by-step guide and 3D files see our [Instructables](https://www.instructables.com/id/Project-Alias).


## Raspberry Pi Setup 🔧

How to prepare and setup a Raspberry Pi for this project:

1. Download the latest version of [Raspbian](https://www.raspberrypi.org/downloads/raspbian/) and flash your micro SD card with [Etcher](https://etcher.io/)

2. Copy the **ssh** and **wpa_supplicant.conf** files from the [setup folder](setup/) to the SD card (boot) 


3. Edit the **wpa_supplicant.conf** in a text editor to match your wifi settings. Insert the card to the raspberry pi


4. In terminal ssh into the pi: ```sudo ssh pi@raspberrypi.local```<br>*Default password is 'raspberry'. To change password use the 'passwd' command*

5. Update the pi: ```sudo apt-get update && sudo apt-get upgrade```<br>

7. Reboot ```sudo reboot```


## Installing 


### Necessary Software
* [SD Memory Card Formatter](https://www.sdcard.org/downloads/formatter/index.html "SD's Download Page")
* [BalenaEtcher](https://www.balena.io/etcher/ "Balena Etcher Download Link")


### Instructions
1. Reformat your memory card with the formatting software in the `FAT32` or `FAT` format using the downloaded SD Memory Card Formatter software.
2. Download the `2018-11-13-raspbian-stretch.img` image of [Raspbian Stretch](https://howchoo.com/g/nzc0yjzjy2u/raspbian-stretch-download) from the link and flash it onto your memory card using the downloaded BalenaEtcher software.

3. Download the project's `setup` folder from the repo.
4. Add your network information into the `wpa_supplicant.conf` file.
5. Move `ssh` and `wpa_supplicant.conf` to the RPi.

6. Insert your memory card into your RaspberryPi (RPi).
7. Login to the RPi using `sudo ssh pi@raspberrypi.local`. The password will be `rapsberry`.
8. `sudo apt-get update && sudo apt-get upgrade`.
9. Reboot your raspberrypi using `sudo reboot` and `ssh` back into the RPi once it's done rebooting.
10. `cd && git clone https://github. com/respeaker/seeed-voicecard. git`.
11. `cd seeed-voicecard && sudo ./install.sh`.

Installing the packages was the most difficult part. This order worked for me, especially using the provided wheels. Some of the non-wheel installations might fail once but work on the second try.

12. `sudo apt-get install python3-dev python3-pip git libatlas-base-dev`.
13. `sudo apt-get install python3-numpy python3-spidev python-h5py`.
14. `sudo apt-get install python3-pyaudio libsdl-ttf2. 0-0 python3-pygame`.
15. `sudo pip3 install --no-cache-dir protobuf`.
16. `sudo apt-get install urllib3`.
17. `sudo pip3 flask flask_socketio python_speech_features`.
18. Using the tensorboard file provided at `/installation/tensorboard-1.12.0-py3-none-any.whl` execute the following command replacing the bracketed part with the file's path `sudo pip3 install {provided tensorboard wheel file}`.
19. Using the tensorflow file provided at `/installation/tensorflow-1.14.0-cp36-none-linux_armv7l.whl` execute the following command replacing the bracketed part with the file's path `sudo pip3 install --no-cache-dir {provided tensorflow wheel file}`.
20. Using the scipy file provided at `/installation/scipy-1.3.3-cp35-cp35m-linux_armv7l.whl` execute the following command replacing the bracketed part with the file's path `sudo pip3 install {provided scipy wheel file}`.
21. `sudo pip3 install keras`.
22. Reboot your raspberrypi using `sudo reboot` and `ssh` back into the RPi once it's done rebooting.
23. `git clone https://github.com/bjoernkarmann/project_alias.git`.
24. Open the bootscript file with `sudo nano /etc/rc.local` and add the line `cd project_alias && python3 /home/pi/project_alias/app.py` immediately before the `exit 0` line.

We'll need to fix the permissions of the files to make sure they execute after booting.

25. `sudo chmod 755 project_alias/app.py`.
26. `sudo cdmod 755 /etc/rc.local`.

At this point, reboot your RPi. If everything worked, then the project should start right up.

Requirements files are provided in the `installaiton` directory and are separated by `pip` and `apt` packages.



## Training Alias 🍄



1. To train Alias use the browser on your phone and open ```raspberrypi.local:5050```

2. Hold down the record button while saying the new name about 4-6 times. A small bar should indicate the 2 seconds recording window. Each name should fit within this timeframe.

3. Under the menu, click **Train Alias** and wait a few seconds for the model to learn the name. This name does not necessarily need to be a word but can be a sound and any language. So be creative! You can always reset your name on the menu. *Tip: it helps to record the name from different locations in your home.*

4. Try it out! Say the name and ask your question once you see a blue light on the device or on your phone. 
Note: once trained there is no need to have the phone connected anymore. 

*If you find Alias is not responding correctly, try to train a few more examples. Or if you find Alias is triggering to often, you can go to the menu and turn background sound ON. This toggles the background mode and adds any new recordings to the background examples. Record and train just as before, but try to capture unique sounds in your environment or even words that sound similar to your chosen name.*

## Calibration 

- If you are using a **Amazon Alexa**, please change line 21 in **app.py** to: ```wakeup = sound.audioPlayer("data/alexa.wav",0,"wakeup", False)```

- To set the volume of the speaker you can change the line 32 in **modules/sound.py** ```os.system('sudo amixer -c 1 sset Speaker 83')``` 

## Get Involved!
We are both Interaction Designers, Makers and strong believers in privacy but no experts when it comes to Speech Recognition software. If you are interested in getting involved in version 2.0 please let us know!

## Contributors
Made by [Bjørn Karmann](http://bjoernkarmann.dk) and [Tore Knudsen](http://www.toreknudsen.dk/). 


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

