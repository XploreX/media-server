#!/usr/bin/python3
import logging
import os
import re
import subprocess as sp
import sys
import time
import shutil
from pathlib import Path
import click
import subprocess
from logger import CustomFormatter

log = logging.getLogger("convert.py")
log.setLevel(logging.DEBUG)


def enable_logging():
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    ch.setFormatter(CustomFormatter())
    log.addHandler(ch)


def find_files(path):
    # Check if if location is a dir
    if not path.is_dir():
        dirs = [path.name]
        basedir = path.parents[0]
    else:
        dirs = [
            Path(filename).name
            for filename in os.listdir(path)
            if filename.endswith(
                (
                    ".mkv",
                    ".mp4",
                    ".avi",
                    ".wmv",
                    ".mov",
                    ".ogg",
                    ".flv",
                    ".mpeg",
                    ".mpg",
                )
            )
        ]
        basedir = path
    return basedir, dirs


def extract_metadata(path):
    out = subprocess.check_output(
        ["ffprobe", "-hide_banner", path], stderr=subprocess.STDOUT
    )
    regex = r"Stream #([0-9:\(\)a-zA-Z]*):\s*([a-zA-Z]*)\s*:\s*([a-zA-Z0-9\(\) /]*)"
    metadata = []
    for line in out.decode("utf-8").split("\n"):
        log.debug(line)
        if "Stream" in line:
            groups = re.search(regex, line).groups()
            assert len(groups) == 3
            metadata.append(groups)
    return metadata


def check_file_codec(metadata):
    stream, type, codec = metadata
    video = False
    audio = False
    if type == "Video":
        if any(allowed_codecs in codec for allowed_codecs in ["h264"]):
            video = True
    elif type == "Audio":
        if any(allowed_codecs in codec for allowed_codecs in ["aac"]):
            audio = True
    return video, audio


@click.command()
@click.option(
    "--path",
    help="Path to file or directory",
    type=click.Path(exists=True),
    required=True,
)
def check(path):
    base_dir, files = find_files(Path(path))
    for file in files:
        log.info(file)
        metadata = extract_metadata(base_dir / file)
        for data in metadata:
            video, audio = check_file_codec(data)
            if video:
                log.info("Video metadata is compatible")
            if audio:
                log.info("Audio metadata is compatible")


@click.group()
def main():
    enable_logging()


main.add_command(check)

if __name__ == "__main__":
    main()
