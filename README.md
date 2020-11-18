# MediaServer
![build](https://img.shields.io/github/workflow/status/manorit2001/MediaServer/Caching%20with%20npm)
![issues](https://img.shields.io/github/issues/manorit2001/MediaServer)
![forks](https://img.shields.io/github/forks/manorit2001/MediaServer)
![stars](https://img.shields.io/github/stars/manorit2001/MediaServer)
![license](https://img.shields.io/github/license/manorit2001/MediaServer)

_Tired of using pendrive to copy paste media while wanting to watch them in tv?_
_Wish that you could watch your laptop videos in tv easily?_

Don't worry, MediaServer has come to your rescue. It is a local media server to host your laptop contents and view it anywhere
**(currently supports sharing mp4/mkv/avi h264 encoded videos)**

In this documentation , We will refer to directory containing media content which have to be served as `media content directory`.

## How to use from source code
1. Clone the repository , then open terminal in cloned repository directory and run ` npm install ` to install all node 
modules dependencies
2. Location of directory from which media content (videos) have to be served can be specified in one of the following ways :
   - Add environmental variable ```LOCATION``` having media content directory as it's value
   - Location can also be specified as command line argument while starting the application , if used, it will override the Location
value provided in the ```LOCATION``` environment variable

**Application can be started using one of the following ways**

1.
```
npm start
````
Media content directory path will be taken from `LOCATION` environment variable as described above , 

2.
```
npm start -- -l path_to_consuming_media_directory
```
Media content directory path will be taken from value of `-l` argument.

3.
```
npm start -- --location=path_to_consuming
```
Media content directory path will be taken from value of `location` argument

If both `-l` and `--location` argument are specified , media content directory path will be taken as value of `--location` argument


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

Dependencies required to run `convert.py` script :

- `python3` (duh!)
- `ffmpeg` installed and added to environmental `PATH` variable

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
