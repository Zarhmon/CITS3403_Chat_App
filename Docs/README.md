# CITS3403_Chat_App

Zarhmon Knipping (22856487)
Blake Griffiths (22764777)
Farrel Kurniawan (23057954)
Due May 22nd, 2023

# Context

This application was designed to play a simple game of hangman that uses an uncommon library of words
to help the user learn while playing a game.

It consists of 3 html pages including a login, game (main) and highscores page.

We used a high scores mechanic and difficulty levels to make the content more engaging,
in combination with the large library of words we aimed to make the gameplay loop replay-able.

Technology
We used html and CSS to construct the structure and interface of the web application.
JavaScript was to handle gameplay and backend elements of the application such as page navigation.
Pythons Flask was used to interact with out MySQL server which was used to store user details such as login / account credentials,
as well as holding our lists of high scores.
We used Visual Studio Codes Prettier plugin to make sure that our code followed the same syntax.

# Board for agile / contribution:

https://github.com/users/Zarhmon/projects/1/views/1

GitLog.png in Docs file contains the git log

# Project github:

https://github.com/Zarhmon/CITS3403_Chat_App

# Member Contribution

Blake
• Game rule creation
• Game research
• Unit & User Acceptance Testing
• Meeting lead & Minutes taker
Zarhmon
• UX design and implementation
• Front and backend
• Database creation and implementation
• Documentation
Farrel
• Game research
• Game rule creation
• Game implementation
• Systems creation

# This is the readme containing the steps to run the project.

# To create a environment for Python while in project folder path in terminal type

"py -m venv venv"

# To launch the environment in project folder path in terminal run

Windows: "venv\Scripts\activate"
Linux/MacOS: "source venv/bin/activate"

# To install the dependencies run

"pip install -r requirments.txt" in venv path terminal

# To start the project in terminal / powershell while in the project path

$env:FLASK_APP = "app.py"
flask run

# To start the MySQL server in windows

(the tables and data should work in any database but flask is set up specifically for MySQL in our project)

Dummy data including login details and highscores can be found in the "MySQL" folder in csv format
Table_Creation will create the two tables required "users" "game_scores"
db_params can be updated in app.py below is what is currently set

db_params = {
'host': 'localhost',
'user': 'root',
'password': 'SQLPASSWORD',
'db': 'CITS3403_CHAT_APP'
}

Download the following from : https://dev.mysql.com/downloads/installer/
Windows (x86, 32-bit), MSI Installer
(mysql-installer-community-8.0.33.0.msi)
standard install

In windows search function open "Services"
Scroll the MySQL80 and click start to launch MySQL server

Launch the MySQL workbench and create a new connection
Name the connection CITS3403_CHAT_APP and add the DB params mentioned above
In the schemas tab import a table with the csv files in the project

The server will be set up and the project can be run with flask run in the file path

# To run unit tests for app.py

type in "cd Testing" while in the root directory
then type in "python -W ignore -m appunittests

NOTE: If an error returns saying "ModuleNotFoundError: No module named 'app'", it may be because the 'app' module is not in the python import search path, to
rectify this type the following into the command line before running the unit tests again "$env:PYTHONPATH = "path/to/parent/directory/of/app/module" "


# If having errors the following may needed be download on the machine

To run the MySQL server the following requirments are needed from:
https://visualstudio.microsoft.com/visual-cpp-build-tools/

    1. MSVC v143 -VS 2022 C++ x64/x86 build tools (v14.35-17.5)
    2. Windows 10 SDK (100.0.18362.0)
