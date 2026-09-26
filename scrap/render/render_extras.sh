#!/bin/sh
# Render the SCRAP product, invitation, editorial and interior scenes.
cd "$(dirname "$0")/.." || exit 1
B=/Applications/Blender.app/Contents/MacOS/Blender
for s in "$@"; do
  $B -b -P render/scrap_scenes.py -- "$s" "img/$s.jpg" 2>&1 | grep -E "SCRAP|Traceback|Error|line [0-9]"
done
echo EXTRAS_DONE
