#!/usr/bin/python3
import argparse
import logging
import os
import re
import subprocess as sp
import sys
import time
import shutil

logger = logging.getLogger("convert.py")
logger.setLevel(logging.DEBUG)
curfiledir = os.path.basename(__file__)

# color codes for different colors
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

# Parser configs
parser = argparse.ArgumentParser(
    description='convert video files for using with MediaServer')
parser.add_argument(
    'path', help='the name of file/dir to convert', metavar="location")
parser.add_argument(
    '-x', help='if subtitles are to be extracted from the video', action="store_true")
parser.add_argument(
    '-s', help='if subtitles are to be used from srt file available in the folder', action="store_true")
parser.add_argument(
    '-f', help='try faster conversion(may not work)', action="store_true")
parser.add_argument('-o', help='convert only subtitles for the videos',action="store_true")
parser.add_argument('-n', help='no subs', action="store_true")
parser.add_argument('-v', help='verbose', action="store_true")
args = parser.parse_args()

# If verbose, setup logging
if(args.v):
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    formatter = logging.Formatter('%(levelname)s - %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)
else:
    logger.disabled=True

# Extract the mkv movies and set the basedir

# Check if if location is a dir
if(not os.path.isdir(args.path)):
    dirs = [os.path.basename(args.path)]
    basedir = os.path.dirname(args.path)
else:
    dirs = [os.path.basename(filename) for filename in os.listdir(
        args.path) if filename.endswith(".mkv") or filename.endswith(".mp4") or filename.endswith(".avi")]
    basedir = args.path

# create output dirs
output_dir = os.path.join(basedir, "converted_videos")
try:
    os.makedirs(output_dir)
except:
    pass

# A helper function to not create a new line if progress texts are found
def match_progress_string(l2):
    if('speed' in l2):
        return True
    else:
        return False

# A helper function to print coloured strings
def print_color(color,string,bold=False):
    if(bold):
        print(f"{bcolors.BOLD}{color}{string}{bcolors.ENDC}")
    else:
        print(f"{color}{string}{bcolors.ENDC}")

# error handler while extracting subs, returns True if error found
def subs_error_ffmpeg(output):
    if('Output file #0 does not contain any stream' in output):
        print_color(bcolors.FAIL,'- Subtitles not found in Video')
        return True 
    return False

# A helper function to get the output from processes and handle errors based function given
def get_output(process,error_handler=None):
    success=True
    while True:

        # get the output and error
        output = process.stdout.readline()

        # if not output and process end, break from loop
        if output == '' and process.poll() is not None:
            break

        if output:

            # check for subtitles extraction errors in output
            if(error_handler!=None and error_handler(output)):
                process.terminate()
                success=False
                break

            # if not verbose, show only the progress
            if(not args.v and not 'speed' in output):
                continue

            # if match_percent return True, write in same line else create a new line
            if(match_progress_string(output.strip())):
                sys.stdout.write('\r'+output.strip()+' '*20)
                sys.stdout.flush()
            else:
                print(output.strip())
        
        # get the return code
        rc = process.poll()

    #create a new line coz last outputs might have been written in same line
    if(success):
        print()
    return success

# if no method for extracting subs given, defaults to no subs to be extracted
if(not args.s and not args.x):
    args.n=True

# Iterating of files
for filename in dirs:

    filename_without_ext = '.'.join(filename.split('.')[:-1])
    final_subs_file = os.path.join(output_dir, filename_without_ext+".vtt")
    final_video_file=""
    if(args.f):
        final_video_file = os.path.join(output_dir, filename)
    else:
        final_video_file = os.path.join(output_dir, filename_without_ext+".mp4")

    print_color(bcolors.HEADER,f"+ Started Process for {filename}",True)

    # If we have to extract args
    success_subs=True
    if(not args.n):

        initial_subs_file = ""

        # choose the subsfile based on params
        if(args.x):
            initial_subs_file = os.path.join(basedir,filename)
        elif(args.s):
            initial_subs_file = os.path.join(basedir,filename_without_ext+".srt")

        logger.debug(f"subsfile: {initial_subs_file}")

        if(initial_subs_file != "" and os.path.isfile(initial_subs_file)):

            print_color(bcolors.OKCYAN,f"+ Extracting subs from {initial_subs_file}")

            # create the shell command
            sh = f'ffmpeg -y -i "{initial_subs_file}" "{final_subs_file}"'
            logger.debug(sh)

            # spawn popen process
            process = sp.Popen(sh, shell=True, universal_newlines=True,
                            stderr=sp.STDOUT, stdout=sp.PIPE)

            success_subs=get_output(process,subs_error_ffmpeg)
            if(success_subs):
                print_color(bcolors.OKGREEN,f"+ Extracted Subtitles")
            else:
                print_color(bcolors.FAIL,f"- Err Extracting Subtitles")
        else:
            print_color(bcolors.FAIL,f"- Err:{initial_subs_file} not found")
            success_subs=False

    # If subtitle only flag given, copy the video to the folder 
    if(args.o):
        print_color(bcolors.HEADER,f"* Copying Video to output_folder as subtitle only conversion given")

        # Using ffmpeg to show the copy progress, shutil copy doesn't have any helper function for that
        sh = f'ffmpeg -y -vsync 0 -hwaccel auto -i "{os.path.join(basedir,filename)}" -c copy "{os.path.join(output_dir,filename)}"'

        logger.debug(sh)
        process=sp.Popen(sh,shell=True,stderr=sp.STDOUT,stdout=sp.PIPE,universal_newlines=True)

        success=get_output(process)
        
        if(success):
            print_color(bcolors.OKGREEN,f"+ Video Copied")
        else:
            print_color(bcolors.FAIL,f"- Some Error Occurred While Copying")
        continue

    # check the codecs in original file
    sh = f'ffprobe "{os.path.join(basedir,filename)}" 2>&1 >/dev/null | grep -i "Stream"'
    process = sp.Popen(sh, shell=True, stderr=sp.PIPE, stdout=sp.PIPE)

    # get all the outputs
    outputs = process.stdout.readlines()
    regexes = ['(Video): ([a-zA-Z0-9]*)', '(Audio): ([a-zA-Z0-9]*)',
               '(Subtitle): ([a-zA-Z0-9]*)']
    codecs = {
        'Video':"",
        'Audio':"",
        'Subtitle':"",
    }

    # extract the codecs using regex
    for j in range(len(outputs)):
        extracts = outputs[j]
        try:
            stream = re.search(regexes[j], extracts.decode()).groups()[0].strip()
            codec = re.search(regexes[j], extracts.decode()).groups()[1].strip()
            codecs[stream]=codec
        except:
            pass

    logger.debug(f"initial codecs: {codecs}")

    # if codec is h264, no need to reencode
    if(codecs['Video'] == 'h264'):
        print_color(bcolors.OKGREEN,f"+ Supported Video format")
        codecs['Video'] = 'copy'
    else:
        print_color(bcolors.WARNING,f"! Unsupported Video format")
        #if codec is different, ask the user as this is time consuming process
        convert_vid=input(f"current video codec is {codecs['Video']}, convert it to h264?(y/N)")

        # defaults to N so only checking if Y entered
        if(convert_vid.capitalize=='Y'):
            codecs['Video']='h264'
        else:
            codecs['Video']='copy'
    
    # audio codec conversions ain't much time consuming so not asking for user input on that
    if(codecs['Audio'] == 'aac'):
        print_color(bcolors.OKGREEN,f"+ Supported Audio format")
        codecs['Audio'] = 'copy'
    else:
        print_color(bcolors.WARNING,f"! Unsupported Audio format, Converting it")
        codecs['Audio'] = 'aac'

    # subtitle codecs
    if(args.n):
        codecs['Subtitle']=''
    else:
        codecs['Subtitle'] = 'mov_text'

    logger.debug(f"final codecs: {codecs}")
    print_color(bcolors.OKCYAN,f"+ converting video {filename}")

    # if subs are successful and subtitles are to be embedded
    if(not args.n and success_subs==True and not args.f):
        sh = f'ffmpeg -y -vsync 0 -threads {os.cpu_count()} -hwaccel auto -i "{os.path.join(basedir,filename)}" '
        sh+=f'-f webvtt -i "{final_subs_file}" -map 1:0 '
        sh+=f'-map 0:0 -map 0:1 -c:v {codecs["Video"]} -c:a {codecs["Audio"]} -c:s {codecs["Subtitle"]} "{final_video_file}"'
    else:
        sh = f'ffmpeg -y -vsync 0 -threads {os.cpu_count()} -hwaccel auto -i "{os.path.join(basedir,filename)}" -c:v {codecs["Video"]} -c:a {codecs["Audio"]} "{final_video_file}"'

    logger.debug(sh)
    process=sp.Popen(sh,shell=True,stderr=sp.STDOUT,stdout=sp.PIPE,universal_newlines=True)

    success=get_output(process)
    if(success):
        print_color(bcolors.OKGREEN,f"+ Converted {filename}")
    else:
        print_color(bcolors.FAIL,f"- Some error occurred while converting {filename}")


