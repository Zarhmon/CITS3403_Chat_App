
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
    addMessage(messageText, true);

    // clear the input field
    inputField.value = "";
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
