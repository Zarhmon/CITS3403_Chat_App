// Get user information and avatar from sessionStorage
const userAvatar = document.getElementById("user-avatar");
const userName = document.getElementById("user-name");

var messageHistory = [""]; // the message history, which always ends with an empty string
var numMessages = 0; // messages sent
var selectedMessage = 0; // which message in the message history is selected when pressing up/down in the textbox
var isSelectingDifficulty = false;
var isPlaying = false;
var justCompletedGame = false;

if (
  sessionStorage.getItem("user_name") &&
  sessionStorage.getItem("user_image")
) {
  userAvatar.src = sessionStorage.getItem("user_image");
  userName.textContent = sessionStorage.getItem("user_name");
} else if (sessionStorage.getItem("user_name") === "Guest") {
  userAvatar.src = "https://via.placeholder.com/40";
  userName.textContent = "Guest";
}

// select the chat input field and send button
const inputField = document.querySelector(
  ".chat-input input[type='text']"
);
const sendButton = document.querySelector(
  ".chat-input input[type='submit']"
);

// select the chat box where messages will be displayed
const chatBox = document.querySelector(".chat-box");

// function to add a new message to the chat box
function addMessage(messageText, isOutgoing, isInnerHTML) {
  // create a new message div
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");

  // add an avatar image to the message div
  const avatarDiv = document.createElement("div");
  avatarDiv.classList.add("avatar");
  messageDiv.appendChild(avatarDiv);

  // add the message text to the message div
  const textDiv = document.createElement("div");
  textDiv.classList.add("text");
  if (isInnerHTML) { // check if the text should be parsed as innerText or innerHTML
    textDiv.innerHTML = "<p>" + messageText + "</p>";
  } else {
    const textP = document.createElement("p");
    textP.innerText = messageText;
    textDiv.appendChild(textP);
  }
  messageDiv.appendChild(textDiv);

  // add a class to the message div to indicate whether it's an outgoing message or not
  if (isOutgoing) {
    messageDiv.classList.add("outgoing");
  }

  // add the message div to the chat box
  chatBox.appendChild(messageDiv);

  // scroll the chat box to the bottom to show the latest message
  chatBox.scrollTop = chatBox.scrollHeight;
}

// function to handle sending a new message
function sendMessage() {
  // get the text from the input field
  const messageText = inputField.value;

  // only add a new message if the input field isn't empty
  if (messageText.trim() !== "") {
    // add the new message to the chat box
    inputField.value = "";
    addMessage(messageText, true);
    messageHistory[numMessages++] = messageText;
    messageHistory[numMessages] = "";
    selectedMessage = numMessages;
    interpret(messageText);

  }
}

// add an event listener to the send button to handle sending a new message
sendButton.addEventListener("click", sendMessage);

// add an event listener to the input field to handle sending a new message when the user presses Enter
inputField.addEventListener("keydown", function (event) {
  let key = event.key;
  if (key === "Enter") {
    sendMessage();
  } else if (key === "ArrowUp") {
    // pressing up arrow in the textbox selects the previous message, similar to the way
    // console terminals work
    if (--selectedMessage < 0) selectedMessage++;
    this.value = messageHistory[selectedMessage];
  } else if (key === "ArrowDown") {
    // likewise for down arrow
    if (++selectedMessage > numMessages) selectedMessage--;
    this.value = messageHistory[selectedMessage];

  }
});

function interpret(text) {
  // interprets the user input for words related to the game
  text = text.toLowerCase();
  if (isPlaying) {
    // playing the game
    if (text.hasAnyOf("quit", "exit")) {
      addMessage("Exiting hangman.");
      isPlaying = false;

    } else if (text.length == 1 && 'a' <= text && text <= 'z') {
      // player enters a letter from a - z
      guessLetter(text);

    }
  } else {
    // not playing the game
    if (isSelectingDifficulty) {

      if (text.hasAnyOf("quit", "exit", "nevermind")) {
        isSelectingDifficulty = false;
        addMessage("You have decided not to play hangman.<br>\
        If you change your mind, you can enter \"play hangman\" to play again.", false, true);
      } else {
        if ((text.length == 1 && '1' <= text && text <= '3') || text.hasAnyOf("easy", "medium", "hard")) {
          if (text.includes("easy")) {
            difficulty = 1;
          } else if (text.includes("medium")) {
            difficulty = 2;
          } else if (text.includes("hard")) {
            difficulty = 3;
          } else {
            difficulty = text - '0'; // text as integer
          }
          addMessage("Now playing hangman on " + ["easy", "medium", "hard"][difficulty - 1] + " difficulty.");
          addMessage("Enter a letter from A - Z to guess it.");
          isSelectingDifficulty = false;
          initHangman(Math.floor(Math.random() * 3) + 3 * (1 - difficulty) + 10);
        }
      }
    // not in the difficulty selection mode
    } else {
      if (justCompletedGame) {
        if (text.hasAnyOf("yes", "play", "yeah")) {
          justCompletedGame = false;
          interpret("play hangman");
        } else if (text.hasAnyOf("no", "do not", "don't")) {
          justCompletedGame = false;
          addMessage("You are no longer playing hangman.");
        }

        // in main menu
      } else {

        if (text.hasAllOf("play", "hangman")) {
          addMessage("Select a difficulty by entering one of the following:<br><br>\
          1: Easy (8 tries allowed)<br>\
          2: Medium (7 tries allowed)<br>\
          3: Hard (6 tries allowed)<br><br>\
          Alternatively, enter \"quit\" if you do not wish to play.", false, true);
          isSelectingDifficulty = true;
        } else if (text.hasAnyOf("highscore", "record", "high score")) {
          addMessage("Your highscores:<br><br>\
          Easy:   " + highscores[0] + "<br>\
          Medium: " + highscores[1] + "<br>\
          Hard:   " + highscores[2], false, true)
        } else if (text.hasAnyOf("help", "instruction", "what do i do", "guide", "what can i do")) {
          addMessage("Enter \"play hangman\" if you would like to play!<br>To view highscores, enter \"highscore\".", false, true);
        }
      }

    }
  }
}

String.prototype.hasAnyOf = function (...words) {
  let len = words.length;
  for (let i = 0; i < len; i++) {
    if (this.includes(words[i])) return true;
  }
  return false;
}

String.prototype.hasAllOf = function (...words) {
  let len = words.length;
  for (let i = 0; i < len; i++) {
    if (!this.includes(words[i])) return false;
  }
  return true;
}

// Add an event listener to the sign out button
console.log('Adding event listener to sign out button');
const signOutButton = document.getElementById("sign-out");
signOutButton.addEventListener("click", signOut);

function chatbotInit() {
  addMessage("Hello, " + sessionStorage.getItem("user_name") + "! Would you like to play hangman?<br><br>\
  To play hangman, enter \"play hangman\" into the chatbox.", false, true);
}

setTimeout(() => { chatbotInit(); }, 500); // pause for 0.5 secs (for effect) and then init
