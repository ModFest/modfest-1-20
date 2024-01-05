#!/usr/bin/python3

import requests
import json
from subprocess import run, PIPE
import re

EXCLUDE = [
    "rapscallions-and-rockhoppers"  # Pulls latest from NeoForge ver
]

platform_data = json.loads(requests.get("https://platform.modfest.net/submissions").text)
participant_data = json.loads(requests.get("https://platform.modfest.net/event/1.20").text)

submissions = []
for participant_id, participant in participant_data["participants"].items():
    for mod in participant["submissions"]:
        submissions.append(mod)

input_str = ""
with open('server.toml', 'r') as f:
    input_str = f.read()
    for mod in platform_data:
        if mod["id"] in submissions and not mod["slug"] in input_str and not mod["slug"] in EXCLUDE:
            run(['mcman', 'i', 'url', mod["download_url"].replace(mod["id"], mod["slug"])])

with open('server.toml', 'r') as f:
    input_str = f.read()
    for mod in platform_data:
        if mod["id"] in submissions and not mod["slug"] in EXCLUDE:
            # Regexes may not be the intended solution, but they sure are a solution
            input_str = re.sub(
                r"\[\[mods\]\]\ntype = \"modrinth\"\nid = \"%modid%\"\nversion = \".{8}\""
                    .replace("%modid%", mod["slug"]),
                "[[mods]]\ntype = \"modrinth\"\nid = \"%modid%\"\nversion = \"%version%\""
                    .replace("%modid%", mod["slug"])
                    .replace("%version%", mod["version_id"]),
                input_str)

with open('server.toml', 'w') as f:
    f.write(input_str)
