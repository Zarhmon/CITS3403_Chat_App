# CITS3403_Chat_App

This is the readme containing the steps to run the project.

# To create a environment for Python while in project folder path in terminal type

"py -m venv venv"

# To launch the evnironment in project folder path in terminal run

Windows: "venv\Scripts\activate"
Linux/MacOS: "source venv/bin/activate"

# To install the dependencies run

"pip install -r requirments.txt" in venv path terminal

# To start the project in terminal / powershell while in the project path

$env:FLASK_APP = "app.py"
flask run

# To start the MySQL server in windows

In windows search function open "Services"
Scroll the MySQL80 and click start

# If having errors the following may needed be download on the machine

To run the MySQL server the following requirments are needed from:
https://visualstudio.microsoft.com/visual-cpp-build-tools/

    1. MSVC v143 -VS 2022 C++ x64/x86 build tools (v14.35-17.5)
    2. Windows 10 SDK (100.0.18362.0)
