// Get user information and avatar from sessionStorage
const userAvatar = document.getElementById("user-avatar");
const userName = document.getElementById("user-name");

if (
  sessionStorage.getItem("user_name") &&
  sessionStorage.getItem("user_image")
) {
  userAvatar.src = sessionStorage.getItem("user_image");
  userName.textContent = sessionStorage.getItem("user_name");
} else if (sessionStorage.getItem("user_name") === "Guest") {
  userAvatar.src = "https://via.placeholder.com/40";
  userName.textContent = "Guest";
} else {
  // Redirect the user to the login page if they haven't logged in
  window.location.href = "login.html";
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
function addMessage(messageText, isOutgoing) {
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
  textDiv.innerHTML = "<p>" + messageText + "</p>";
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
    interpret(messageText);

  }
}

// add an event listener to the send button to handle sending a new message
sendButton.addEventListener("click", sendMessage);

// add an event listener to the input field to handle sending a new message when the user presses Enter
inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function interpret(text) {
  // temporary (?) function: interprets the user input for words related to the game
  text = text.toLowerCase();
  if (isPlaying) {
    if (text.includes("quit") || text.includes("exit")) {
      // exit the game (to be implemented)
      isPlaying = false;

    } else if (text.length == 1 && 'a' <= text && text <= 'z') {
      // player enters a letter from a - z
      guessLetter(text);
    }
  } else {
    if (text.includes("play") && text.includes("hangman")) {
      initHangman(Math.floor(Math.random() * 6) + 5)
    }
  }
}

// Add an event listener to the sign out button
const signOutButton = document.getElementById("sign-out");
signOutButton.addEventListener("click", signOut);
