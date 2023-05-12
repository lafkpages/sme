#!/bin/bash

# Build
npm run build

# Directory to build in
BUILD_DIR="cloudflare"

# Files required for build
DIRS=("src" "assets" "dist" "index.html")
IGNORE=("scriptlet.js userscript.js" "" "" "")

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
echo -ne "Building...\t\t\t\t\t\t"
for dir_i in "${!DIRS[@]}"; do
  dir="${DIRS[$dir_i]}"

  if [ -d "$dir" ]; then
    mkdir "$BUILD_DIR/$dir"

    for file in "$dir"/*; do
      ignore="0"
  
      for ignoreFile in ${IGNORE[$dir_i]}; do
        if [ "$dir/$ignoreFile" = "$file" ]; then
          ignore="1"
          break
        fi
      done
  
      if [ "$ignore" = "0" ]; then
        cp -r "$file" "$BUILD_DIR/$dir"
      fi
    done
  elif [ -f "$dir" ]; then
    cp "$dir" "$BUILD_DIR"
  else
    echo "Warning: $dir: No such file or directory"
  fi
done
echo "done"
