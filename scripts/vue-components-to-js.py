#!/usr/bin/env python3

# Generate inline javascript for vue templates from HTML-files
# Usage ./script path/to/componentDir

import os
import sys
import json
import glob
import datetime
import re

outFormat = """
//Generated {time}

let ComponentStrings = [
    {templates}
]

export {{ ComponentStrings }}
"""

if len(sys.argv) != 2:
    print("Give path to the dir containing the html files")

componentPath = sys.argv[1]
outFilename = f"{componentPath}/generated/components.js"

print(f"Searching for HTML files from {componentPath}")
componentFiles = glob.glob(componentPath + '/**/*.html', recursive=True)
print("\nFound files: ")
print(*componentFiles, sep="\n")

print(f"\nWriting JavaScript to {outFilename}")
with open(outFilename, "w") as outFile:
    componentList = []
    for compFilename in componentFiles:
        with open(compFilename, "r") as compFile:
            componentList.append({
                "props": ["data"],
                "name": os.path.basename(compFilename).rpartition(".")[0],
                "template": re.sub(r"\n", "", "".join(compFile.readlines()))
            })

    print(outFormat.format(
            time=datetime.datetime.now().isoformat(),
            templates=",".join(json.dumps(c) for c in componentList)),
          file=outFile)
