echo off
SET PATH=%~dp0python_dist;%PATH%
echo Weocome to the Python environment for COSC3000 graphics labs. Each lab should be unzipped into the same folder as this cmd file. To run a lab, do for example:
echo cd lab1\code\
echo python lab1.py
echo or simply:
echo python lab1\code\lab1.py
echo It is important that you give the command "python ??" explicitly since if you just do for example:
echo lab1\code\lab1.py
echo it will use the installed python distribution, instead of the packaged lab one.
cmd /Q
pause