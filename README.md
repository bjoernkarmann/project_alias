# Project: Alias

[![Build Status](https://travis-ci.org/bjoernkarmann/project_alias.svg?branch=master)](https://travis-ci.org/bjoernkarmann/project_alias)

A open-source hack to train custom wake-up names for smart home devices and block the their build in microphone. 

### Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Setup your raspberry pi

1. Download the latest version of **Raspbian** and flash your micro SD card with **Etcher**

2. Copy the **ssh** and **wpa_supplicant.conf** files to the SD card (boot) 

3. Edit the **wpa_supplicant.conf** to match your wifi settings. Insert the card to the raspberry pi

4. In **terminal** ssh into the pi: ```sudo ssh pi@raspberrypi.local```<br>*Defult password is 'raspberry'. To change password use the 'passwd' command*

5. Update your pi: 
```
sudo apt-get update && sudo apt-get upgrade
```
6. Install **nodejs**: 
```
sudo apt-get install nodejs npm git-core
```



### Installing Alias

Clone and install sound driver for the **ReSpeaker** hat:

```
cd && git clone https://github.com/respeaker/seeed-voicecard.git
cd seeed-voicecard && sudo ./install.sh
```

Clone and install the **Alias** project: 

```
cd && git clone https://github.com/bjoernkarmann/project_alias.git
cd project_alias && sudo npm install
```
Setup a bootscript: 

## Using Alias

Explain how to run the automated tests for this system


```
npm start
```


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

