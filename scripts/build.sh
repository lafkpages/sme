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
cat src/encoders.js >> "$BUILD_DIR/$BUILD_FILE"
cat src/scriptlet.js >> "$BUILD_DIR/$BUILD_FILE"
echo "})();" >> "$BUILD_DIR/$BUILD_FILE"
echo "done"

# Minify
echo -n "Minifying scriptlet... "
npx uglify-js "$BUILD_DIR/$BUILD_FILE" -o "$BUILD_DIR/$BUILD_FILE_MIN" -b ascii_only=true,beautify=false -m > /dev/null
echo "done"

# Copy to userscript
echo -n "Building userscript... "
cat src/userscript.js > "$BUILD_DIR/$BUILD_FILE_USERSCRIPT"
cat "$BUILD_DIR/$BUILD_FILE" >> "$BUILD_DIR/$BUILD_FILE_USERSCRIPT"
echo "done"

# Userscript meta file
echo -n "Building userscript meta... "
cp src/userscript.js "$BUILD_DIR/$BUILD_FILE_USERSCRIPT_META"
echo "done"

# Minify userscript
echo -n "Minifying userscript... "
cat src/userscript.js > "$BUILD_DIR/$BUILD_FILE_USERSCRIPT_MIN"
cat "$BUILD_DIR/$BUILD_FILE_MIN" >> "$BUILD_DIR/$BUILD_FILE_USERSCRIPT_MIN"
echo "done"
echo -n "Minifying userscript meta... "
cp "$BUILD_DIR/$BUILD_FILE_USERSCRIPT_META" "$BUILD_DIR/$BUILD_FILE_USERSCRIPT_META_MIN"
echo "done"

# Done!
