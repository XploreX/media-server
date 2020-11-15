# MediaServer
![build](https://img.shields.io/github/workflow/status/manorit2001/MediaServer/Caching%20with%20npm)
![issues](https://img.shields.io/github/issues/manorit2001/MediaServer)
![forks](https://img.shields.io/github/forks/manorit2001/MediaServer)
![stars](https://img.shields.io/github/stars/manorit2001/MediaServer)

_Tired of using pendrive to copy paste media while wanting to watch them in tv?_
_Wish that you could watch your laptop videos in tv easily?_

Don't worry, MediaServer has come to your rescue. It is a local media server to host your laptop contents and view it anywhere
**(currently supports sharing mp4/mkv/avi h264 encoded videos)**


## Installation
Just download the release version respective to your OS and start it like given below

### Linux
`LOCATION="/path/to/video/directories" ./MediaServer-linux`

### Windows
```
set LOCATION=\path\to\video\directories
.\MediaServer-win.exe
```
### MacOS
`Figure out yourselves, I don't own mac.`

## FAQs
(Not asked until now, coz duh! first release)
### If videos don't work

You can use the **convert.py** script with python3 to convert your videos to the required format(requires ffmpeg to be installed) and then host your converted_videos directory.
```
usage: convert.py [-h] [-x] [-s] [-o] [-n] [-v] location

convert video files for using with MediaServer

positional arguments:
  location    the name of file/dir to convert

optional arguments:
  -h, --help  show this help message and exit
  -x          if subtitles are to be extracted from the video
  -s          if subtitles are to be used from srt file available in the folder
  -o          convert only subtitles for the videos
  -n          no subs
  -v          verbose

```
## Wanna Contribute?
- ### Fork the repo
- ### Make your awesome changes
- ### Send us a PR with your changes

## Noticed any bugs or have any suggestions?
  Feel free to open up issue @ https://github.com/manorit2001/MediaServer/issues and we will try to work on them

## License
  This project is licensed under the GNU General Public License v3.0. See the [license](https://github.com/manorit2001/MediaServer/blob/master/LICENSE).
