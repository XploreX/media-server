#!/usr/bin/python3
import logging
import os
import re
import subprocess
import sys
import time
import shutil
from pathlib import Path
import click
import subprocess
from logger import CustomFormatter
from video import Video

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
        files = [path]
    else:
        files = [
            path / Path(filename)
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
    return [Video(i) for i in files]


def check_metadata(stream):
    log.debug(stream)
    if stream.compatible:
        log.info(f"{stream.no}: {stream.type} is compatible")
    else:
        log.error(f"{stream.no}: {stream.type} is not compatible")


def check_subtitle(file):
    if file.endswith(".vtt"):
        log.info(f"{file}: compatible")
    elif file.endswith(".srt"):
        log.warning(f"{file}: experimental")
    else:
        log.error(f"{file}: incompatible")


@click.command()
@click.option(
    "--path",
    help="Path to file or directory",
    type=click.Path(exists=True),
    required=True,
)
def check(path):
    videos = find_files(Path(path))
    for video in videos:
        log.info(video.name)
        for stream in video.metadata:
            check_metadata(stream)
        for file in video.subtitle_files:
            check_subtitle(file)


@click.command()
@click.option(
    "--path",
    help="Path to file or directory",
    type=click.Path(exists=True),
    required=True,
)
def convert(path):
    videos = find_files(Path(path))
    for video in videos:
        log.info(video.name)
        for data in metadata:
            video, audio = check_file_codec(data)
            cmd = [
                "ffmpeg",
                "-y",
                "-vsync",
                "0",
                "-threads",
                os.cpu_count(),
                "-hwaccel",
                "auto",
                "-i",
                str(base_dir / file),
                str(base_dir / (file.stem + ".mp4")),
            ]


@click.group()
def main():
    enable_logging()


main.add_command(check)

if __name__ == "__main__":
    main()
