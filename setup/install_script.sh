#!/bin/bash


# Check if cloned repository is in correct PATH
SCRIPT=`realpath $0`
SCRIPTPATH=`dirname $SCRIPT`
if [[ "$SCRIPTPATH" != "$HOME/project_alias/setup" ]]; then
    GIT_PATH=$(echo $SCRIPTPATH | sed "s/\/setup//g")
    echo ""
    echo "########################"
    echo "Incorrect Git clone PATH"
    echo "Actual: $GIT_PATH"
    echo "Should be: $HOME/project_alias"
    echo "########################"
    echo ""
    exit 1
fi


echo ""
echo "# Upgrade before start"
echo ""
sudo apt update -y -q
sudo apt upgrade -y -q

echo ""
echo "# Enable SPI module"
echo ""
sudo sed -i "s/#dtparam=spi/dtparam=spi/g" /boot/config.txt

echo ""
echo "# Enable pi user console autologin (needed to communicate to dbus)"
echo ""
sudo systemctl set-default multi-user.target
sudo ln -fs /lib/systemd/system/getty@.service /etc/systemd/system/getty.target.wants/getty@tty1.service
sudo bash -c 'cat > /etc/systemd/system/getty@tty1.service.d/autologin.conf << EOF
[Service]
ExecStart=
ExecStart=-/sbin/agetty --autologin pi --noclear %I \$TERM
EOF'

echo ""
echo "# Install python basic tools"
echo ""
sudo apt install -q -y python3-dev python3-pip git libatlas-base-dev

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
sudo apt install -y -q python python-dev python-pip build-essential swig git libpulse-dev libasound2-dev pulseaudio pulseaudio-utils libpulse-dev libpulse-java libpulse0
sudo pip3 install --upgrade pocketsphinx

echo ""
echo "# Install espeak"
echo ""
sudo apt -y -q install espeak

echo ""
echo "# Install flask"
echo ""
sudo pip3 install flask flask_socketio

echo ""
echo "# Install pygame"
echo ""
sudo apt install -y -q python3-pygame

echo ""
echo "# Change alias service and install on systemd"
echo ""
cd $HOME/project_alias
sudo cp alias.service /lib/systemd/system/
sudo systemctl enable alias.service
echo ""
echo "####################"
echo "# Executing REBOOT #"
echo "####################"
echo ""
sudo reboot


