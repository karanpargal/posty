#!/bin/bash


CHROME_VERSION="google-chrome-stable"
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update -qqy \
  && apt-get -qqy install \
    ${CHROME_VERSION:-google-chrome-stable} \
  && rm /etc/apt/sources.list.d/google-chrome.list \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

#=================================
# Chrome Launch Script Wrapper
#=================================
WRAPPER_PATH=$(readlink -f /usr/bin/google-chrome)
BASE_PATH="$WRAPPER_PATH-base"
mv "$WRAPPER_PATH" "$BASE_PATH"

cat > "$WRAPPER_PATH" <<_EOF
#!/bin/bash
# umask 002 ensures default permissions of files are 664 (rw-rw-r--) and directories are 775 (rwxrwxr-x).
umask 002
# Note: exec -a below is a bashism.
exec -a "\$0" "$BASE_PATH" --no-sandbox "\$@"
_EOF
chmod +x "$WRAPPER_PATH"

# Debian/Ubuntu seems to not respect --lang, it instead needs to be a LANGUAGE environment var
# See: https://stackoverflow.com/a/41893197/359999
for var in "$@"; do
   if [[ $var == --lang=* ]]; then
      export LANGUAGE=${var//--lang=}
   fi
done

#============================================
# Chrome webdriver
#============================================
# can specify versions by CHROME_DRIVER_VERSION
# Latest released version will be used by default
#============================================
CHROME_DRIVER_VERSION=$(google-chrome --version | sed -E "s/.* ([0-9]+)(\.[0-9]+){3}.*/\1/")
curl -ls https://chromedriver.storage.googleapis.com/LATEST_RELEASE_${CHROME_DRIVER_VERSION}
echo "Using chromedriver version: "$CHROME_DRIVER_VERSION \
  && wget --no-verbose -O /tmp/chromedriver_linux64.zip https://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip \
  && rm -rf /opt/selenium/chromedriver \
  && unzip /tmp/chromedriver_linux64.zip -d /opt/selenium \
  && rm /tmp/chromedriver_linux64.zip \
  && mv /opt/selenium/chromedriver /opt/selenium/chromedriver-$CHROME_DRIVER_VERSION \
  && chmod 755 /opt/selenium/chromedriver-$CHROME_DRIVER_VERSION \
  && sudo ln -fs /opt/selenium/chromedriver-$CHROME_DRIVER_VERSION /usr/bin/chromedriver


#============================================
# Dumping Browser name and version for config
#============================================
echo "chrome" > /opt/selenium/chromedriver-$CHROME_DRIVER_VERSION

# Set chrome driver in path
export PATH=$PATH:/opt/selenium/chromedriver-$CHROME_DRIVER_VERSION