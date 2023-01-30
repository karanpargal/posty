# install chrome
apt install -y wget unzip
apt-get install -y tzdata
wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
dpkg -i google-chrome-stable_current_amd64.deb
apt -f install -y

# install chrome driver
CHROME_VERSION=”google-chrome-stable”
CHROME_DRIVER_VERSION=$(wget — no-verbose -O — "https://chromedriver.storage.googleapis.com/LATEST_RELEASE_${CHROME_MAJOR_VERSION}");
echo $CHROME_DRIVER_VERSION
echo "Using chromedriver version: "$CHROME_DRIVER_VERSION
wget — no-verbose -O /tmp/chromedriver_linux64.zip https://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip
rm -rf /opt/selenium/chromedriver
unzip /tmp/chromedriver_linux64.zip -d /opt/selenium
rm /tmp/chromedriver_linux64.zip
mv /opt/selenium/chromedriver /opt/selenium/chromedriver-$CHROME_DRIVER_VERSION
chmod 755 /opt/selenium/chromedriver-$CHROME_DRIVER_VERSION
ln -fs /opt/selenium/chromedriver-$CHROME_DRIVER_VERSION /usr/bin/chromedriver
echo "export PATH=$PATH:/opt/selenium/chromedriver-$CHROME_DRIVER_VERSION" >> ~/.bashrc 
source ~/.bashrc