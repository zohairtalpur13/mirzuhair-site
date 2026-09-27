#!/bin/sh
# Render the new TALPUR objects (issues 05-08) and their masks.
cd "$(dirname "$0")/.." || exit 1
B=/Applications/Blender.app/Contents/MacOS/Blender
$B -b -P render/shelf_life.py -- lantern img/talpur-05-mask.png mask 2>&1 | grep -E "SHELF|Traceback|Error"
n=6
for s in clock urn cranberry; do
  $B -b -P render/shelf_life.py -- "$s" "img/talpur-0$n.jpg" 2>&1 | grep -E "SHELF|Traceback|Error"
  $B -b -P render/shelf_life.py -- "$s" "img/talpur-0$n-mask.png" mask 2>&1 | grep -E "SHELF|Traceback|Error"
  n=$((n+1))
done
echo NEW_DONE
