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
var lettersGuessed; // array of chars (can be sorted)
var score;
var wordJson; // JSON of word's dictionary entry from dictionary API

// score system:
// easy: +1 per correct, medium: +2, hard: +3
// -1 per incorrect on all difficulties

function initHangman(len) {
  // uses an API to get a random word of length `len`, and then stores that in `word`
  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://random-word-api.herokuapp.com/word?length=" + len, true);
  xhttp.onload = function () {
    if (this.status == 200) {
      word = JSON.parse(this.responseText)[0];
      checkForDictionaryEntry(word); // check if a dictionary entry exists in the dictionary API
    }
  }
  xhttp.send();
}

// API: https://dictionaryapi.dev/
function checkForDictionaryEntry(word) {
  let xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://api.dictionaryapi.dev/api/v2/entries/en/" + word, true);
  xhttp.onload = function () {
    if (this.status == 200) {
      // dictionary extry exists
      wordJson = JSON.parse(this.responseText)[0];
      triesLeft = 9 - difficulty;
      lettersGuessed = [];
      guess = new Array();
      isPlaying = true;
      score = 0;
      for (let i = 0; i < word.length; i++) guess[i] = "_";
      sendClue();

    } else if (this.status == 404) {
      // too hard - no dictionary entry exists for this word, so try another one
      initHangman(Math.floor(Math.random() * 5) + 6);
    }
  }
  xhttp.send();
}

function getDefinition() {
  let meanings = wordJson.meanings;
  if (meanings === undefined) {
    addMessage(`Unfortunately, no definition could be found for <b>${word}</b>.`, false, true);
  } else {
    let text = `Here are some definitions for <b>${word}</b>:<br><br>`;
    for (let i in meanings) {
      let meaning = meanings[i];
      text += `<i>${meaning.partOfSpeech}</i><br>`;
      text += "<ol>";
      for (let j in meaning.definitions) {
        text += `<li>${meaning.definitions[j].definition}</li>`;
      }
      text += "</ol>"
    }
    let license = wordJson.license;
    text += "<br><small>"
    if (wordJson.sourceUrls.length == 1) {
      let source = wordJson.sourceUrls[0];
      text += `Source: <a href=${source}>${source}</a><br>`; 
    } else {
      text += "Sources:<ul>"
      for (let i in wordJson.sourceUrls) {
        let source = wordJson.sourceUrls[i];
        text += `<li><a href=${source}>${source}</a></li>`;
      }
      text += "</ul>"
    }
    text += `Under license: ${license.name} (<a href=${license.url}>${license.url}</a>)</small><br><br>`;
    text += "Hopefully, you have learned a new word today!";
    addMessage(text, false, true);
  }
}

function sendClue(header) {
  // bot sends a message for this clue
  var text = guess.join(' ') + "<br><br>Tries remaining: " + triesLeft;
  if (lettersGuessed) {
    text += "<br><br><br>" + lettersGuessed.join(" ");
  }
  text += "<br><br>Score: " + score;
  addMessage(text, false, true);
}

function guessLetter(letter) {
  // player guesses the letter `letter`
  letter = letter.toUpperCase();
  if (!lettersGuessed.includes(letter)) {
    // has not yet been guessed
    lettersGuessed[lettersGuessed.length] = letter;
    lettersGuessed.sort();
    let foundMatch = false;
    for (let i = 0; i < word.length; i++) {
      if (word[i].toUpperCase() == letter) {
        foundMatch = true;
        guess[i] = letter;
      }
    }
    if (foundMatch) {
      addMessage(`Found match for <b>${letter}</b>`, false, true);
      score += difficulty;
    } else {
      addMessage(`No match for <b>${letter}</b>`, false, true);
      if (score-- == 0) score = 0;
    }

    if (!foundMatch && --triesLeft == 0) {
      sendClue();
      addMessage(`You lose...<br><br>The answer is: <b>${word}</b><br><br>Score: ${score}`, false, true);
      isPlaying = false;
      storeScore(score);  // Store the score after the game ends
    } else {
      sendClue();
      if (!guess.includes('_')) {
        let highscore = highscores[difficulty - 1];
        let message = `You win!<br><br>Score:${score}<br>`;
        if (score > highscore) {
          message += `New highscore! (Previously ${highscore})`;
          highscores[difficulty - 1] = score;
        } else {
          message += 'Highscore: ' + highscore;
        }
        addMessage(message, false, true);
        isPlaying = false;
        storeScore(score);  // Store the score after the game ends
      }

    }

    if (!isPlaying) {
      justCompletedGame = true;
      addMessage("Do you know this word?");
      storeScore(score);  // Store the score after the game ends
    }


  } else {
    addMessage(`<b>{${letter}}</b> has already been guessed.`, false, true);
  }
}

// initHangman();
