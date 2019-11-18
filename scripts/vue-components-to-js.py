#!/usr/bin/env python3

# Generate inline javascript for vue templates from HTML-files
# Usage ./script path/to/componentDir

import os
import sys
import json
import glob
import datetime
import re

# Basic structure for the JS-file
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
lastGenerated = os.path.getmtime(outFilename)

print(f"Searching for HTML files from {componentPath}")
componentFiles = glob.glob(componentPath + '/**/*.html', recursive=True)
print("\nFound files: ")
print(*componentFiles, sep="\n")

# Exit if no files have been changed since last run
if all((os.path.getmtime(c)) < lastGenerated for c in componentFiles):
    print("No files changed")
    sys.exit(0)

print(f"\nWriting JavaScript to {outFilename}")
with open(outFilename, "w") as outFile:

    # Compose template data
    componentList = []
    for compFilename in componentFiles:
        with open(compFilename, "r") as compFile:
            componentList.append({
                "props": ["data"],
                "name": os.path.basename(compFilename).rpartition(".")[0],
                "template": re.sub(r"\n", "", "".join(compFile.readlines()))
            })

    # Print final JS
    print(outFormat.format(
            time=datetime.datetime.now().isoformat(),
            templates=",".join(json.dumps(c) for c in componentList)),
          file=outFile)
