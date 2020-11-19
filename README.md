# MediaServer

![build](https://img.shields.io/github/workflow/status/manorit2001/MediaServer/Caching%20with%20npm)
![issues](https://img.shields.io/github/issues/manorit2001/MediaServer)
![forks](https://img.shields.io/github/forks/manorit2001/MediaServer)
![stars](https://img.shields.io/github/stars/manorit2001/MediaServer)
![license](https://img.shields.io/github/license/manorit2001/MediaServer)
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/eslint-config-google)

_Tired of using pendrive to copy paste media while wanting to watch them on TV?_
_Wish you could watch your laptop videos on TV easily?_

Don't worry, MediaServer has come to your rescue. It is a local media server to host your laptop contents and view it anywhere
**(currently supports sharing h264 encoded videos with aac audio codec)**

### Extensions allowed for video files

- mp4
- mkv
- avi 

### Extension allowed for subtitles

- srt
- vtt

In this documentation, we will refer to directory containing media content which have to be served as `media content directory`.

## Installation

Just download the release version respective to your OS and start it like given below.

The path to media content directory can be provided as either an environment variable or using `-l` argument.
   - Add environmental variable `LOCATION` having media content directory as it's value
   - Location can also be specified as command line argument while starting the application , if used, it will override the Location
     value provided in the `LOCATION` environment variable

### Linux

`LOCATION="path/to/media/folder" ./media-server-linux`

*OR*

`./media-server-linux -l "path/to/media/folder"`

### Windows

```
set LOCATION=path\to\media\folder
.\media-server-win.exe
```

*OR*

`.\media-server-win.exe -l "path\to\media\folder"`

### MacOS

`Figure out yourselves, I don't own Mac`

*OR*

`Figure out yourselves, I don't own Mac`

## How to use from source code

- Clone the repository

`git clone https://github.com/manorit2001/MediaServer`

- Change the directory and install node modules
```
cd MediaServer
npm install
```
- You can setup environment variables for testing by creating `.env` file and adding the content as given below or you can pass it as argument to `npm start` as explained in previous section 

`LOCATION=path_to_media_content`

- Now you can start the server

`npm start`

- After running the application , you will see something like this

```
server is up
listening at http://xxx.xxx.xx.xxx:3000
```

where `xxx.xxx.xx.xxx` is IP address of the device running the application and thus serving the content .
Now to access the media content , just open this link(`http://xxx.xxx.xx.xxx:3000`) in any device connected to the same network as
the device running the application.



## FAQs

### If videos don't work

You can use the **convert.py** script in `scripts/` with python3 to convert your videos to the required format(requires ffmpeg to be installed) and then host your converted_videos directory.

Dependencies required to run `convert.py` script :

- `python3` (duh!)
- `ffmpeg` installed and added to environmental `PATH` variable

```
usage: convert.py [-h] [-x] [-s] [-f] [-o] [-n] [-v] location

convert video files for using with MediaServer

positional arguments:
  location    the name of file/dir to convert

optional arguments:
  -h, --help  show this help message and exit
  -x          if subtitles are to be extracted from the video
  -s          if subtitles are to be used from srt file available in the folder
  -f          try faster conversion(may not work)
  -o          convert only subtitles for the videos
  -n          no subs
  -v          verbose
```

## How to Contribute?

- ### Fork the repo
- ### Make your awesome changes
- ### Send us a PR with your changes

## Noticed any bugs or have any suggestions?

Feel free to open up issue @ https://github.com/manorit2001/MediaServer/issues and we will try to work on them

## License

This project is licensed under the GNU General Public License v3.0. See the [license](https://github.com/manorit2001/MediaServer/blob/master/LICENSE).
