# media-server

[![build](https://img.shields.io/github/workflow/status/XploreX/MediaServer/Caching%20with%20npm)](https://github.com/XploreX/MediaServer/actions)
[![issues](https://img.shields.io/github/issues/XploreX/MediaServer)](https://github.com/XploreX/MediaServer/issues)
[![forks](https://img.shields.io/github/forks/XploreX/MediaServer)](https://github.com/XploreX/MediaServer/network/members)
[![stars](https://img.shields.io/github/stars/XploreX/MediaServer)](https://github.com/XploreX/MediaServer/stargazers)
[![license](https://img.shields.io/github/license/XploreX/MediaServer)](https://github.com/XploreX/MediaServer/blob/master/LICENSE)
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/eslint-config-google)
[![Downloads](https://img.shields.io/github/downloads/XploreX/media-server/total)](https://github.com/XploreX/media-server/releases)

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

**Note:** You can use our convert script provided to convert your media to specified format if not in the above extension. Please have a look at [FAQs](#faqs)

## Table Of Contents
- [Usage](#usage)
  * [Using GUI](#using-gui)
    + [Steps](#steps)
  * [Using CLI](#using-cli)
    + [Linux](#linux)
    + [Windows](#windows)
    + [MacOS](#macos)
- [Screenshots](#screenshots)
- [Features](#features)
- [How to use from source code](#how-to-use-from-source-code)
- [FAQs](#faqs)
  * [One of the following](#one-of-the-following)
    + [How to fix](#how-to-fix)
- [How to Contribute?](#how-to-contribute)
- [CHANGELOG](#changelog)
- [Noticed any bugs or have any suggestions?](#noticed-any-bugs-or-have-any-suggestions)
- [License](#license)

## Usage

In this documentation, we will refer to directory containing media content which have to be served as `media content directory`.

Just download the release version respective to your OS and start it like given below.

### Using GUI
The admin-server will automatically start if no location is specified, If you wanna start it using command line, you can pass the `-g` flag to the binary.
It is available at [http://localhost:3001](http://localhost:3001) by default

![admin-server](images/media-server-admin-page.png)

#### Steps
- Enter the location where you want to start your media-server
   - **Port:** You can change port if required, by default it is **3000**.
   - **Enable Logging:** If you want to see verbose messages in log showing the requests made in the media-server, you can turn on this flag.
   - **Log Headers:** If you also want to see the headers being passed, You can turn this switch on.
- Click on `Start Media Server`
- You will see something like this in the logs
   ```
   server is up
   listening at http://xxx.xxx.xx.xxx:3000
   ```
- Go to this `URL` in your smart TV and enjoy your media content being streamed from laptop
- When all is done, you can stop the Media-Server and the Admin-Server, if you don't stop them, they will keep running
### Using CLI

The path to media content directory can be provided as either an environment variable or using `-l` argument.
   - Add environmental variable `LOCATION` having media content directory as it's value
   - Location can also be specified as command line argument while starting the application , if used, it will override the Location
     value provided in the `LOCATION` environment variable

#### Linux
   ```
   LOCATION="path/to/media/folder" ./media-server-linux
   ```
   *OR*
   ```
   ./media-server-linux -l "path/to/media/folder"
   ```
#### Windows
   ```
   set LOCATION=path\to\media\folder
   .\media-server-win.exe
   ```
   *OR*
   ```
   .\media-server-win.exe -l "path\to\media\folder"
   ```

#### MacOS
   ```
   Figure out yourselves, I don't own Mac
   ```
   *OR*
   ```
   Figure out yourselves, I don't own Mac
   ```
   PS: binaries are their for macOS too

#### Summary of command line options that can be provided

```
A localhost Media Server

Options:
  -v, --verbose   Run with verbose logging                               [count]
  -l, --location  the path to media content directory                   [string]
  -p, --port      the port to run server on                             [number]
  -g, --gui       open gui mode for configuring settings               [boolean]
      --image     enable display of images            [boolean] [default: false]
      --video     enable display of videos             [boolean] [default: true]
  -h, --help      Show help                                            [boolean]
```

## Screenshots
You can see the working of the app [here.](https://github.com/XploreX/media-server/blob/master/images/screenshots.md)

## Features

- **Admin Panel** to allow GUI Configurations
- **Support SRT's** out of the box
- **Play/Pause/Rewind/Forward** to use your remote keys to control the webplayer
- **Photo Viewer** to watch your favorite pics in TV (not enabled by default)
- **Auto Next** as soon as the video ends
- **Seek in video, Just like Youtube!!** using your remote numpad

And more in next releases...

## How to use from source code


- Clone the repository
   ```
   git clone https://github.com/XploreX/media-server
   ```
- Change the directory and install node modules
   ```
   cd MediaServer
   npm install
   ```
- You can setup environment variables for testing by creating `.env` file and adding the content as given below or you can pass it as argument to `npm start` as explained in previous section 
   ```
   LOCATION=path_to_media_content
   ```
- Now you can start the server

   `npm start` *OR* `node server.js`

   For help you can use `node server.js -h`

- After running the application , you will see something like this

   ```
   server is up
   listening at http://xxx.xxx.xx.xxx:3000
   ```

where `xxx.xxx.xx.xxx` is IP address of the device running the application and thus serving the content .
Now to access the media content , just open this link(`http://xxx.xxx.xx.xxx:3000`) in any device connected to the same network as
the device running the application.

## FAQs

### One of the following

   - Videos don't work
   - Dual Audio files
   - Video Playing but no audio
   - Subtitles working in VLC but not in player

   This occurs due to the fact that web browsers don't support all the video and audio encoding and if the subtitles are embeded in the video, html needs them to be extracted to `vtt` file to show them in browsers.

   #### How to fix

   You can use the **convert.py** script in `scripts/` with python3 to convert your videos to the required format and then host your `converted_videos` directory. It is optimized so that it doesn't re-encode if already properly encoded.

   **NOTE:** Conversion of video encodings can take time depending on your computing capabilities.
   
   **Requirements**
   - `python3` duh!
   - `ffmpeg` installed and added in environmental `PATH` variable

   ```
   usage: convert.py [-h] [-x] [-s] [-f] [-y] [-o] [-d] [-n] [-v] location

   convert video files for using with MediaServer

   positional arguments:
     location    the name of file/dir to convert

   optional arguments:
     -h, --help  show this help message and exit
     -x          if subtitles are to be extracted from the video
     -s          if subtitles are to be used from srt file available in the folder
     -f          try faster conversion(may not work)
     -y          allow overwrites
     -o          convert only subtitles for the videos
     -d          use default answers
     -n          no subs(default)
     -v          verbose
   ```
 

## How to Contribute?

- Fork the repo
- Make your awesome changes
- Send us a PR with your changes

## CHANGELOG

You can see the changes [here](CHANGELOG.md)

## Noticed any bugs or have any suggestions?

Feel free to open up [issue](https://github.com/XploreX/MediaServer/issues) and we will try to work on them

## License

This project is licensed under the GNU General Public License v3.0. See the [license](https://github.com/XploreX/MediaServer/blob/master/LICENSE).
