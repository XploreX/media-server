#!/bin/bash
for f in $1/*.mkv;do (ffmpeg -y -i "${f%.mkv}.srt" "${f%.mkv}.vtt" && prime-run ffmpeg -y -vsync 0 -hwaccel cuda -hwaccel_output_format cuda -i "$f" -f webvtt -i "${f%.mkv}.srt" -map 0:0 -map 0:1 -map 1:0 -c:v copy -c:a aac -c:s mov_text "${f%.mkv}.mp4" || break);done
