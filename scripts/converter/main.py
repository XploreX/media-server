#!/usr/bin/python3
import logging
import os
import click
from logger import CustomFormatter
from video import Video
from pathlib import Path
import itertools
import subprocess
import inquirer  # noqa
from typing import List

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
    if file.suffix == ".vtt":
        log.info(f"Subtitle: {file}: compatible")
    elif file.suffix == ".srt":
        log.warning(f"Subtitle: {file}: experimental")
    else:
        log.error(f"Subtitle: {file}: incompatible")


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
@click.option(
    "--output-folder",
    help="Path to file or directory",
    default=None,
)
def convert(path: Path, output_folder: Path):
    videos: List[Video] = find_files(Path(path))

    if output_folder is None:
        output_folder = videos[0].base_dir / "converted"

    output_folder.mkdir(parents=True, exist_ok=True)

    for video in videos:
        log.info(video.name)
        itr = itertools.groupby(video.metadata, lambda x: x.type)
        questions = []
        answers = {}
        for ele, group in itr:
            list = [i for i in group]
            if ele != "Subtitle" and len(list) > 1:
                questions.append(
                    inquirer.List(
                        ele,
                        choices=list,
                        message=f"Choose your {ele} stream",
                    )
                )
            else:
                answers[ele] = list[0] or None

        if len(questions):
            answers.update(inquirer.prompt(questions) or {})

        log.debug(answers)

        cmd = [
            "ffmpeg",
            "-hide_banner",
            "-y",
            "-vsync",
            "0",
            "-threads",
            f"{os.cpu_count()}",
            "-hwaccel",
            "auto",
            "-i",
            str(video.path),
            "-map",
            f'0:{answers["Video"].no}',
            "-map",
            f'0:{answers["Audio"].no}',
            "-c:v",
            answers["Video"].compatible_codec,
            "-c:a",
            answers["Audio"].compatible_codec,
            "-c:s",
            "mov_text",
            output_folder / (video.path.stem + ".mp4"),
        ]

        log.debug(cmd)

        subprocess.check_output(cmd)


@click.group()
def main():
    enable_logging()


main.add_command(check)
main.add_command(convert)

if __name__ == "__main__":
    main()
