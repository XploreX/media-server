from pathlib import Path
from utils import extract_metadata, check_video_codec, check_audio_codec
import logging

log = logging.getLogger("convert.py")


class Stream:
    def __init__(self, data):
        self.no, self.type, self.codec = data
        self.compatible = self.is_compatible_codec(data)
        self.compatible_codec = self.get_compatible_codec(data)

    def is_compatible_codec(self, data):
        log.debug(data)
        if self.type == "Video":
            if check_video_codec(data):
                return True
        elif self.type == "Audio":
            if check_audio_codec(data):
                return True
        return False

    def get_compatible_codec(self, data):
        if self.type == "Video":
            return "copy" if self.compatible else "h246"
        elif self.type == "Audio":
            return "copy" if self.compatible else "aac"
        else:
            return "copy"

    def __str__(self):
        return f"{self.no}: {self.type} - {self.codec}"


class Video:
    def __init__(self, path):
        self.path = path
        self.name = path.name
        self.base_dir = path.parents[0]
        self.metadata = [Stream(i) for i in extract_metadata(path)]
        self.subtitle_files = self.get_subtitle_files(path)

    def get_subtitle_files(self, file: Path):
        list = []
        base_name = str(self.base_dir / (file.stem + ".%"))

        for ext in ["vtt", "srt"]:
            if Path(base_name.format(ext)).exists():
                list.append(base_name.format(ext))

        for stream in self.metadata:
            if stream.type == "Subtitle":
                list.append(file.name)
                break

        return list
