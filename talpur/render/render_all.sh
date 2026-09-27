#!/bin/sh
# Render the TALPUR issue still lifes and their object masks.
cd "$(dirname "$0")/.." || exit 1
B=/Applications/Blender.app/Contents/MacOS/Blender
n=1
for s in vase ewer goblet cabinet; do
  $B -b -P render/shelf_life.py -- "$s" "img/talpur-0$n.jpg" 2>&1 | grep -E "SHELF|Traceback|Error"
  $B -b -P render/shelf_life.py -- "$s" "img/talpur-0$n-mask.png" mask 2>&1 | grep -E "SHELF|Traceback|Error"
  n=$((n+1))
done
echo TALPUR_DONE
