MEDIA FOLDER
============

Put your recordings in this folder.

The website currently expects these two files:

  1. project-walkthrough.mp4   -> the video player in the "Video & Audio Updates" section
  2. team-update.mp3           -> the audio player in the same section

WHERE THEY COME FROM
--------------------
- project-walkthrough.mp4 : your PowerPoint/screen-recording export of the site walkthrough
- team-update.mp3         : any voice recording (Windows Voice Recorder exports .m4a --
                            either convert it to .mp3, or change the filename/type in
                            index.html to match)

UNTIL YOU ADD THEM
------------------
The players will show but won't play (the file simply isn't found yet). This does NOT
break the page -- everything else works normally.

TO ADD MORE RECORDINGS LATER
----------------------------
1. Drop the new file in this folder.
2. Open index.html, find the "07 / Media" section.
3. Copy an existing <div class="card video-card"> block and paste it below.
4. Change the <source src="media/YOUR-NEW-FILE.mp4"> and the heading/description text.

FILE SIZE TIP
-------------
GitHub has a 100 MB per-file limit. If your video is larger, either export at a lower
quality, or upload it to YouTube/OneDrive and embed/link it instead.
