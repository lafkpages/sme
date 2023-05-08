#!/bin/bash

# Directory to store builds
BUILD_DIR="dist"

# File name of build
BUILD_FILE="scriptlet.js"

# Temporary file to use for building
TMP_BUILD_FILE=".temp.scriptlet.js"

MINIFY="0"

# Make folder if no existy
if [ ! -d "$BUILD_DIR" ]; then
  echo -n "Making build dir... "
  mkdir "$BUILD_DIR"
  echo "done"
fi

# Delete previous builds
echo -n "Removing old builds... "
rm -rf "$BUILD_DIR"/{*,.*} 2>/dev/null
echo "done"

# Build!
echo -n "Building... "
cat > "$BUILD_DIR/$TMP_BUILD_FILE" <<- EOM
(() => {
EOM
cat encoders.js >> "$BUILD_DIR/$TMP_BUILD_FILE"
cat >> "$BUILD_DIR/$TMP_BUILD_FILE" <<- EOM

  // Inject top right SME notif
  const div = document.createElement('div');
  div.id = 'sme-inject-notif';
  div.style.position = 'fixed';
  div.style.top = '20px';
  div.style.right = '20px';
  div.style.padding = '10px';
  div.style.zIndex = '99999';
  div.style.background = 'wheat';
  div.style.border = '1px solid black';
  div.style.borderRadius = '5px';
  div.style.transition = 'transform 0.5s ease-in-out 0s';
  div.style.transform = 'translateY(-100px)';
  document.body.appendChild(div);

  // Check for selected SME text
  setInterval(() => {
    const selectedText = window.getSelection().toString();
    let decodedSecret = null;

    if (selectedText) {
      try {
        decodedSecret = decodeSecret(selectedText);
      } catch {
        
      }
    }

    if (decodedSecret) {
      div.style.transform = 'translateY(0px)';
      div.textContent = decodedSecret;
    } else {
      div.style.transform = 'translateY(-100px)';
    }
  }, 1000);
})();
EOM
echo "done"

# Minify
if [ "$MINIFY" = "1" ]; then
  echo -n "Minifying... "
  hjsmin -i "$BUILD_DIR/$TMP_BUILD_FILE" -o "$BUILD_DIR/$BUILD_FILE"
else
  echo -n "Copying tmp... "
  mv "$BUILD_DIR/$TMP_BUILD_FILE" "$BUILD_DIR/$BUILD_FILE"
fi
echo "done"

# Remove temp file
echo -n "Removing tmp... "
rm -f "$BUILD_DIR/$TMP_BUILD_FILE"
echo "done"

# Done!
