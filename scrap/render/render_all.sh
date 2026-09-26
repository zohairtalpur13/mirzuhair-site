#!/bin/sh
# Render every SCRAP cover still life plus its object mask.
cd "$(dirname "$0")/.." || exit 1
B=/Applications/Blender.app/Contents/MacOS/Blender
for i in "$@"; do
  $B -b -P render/scrap_covers.py -- "$i" "img/issue-0$i.jpg" 2>&1 | grep -E "SCRAP|Traceback|Error"
  $B -b -P render/scrap_covers.py -- "$i" "img/issue-0$i-mask.png" mask 2>&1 | grep -E "SCRAP|Traceback|Error"
done
echo ALL_DONE
