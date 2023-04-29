// js for the Hangman game

// to play, enter something containing "play" and "hangman" into the chatbox
// to quit, enter something containing "quit" or "exit"
// to make a guess, enter only a letter from a - z

var isPlaying = false;
var word; // the actual word, e.g. "hangman"
var triesLeft; // tries remaining
var guess;  // an array that shows the correct guesses, e.g.
            // ["h", "_", "n", "_", "_", "a", "n"]
var lettersGuessed; // string of letters guessed

function initHangman(len) {
  // uses an API to get a random word of length `len`, and then stores that in `word`
  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://random-word-api.herokuapp.com/word?length=" + len, true);
  xhttp.onload = function() {
    if (this.status == 200) {
      word = JSON.parse(this.responseText)[0];
      triesLeft = len + 3; // chose arbitrary value
      lettersGuessed = "";
      guess = new Array();
      isPlaying = true;
      for (let i = 0; i < len; i++) guess[i] = "_";
      sendClue();
    }
  }
  xhttp.send();
}

function sendClue(header) {
  // bot sends a message for this clue
  var text = guess.join(' ') + "<br><br>Tries remaining: " + triesLeft;
  if (lettersGuessed) {
    text += "<br><br><br>";
    for (let i = 0; i < lettersGuessed.length; i++) {
      if (i > 0) text += ' ';
      text += lettersGuessed[i];
    }
  }
  addMessage(text, false);
}

function guessLetter(letter) {
  // player guesses the letter `letter`
  letter = letter.toUpperCase();
  if (!lettersGuessed.includes(letter)) {
    // has not yet been guessed
    lettersGuessed += letter;
    let foundMatch = false;
    for (let i = 0; i < word.length; i++) {
      if (word[i].toUpperCase() == letter) {
        foundMatch = true;
        guess[i] = letter;
      }
    }
    if (foundMatch) {
      addMessage("Found match for '" + letter + "'", false);
    } else {
      addMessage("No match for '" + letter + "'", false);
    }

    if (!foundMatch && --triesLeft == 0) {
      sendClue();
      addMessage('Game over.<br>Word: ' + word, false);
      isPlaying = false;
    } else {
      sendClue();
      if (guess.indexOf('_') == -1) {
        addMessage('You win!', false);
        isPlaying = false;
      }
      
    }
    

  } else {
    addMessage("'" + letter + "' has already been guessed.");
  }
}

// initHangman();
