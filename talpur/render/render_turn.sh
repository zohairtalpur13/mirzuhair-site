#!/bin/sh
# Render 24-frame turntables of each TALPUR object for the drag-to-spin viewer.
cd "$(dirname "$0")/.." || exit 1
B=/Applications/Blender.app/Contents/MacOS/Blender
while pgrep -f "shelf_life.py -- cabinet" >/dev/null; do sleep 5; done
for s in vase ewer goblet; do
  $B -b -P render/shelf_life.py -- "$s" "img/turn/$s.jpg" turn 24 2>&1 | grep -E "SHELF|Traceback|Error"
done
echo TURN_DONE
