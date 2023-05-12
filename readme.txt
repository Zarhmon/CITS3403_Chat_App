This is the readme containing the steps to run the project. NOT COMPLETE DRAFT. 

To create a environment for Python while in project folder path in terminal type
"py -m venv venv"

To launch the evnironment in project folder path in terminal run
Windows: "venv\Scripts\activate" 
Linux/MacOS: "source venv/bin/activate"

To install the dependencies run "pip install -r requirments.txt" in venv path terminal

**The requirments below may be needed before running "pip install -r requirments.txt"**
To run the MySQL server the following requirments are needed from: 
https://visualstudio.microsoft.com/visual-cpp-build-tools/ 
    1. MSVC v143 -VS 2022 C++ x64/x86 build tools (v14.35-17.5)
    2. Windows 10 SDK (100.0.18362.0)
    
    To run the server in terminal run "flask run"

    or 

    py -u "c:\Users\zarhm\Documents\GitHub\CITS3403_Chat_App\app.py"   

    Powershell
    PS C:\Users\zarhm> $env:FLASK_APP = "app.py"
    PS C:\Users\zarhm> flask run
