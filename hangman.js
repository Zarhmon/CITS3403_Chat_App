// js for the Hangman game

// to play, enter something containing "play" and "hangman" into the chatbox
// to quit, enter something containing "quit" or "exit"
// to make a guess, enter only a letter from a - z

var highscores = [0, 0, 0]; // e, m, h highscores (data will have to be stored in a db)
var difficulty;
var word; // the actual word, e.g. "hangman"
var triesLeft; // tries remaining
var guess;  // an array that shows the correct guesses, e.g.
            // ["h", "_", "n", "_", "_", "a", "n"]
var lettersGuessed; // string of letters guessed
var score;
var consecGuesses;

// score system: +1 for each correct guess, bonus +1 for each consecutive correct guess
// -1 for each mistake, resets consecutive streak

function initHangman(len) {
  // uses an API to get a random word of length `len`, and then stores that in `word`
  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://random-word-api.herokuapp.com/word?length=" + len, true);
  xhttp.onload = function() {
    if (this.status == 200) {
      word = JSON.parse(this.responseText)[0];
      triesLeft = 8; // chose arbitrary value
      lettersGuessed = "";
      guess = new Array();
      isPlaying = true;
      score = 0;
      consecGuesses = 0;
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
  text += "<br><br>Score: " + score;
  addMessage(text, false, true);
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
      score += 1 + consecGuesses++;
    } else {
      addMessage("No match for '" + letter + "'", false);
      consecGuesses = 0;
      if (--score == -1) score = 0;
    }

    if (!foundMatch && --triesLeft == 0) {
      sendClue();
      addMessage('You lose.<br>The answer is: ' + word + '<br><br>Score: ' + score, false, true);
      isPlaying = false;
    } else {
      sendClue();
      if (guess.indexOf('_') == -1) {
        let highscore = highscores[difficulty - 1];
        let message = 'You win!<br><br>Score: ' + score + '<br>';
        if (score > highscore) {
          message += 'New highscore! (Previously ' + highscore + ')';
          highscores[difficulty - 1] = score;
        } else {
          message += 'Highscore: ' + highscore;
        }
        addMessage(message, false, true);
        isPlaying = false;
      }
      
    }

    if (!isPlaying) {
      justCompletedGame = true;
      addMessage("Would you like to play again?")
    }
    

  } else {
    addMessage("'" + letter + "' has already been guessed.");
  }
}

// initHangman();
