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
parser.add_argument('-y',help='allow overwrites',action='store_true')
parser.add_argument('-o', help='convert only subtitles for the videos',action="store_true")
parser.add_argument('-d', help='use default answers',action="store_true")
parser.add_argument('-n', help='no subs(default)', action="store_true")
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
        args.path) if filename.endswith((".mkv",".mp4",".avi",".wmv",".mov",".ogg",".flv",".mpeg",".mpg"))]
    basedir = args.path

# These will store the preferred user answer for the run
preferred_codecs=dict()
preferred_choices=dict()

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
def print_color(color,string,bold=False,lineend=True):
    if(bold):
        if not lineend:
            print(f"{bcolors.BOLD}{color}{string}{bcolors.ENDC}",end='')
        else:
            print(f"{bcolors.BOLD}{color}{string}{bcolors.ENDC}")
    else:
        if not lineend:
            print(f"{color}{string}{bcolors.ENDC}",end='')
        else:
            print(f"{color}{string}{bcolors.ENDC}")

# error handler while extracting subs, returns True if error found
def subs_error_ffmpeg(output):
    if('Output file #0 does not contain any stream' in output):
        print_color(bcolors.FAIL,'- Subtitles not found in Video')
        return True 
    return False

def overwrite_if_exists(path):
    if os.path.exists(path):
        if not args.y:
            print_color(bcolors.WARNING,f'! {os.path.basename(path)} exists. Do you want to overwrite it?(y/N)(default=N)',lineend=False)
            temp=input()
            if(temp.capitalize()=='Y'):
                return True
                print_color(bcolors.OKGREEN,f'+ Overwriting File')
            else:
                print_color(bcolors.FAIL,f'- Skipping File')
                return False
        else:
            print_color(bcolors.WARNING,f'! {os.path.basename(path)} exists. Overwriting file as -y passed')
            return True
    else:
        return True

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
    print_color(bcolors.OKGREEN,f"+ Defaulting to No Subtitles as no suitable arguments passed",True)
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

    
    # check the codecs in original file
    sh = f'ffprobe "{os.path.join(basedir,filename)}" 2>&1 >/dev/null | grep -i "Stream"'
    process = sp.Popen(sh, shell=True, stderr=sp.PIPE, stdout=sp.PIPE)

    # get all the outputs
    outputs = process.stdout.readlines()
    regex = r'Stream #([0-9:\(\)a-zA-Z]*):\s*([a-zA-Z]*)\s*:\s*([a-zA-Z0-9\(\) ]*)'
    codecs=dict()

    # extract the codecs using regex
    logger.debug(outputs)
    for j in range(len(outputs)):
        extracts = outputs[j].decode()
        groups = re.search(regex, extracts).groups()

        logger.debug(groups)

        # Extract the regexes
        stream = groups[0].strip()
        streamtype = groups[1].strip()
        codec = groups[2].replace('(default)','').strip()
        if('(' in stream):
            temp=stream.strip('()').split('(')
            stream=temp[0]
            codec+=' '+temp[1]

        # Add default stream to codecs for user
        if('default' in extracts):
            codec+=' (default)'

        # Add stream to codec for extracting later
        codec=f"#{stream}: "+ codec
        if(codecs.get(streamtype)==None):
            codecs[streamtype]=[codec]
        else:
            codecs[streamtype]+=[codec]

    logger.debug(codecs)
    for key in codecs.keys():
        choice=100
        size=len(codecs[key])
        found=False

        # If copy only given, don't ask for audio and video streams
        if args.o:
            if key in ['Audio','Video']:
                continue

        # if subs not to be extracted, don't ask for subtitles
        if not args.x and 'Subtitle' in key:
            continue

        # ask user until he presses '\n' or any valid number
        while choice>size:
            print_color(bcolors.OKCYAN,f"\n+++ Choose {key} stream: +++",bold=True)
            for j in range(size):
                print_color(bcolors.OKGREEN,f"{j+1}: {codecs[key][j]}")
                if preferred_codecs.get(key)==None:
                    if 'default' in codecs[key][j]:
                        choice=j+1
                        if args.d:
                            print_color(bcolors.OKGREEN,f'+ Using Default stream')
                            found=True
                            break
                if preferred_codecs.get(key)!=None and preferred_codecs[key] in codecs[key][j]:
                    print_color(bcolors.OKGREEN,f'+ Found {preferred_codecs[key]} from preferred choices')
                    found=True
                    choice=j+1
                    break
            if not found:
                if(size>1):
                    message=f'Please enter your choice(1-{len(codecs[key])})(default={choice})'
                else:
                    message=(f'Please enter your choice(1)(default={choice}):')
                print_color(bcolors.WARNING,message,lineend=False)
                temp=input()
                if(temp!=''):
                    try:
                        # try to convert choice to int
                        choice=int(temp)

                        # try to extract choice
                        temp=codecs[key][choice-1]
                    except:
                        # If failed, If invalid inputs
                        print_color(bcolors.FAIL,'- Error')
                        choice=100

            if choice<=size:
                choice-=1
                if not args.d and preferred_codecs.get(key)==None:
                    print_color(bcolors.OKCYAN,'Prefer this for other files also?(Y/n)(default=Y)',lineend=False)
                    prefer=input()
                    if(prefer.capitalize()!='N'):
                        preferred_codecs[key]=codecs[key][choice]
                    else:
                        print_color(bcolors.OKGREEN,'Defaulting to yes')
                codecs[key]=codecs[key][choice]
                break

   
       
    logger.debug(f"initial codecs: {codecs}")

    # if codec are allowed ones, no need to reencode
    streams=dict()
    for i in codecs.keys():
        streams[i]=codecs[i][3:4]

    allowed_codecs={
            'Video':'h264',
            'Audio':'aac',
            'Subtitle': 'mov_text'
        }

    print('-' * 40)
    print()
    for key in allowed_codecs.keys():
        if allowed_codecs[key] in codecs[key]:
            print_color(bcolors.OKGREEN,f"+ Supported {key} format")
            codecs[key] = 'copy'
        else:
            if 'Audio' in key:
                if not args.o:
                    print_color(bcolors.WARNING,f"! Unsupported {key} format, Converting it")
                    codecs[key]=allowed_codecs[key]
                else:
                    codecs[key]='copy'
            elif 'Video' in key:
                if not args.o:
                    print_color(bcolors.WARNING,f"! Unsupported {key} format, Converting it")
                    if preferred_choices.get(key)==None:

                        # extract the codec only
                        temp=codecs['Video'].split(':')[2]
                        if '(' in temp:
                            temp=temp.split('(')[0]
                        temp=temp.strip()

                        # ask user
                        convert_vid=input(f"current video codec is {temp}, convert it to h264?(y/N)(default=N)")

                        # defaults to N so only checking if Y entered
                        if(convert_vid.capitalize()=='Y'):
                            codecs[key]='h264'
                        else:
                            codecs[key]='copy'

                        print_color(bcolors.OKCYAN,'Prefer this for other files also?(Y/n)(default=Y)',lineend=False)
                        prefer=input()
                        if(prefer.capitalize()!='N'):
                            preferred_choices[key]=codecs[key]
                        else:
                            print_color(bcolors.OKGREEN,'Defaulting to yes',lineend=False)
                    else:
                        # If preferred choices found, use them
                        codecs[key]=preferred_choices[key]
                        print_color(bcolors.OKGREEN,f'+ Found {preferred_choices[key]} from preferred choices')
                    if codecs[key]!='copy':
                        # If we are changing codecs, notifiy user
                        print_color(bcolors.WARNING,f"! Converting {key} format")
                else:
                    # if copy only
                    codecs[key]='copy'
            else: 
                #Subtitles don't need any warning
                codecs[key]=allowed_codecs[key]

    logger.debug("Streams are: " + str(streams))

    # If we have to extract subs
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
            if overwrite_if_exists(final_subs_file):
                print_color(bcolors.OKCYAN,f"+ Extracting subs from {initial_subs_file}")

                # create the shell command
                sh = f'ffmpeg -y -i "{initial_subs_file}" -map 0:{streams["Subtitle"]} "{final_subs_file}"'
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
                success_subs=False
        else:
            print_color(bcolors.FAIL,f"- Err:{initial_subs_file} not found")
            success_subs=False

    # If subtitle only flag given, copy the video to the folder 
    if(args.o):
        print_color(bcolors.HEADER,f"* Copying Video to output_folder as copy only conversion given")

        # Using ffmpeg to show the copy progress, shutil copy doesn't have any helper function for that
        output_file_name=(os.path.join(output_dir,filename))
        if(overwrite_if_exists(output_file_name)):
            sh = f'ffmpeg -y -vsync 0 -hwaccel auto -i "{os.path.join(basedir,filename)}" -c copy "{output_file_name}"'

            logger.debug(sh)
            process=sp.Popen(sh,shell=True,stderr=sp.STDOUT,stdout=sp.PIPE,universal_newlines=True)

            success=get_output(process)
            
            if(success):
                print_color(bcolors.OKGREEN,f"+ Video Copied")
            else:
                print_color(bcolors.FAIL,f"- Some Error Occurred While Copying")
            continue

    logger.debug(f"final codecs: {codecs}")
    print_color(bcolors.OKCYAN,f"+ converting video {filename}")

    # if subs are successful and subtitles are to be embedded
    if(overwrite_if_exists(final_video_file)):
        if(not args.n and success_subs==True and not args.f):
            sh = f'ffmpeg -y -vsync 0 -threads {os.cpu_count()} -hwaccel auto -i "{os.path.join(basedir,filename)}" '
            #sh+=f'-f webvtt -i "{final_subs_file}" -map 1:0 '
            sh+=f'-f webvtt -i "{final_subs_file}" -map 1:0 '
            #sh+=f'-map 0:0 -map 0:1 -c:v {codecs["Video"]} -c:a {codecs["Audio"]} -c:s {codecs["Subtitle"]} "{final_video_file}"'
            sh+=f'-map 0:{streams["Video"]} -map 0:{streams["Audio"]} -c:v {codecs["Video"]} -c:a {codecs["Audio"]} -c:s {codecs["Subtitle"]} "{final_video_file}"'
        else:
            sh = f'ffmpeg -y -vsync 0 -threads {os.cpu_count()} -hwaccel auto -i "{os.path.join(basedir,filename)}" -map 0:{streams["Video"]} -map 0:{streams["Audio"]} -c:v {codecs["Video"]} -c:a {codecs["Audio"]} "{final_video_file}"'

        logger.debug(sh)
        process=sp.Popen(sh,shell=True,stderr=sp.STDOUT,stdout=sp.PIPE,universal_newlines=True)

        success=get_output(process)
        if(success):
            print_color(bcolors.OKGREEN,f"+ Converted {filename}")
        else:
            print_color(bcolors.FAIL,f"- Some error occurred while converting {filename}")


