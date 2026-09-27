#!/bin/sh
# Render the five RAW still lifes and their object masks.
cd "$(dirname "$0")/.." || exit 1
B=/Applications/Blender.app/Contents/MacOS/Blender
n=1
for s in vessel repair rest book stones; do
  $B -b -P render/raw_scenes.py -- "$s" "img/raw-0$n.jpg" 2>&1 | grep -E "RAW|Traceback|Error"
  $B -b -P render/raw_scenes.py -- "$s" "img/raw-0$n-mask.png" mask 2>&1 | grep -E "RAW|Traceback|Error"
  n=$((n+1))
done
echo RAW_DONE
