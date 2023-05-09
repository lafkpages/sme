#!/bin/bash

# Directory to store builds
BUILD_DIR="dist"

# File name of build
BUILD_FILE="scriptlet.js"
BUILD_FILE_USERSCRIPT="userscript.js"
BUILD_FILE_USERSCRIPT_META="userscript.meta.js"

# Uncomment to minify build
MINIFY="1"

# Check if JS minifier is installed
if command -v uglifyjs >/dev/null 2>&1; then :; else
  echo "Warning: UglifyJS not found"
  MINIFY="0"
fi

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
echo "(() => {" > "$BUILD_DIR/$BUILD_FILE"
cat encoders.js >> "$BUILD_DIR/$BUILD_FILE"
cat scriptlet.js >> "$BUILD_DIR/$BUILD_FILE"
echo "})();" >> "$BUILD_DIR/$BUILD_FILE"
echo "done"

# Minify
if [ "$MINIFY" = "1" ]; then
  echo -n "Minifying... "
  npx uglify-js -m --in-situ "$BUILD_DIR/$BUILD_FILE" -b ascii_only=true,beautify=false > /dev/null
  echo "done"
fi

# Copy to userscript
echo -n "Building userscript... "
cat userscript.js > "$BUILD_DIR/$BUILD_FILE_USERSCRIPT"
cat "$BUILD_DIR/$BUILD_FILE" >> "$BUILD_DIR/$BUILD_FILE_USERSCRIPT"
echo "done"

# Userscript meta file
echo -n "Building userscript meta... "
cp userscript.js "$BUILD_DIR/$BUILD_FILE_USERSCRIPT_META"
echo "done"

# Done!
