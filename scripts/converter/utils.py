from pathlib import Path
import subprocess
import logging
import re

log = logging.getLogger("convert.py")


def check_video_codec(stream):
    if any(allowed_codecs in stream.codec for allowed_codecs in ["h264"]):
        return True
    return False


def check_audio_codec(stream):
    if any(allowed_codecs in stream.codec for allowed_codecs in ["aac"]):
        return True
    return False


def extract_metadata(path: Path):
    out = subprocess.run(
        ["ffprobe", "-hide_banner", str(path.absolute())],
        stderr=subprocess.STDOUT,
        stdout=subprocess.PIPE,
    ).stdout
    regex = r"Stream #[0-9]*:([0-9]*)([\(\)a-zA-Z]*):\s*([a-zA-Z]*)\s*:\s*([a-zA-Z0-9\(\) /,]*)"
    metadata = []
    for line in out.decode("utf-8").split("\n"):
        log.debug(line)
        if "Stream" in line:
            groups = re.search(regex, line).groups()
            assert len(groups) == 4
            metadata.append(groups)
    return metadata
