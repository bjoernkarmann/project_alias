#!/bin/bash

echo ""
echo "# Upgrade before start"
echo ""
sudo apt update -y -qq
sudo apt ugprade -y -qq

echo ""
echo "# Enable SPI module"
echo ""
sudo sed -i "s/#dtparam=spi/dtparam=spi/g" /boot/config.txt

echo ""
echo "# Install python basic tools"
echo ""
sudo apt install -qq -y python3-dev python3-pip git libatlas-base-dev

echo ""
echo "# Install ReSpeaker driver"
echo ""
cd $HOME
git clone https://github.com/respeaker/seeed-voicecard.git
cd seeed-voicecard
sudo ./install.sh

echo ""
echo "# Disable default soundcard"
echo ""
echo "blacklist snd_bcm2835" | sudo tee -a /etc/modprobe.d/alsa-blacklist.conf

echo ""
echo "# Installing python dependencies"
echo ""
sudo pip3 install spidev
sudo apt install -y -qq python python-dev python-pip build-essential swig git libpulse-dev libasound2-dev pulseaudio pulseaudio-utils libpulse-dev libpulse-java libpulse0
sudo pip3 install --upgrade pocketsphinx

echo ""
echo "# Install espeak"
echo ""
sudo apt -y -qq install espeak

echo ""
echo "# Install flask"
echo ""
sudo pip3 install flask flask_socketio

echo ""
echo "# Install pygame"
echo ""
sudo apt install -y -qq python3-pygame

echo ""
echo "# Clone project_alias repository"
echo ""
cd $HOME
git clone --single-branch --branch fix-google-tts https://github.com/alefnode/project_alias.git
cd project_alias

echo ""
echo "# Change alias service and install on systemd"
echo ""
sudo cp alias.service /lib/systemd/system/
sudo systemctl enable alias.service
echo ""
echo "####################"
echo "# Executing REBOOT #"
echo "####################"
echo ""
sudo reboot


