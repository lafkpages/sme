#!/bin/bash

# Directory to store builds
BUILD_DIR="dist"

# File name of build
BUILD_FILE="scriptlet.js"
BUILD_FILE_USERSCRIPT="userscript.user.js"
BUILD_FILE_USERSCRIPT_META="userscript.meta.js"

# File names of minified builds
BUILD_FILE_MIN="scriptlet.min.js"
BUILD_FILE_USERSCRIPT_MIN="userscript.min.user.js"
BUILD_FILE_USERSCRIPT_META_MIN="userscript.min.meta.js"

# Check if JS minifier is installed
if command -v uglifyjs >/dev/null 2>&1; then :; else
  echo "Warning: UglifyJS not found"
  MINIFY="0"
fi

# Make folder if no existy
if [ ! -d "$BUILD_DIR" ]; then
  echo -ne "Making build dir...\t\t\t\t"
  mkdir "$BUILD_DIR"
  echo "done"
fi

# Delete previous builds
echo -ne "Removing old builds...\t\t\t"
rm -rf "$BUILD_DIR"/{*,.*} 2>/dev/null
echo "done"

# Build!
echo -ne "Building scriptlet...\t\t\t"
echo "(() => {" > "$BUILD_DIR/$BUILD_FILE"
cat src/encoders.js >> "$BUILD_DIR/$BUILD_FILE"
cat src/scriptlet.js >> "$BUILD_DIR/$BUILD_FILE"
echo "})();" >> "$BUILD_DIR/$BUILD_FILE"
echo "done"

# Beautify
echo -ne "Beautifying scriptlet...\t\t"
npx uglify-js --in-situ "$BUILD_DIR/$BUILD_FILE" -b ascii_only=true > /dev/null
echo "done"

# Minify
echo -ne "Minifying scriptlet...\t\t\t"
npx uglify-js "$BUILD_DIR/$BUILD_FILE" -o "$BUILD_DIR/$BUILD_FILE_MIN" -b ascii_only=true,beautify=false -m > /dev/null
echo "done"

# Copy to userscript
echo -ne "Building userscript...\t\t\t"
cat src/userscript.js > "$BUILD_DIR/$BUILD_FILE_USERSCRIPT"
cat "$BUILD_DIR/$BUILD_FILE" >> "$BUILD_DIR/$BUILD_FILE_USERSCRIPT"
echo "done"

# Userscript meta file
echo -ne "Building userscript meta...\t\t"
cp src/userscript.js "$BUILD_DIR/$BUILD_FILE_USERSCRIPT_META"
echo "done"

# Minify userscript
echo -ne "Minifying userscript...\t\t\t"
cat src/userscript.js > "$BUILD_DIR/$BUILD_FILE_USERSCRIPT_MIN"
cat "$BUILD_DIR/$BUILD_FILE_MIN" >> "$BUILD_DIR/$BUILD_FILE_USERSCRIPT_MIN"
echo "done"
echo -ne "Minifying userscript meta...\t"
cp "$BUILD_DIR/$BUILD_FILE_USERSCRIPT_META" "$BUILD_DIR/$BUILD_FILE_USERSCRIPT_META_MIN"
echo "done"

# Done!
