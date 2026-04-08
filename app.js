// =======================
// WORD BANKS
// =======================
let easyWords = ["cake", "pie", "flan", "tart", "oreo", "milk", "jelly", "fudge", "chips", "candy"];
let mediumWords = ["donut", "cookie", "waffle", "brownie", "eclair", "muffin", "gelato", "sundae", "pudding", "cupcake"];
let hardWords = ["croissant", "macaron", "tiramisu", "cheesecake", "strudel", "baklava", "profiterole", "pavlova", "churros", "cannoli"];

// =======================
// VARIABLES
// =======================
let secretWord = "";
let guessedLetters = [];
let wrongGuesses = 0;
let maxWrong = 8;
let gameActive = false;
let currentDifficulty = "";
let playerGender = "male"; // stores player choice

// TIMER VARIABLES
let timeLeft = 180; // 3 minutes
let timerInterval = null; // will store the timer

// =======================
// GENDER POPUP
// =======================
function showGenderPopup(difficulty) {
  currentDifficulty = difficulty;

  // create a new div (popup background)
  let overlay = document.createElement("div");
  overlay.id = "genderOverlay";
  overlay.className = "gender-overlay";

  // add HTML inside popup
  overlay.innerHTML =
    "<div class='gender-popup'>" +
    "<h2 class='gender-popup__title'>Choose Character</h2>" +
    "<div class='gender-popup__options'>" +
    "<button class='gender-popup__button gender-popup__button--male' onclick=\"selectGender('male')\">Male</button>" +
    "<button class='gender-popup__button gender-popup__button--female' onclick=\"selectGender('female')\">Female</button>" +
    "</div>" +
    "</div>";

  // add popup to the page
  document.body.appendChild(overlay);
}

// runs when player clicks male/female
function selectGender(gender) {
  playerGender = gender; // save choice

  // remove popup
  let overlay = document.getElementById("genderOverlay");
  overlay.remove();

  // start the game
  startGame(currentDifficulty);
}

// =======================
// START GAME
// =======================
function startGame(difficulty) {
  currentDifficulty = difficulty;

  if (difficulty === "easy") {
    maxWrong = 8;
  } else if (difficulty === "medium") {
    maxWrong = 6;
  } else {
    maxWrong = 4;
  }

  guessedLetters = [];
  wrongGuesses = 0;
  gameActive = true;

  let wordList;

  if (difficulty === "easy") {
    wordList = easyWords;
  } else if (difficulty === "medium") {
    wordList = mediumWords;
  } else {
    wordList = hardWords;
  }

  // pick random word
  let randomIndex = Math.floor(Math.random() * wordList.length);
  secretWord = wordList[randomIndex];

  // reset screen
  document.getElementById("message").textContent = "";
  document.getElementById("guessed").textContent = "";
  document.getElementById("hangmanImage").src = "image.png";

  updateWordDisplay();

  // ONLY start timer in hard mode
  if (difficulty === "hard") {
    startTimer();
  }
}

// =======================
// UPDATE WORD DISPLAY
// =======================
function updateWordDisplay() {
  let display = "";

  for (let i = 0; i < secretWord.length; i++) {
    let letter = secretWord.charAt(i);
    let found = false;

    // check if letter was guessed
    for (let j = 0; j < guessedLetters.length; j++) {
      if (guessedLetters[j] === letter) {
        found = true;
      }
    }

    if (found) {
      display = display + letter + " ";
    } else {
      display = display + "_ ";
    }
  }

  document.getElementById("word").textContent = display;
}

// =======================
// HANDLE GUESS
// =======================
function handleGuess() {
  if (gameActive === false) {
    return;
  }

  let input = document.getElementById("guessInput");
  let guess = input.value.toLowerCase();
  input.value = "";

  if (guess.length !== 1) {
    document.getElementById("message").textContent = "Enter ONE letter!";
    return;
  }

  // check if already guessed
  for (let i = 0; i < guessedLetters.length; i++) {
    if (guessedLetters[i] === guess) {
      document.getElementById("message").textContent = "Already guessed!";
      return;
    }
  }

  guessedLetters.push(guess);

  let correct = false;

  // check if guess is in word
  for (let i = 0; i < secretWord.length; i++) {
    if (secretWord.charAt(i) === guess) {
      correct = true;
    }
  }

  if (correct) {
    document.getElementById("message").textContent = "Correct!";
  } else {
    wrongGuesses = wrongGuesses + 1;
    updateHangmanImage();
    document.getElementById("message").textContent = "Wrong guess!";
  }

  updateWordDisplay();

  // display guessed letters
  let guessedDisplay = "";
  for (let i = 0; i < guessedLetters.length; i++) {
    guessedDisplay = guessedDisplay + guessedLetters[i] + " ";
  }
  document.getElementById("guessed").textContent = guessedDisplay;

  checkGameStatus();
}

// =======================
// UPDATE IMAGE
// =======================
function updateHangmanImage() {
  let img = document.getElementById("hangmanImage");

  if (wrongGuesses === 0) img.src = "image.png";
  else if (wrongGuesses === 1) img.src = "image1.png";
  else if (wrongGuesses === 2) img.src = "image2.png";
  else if (wrongGuesses === 3) img.src = "image3.png";
  else if (wrongGuesses === 4) img.src = "image4.png";
  else if (wrongGuesses === 5) img.src = "image5.png";
  else if (wrongGuesses === 6) img.src = "image6.png";
  else {
    // final image depends on gender
    if (playerGender === "female") {
      img.src = "imagefemale.png";
    } else {
      img.src = "imagemale.png";
    }
  }
}

// =======================
// TIMER FUNCTIONS
// =======================
function startTimer() {
  clearInterval(timerInterval); // stop old timer

  timeLeft = 180; // reset time

  let timerElement = document.getElementById("timer");
  if (timerElement) {
    timerElement.textContent = timeLeft;
  }

  // run every second
  timerInterval = setInterval(function () {
    if (gameActive === false) {
      clearInterval(timerInterval);
      return;
    }

    timeLeft = timeLeft - 1;

    if (timerElement) {
      timerElement.textContent = timeLeft;
    }

    // if time runs out → lose
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame(false);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

// =======================
// CHECK WIN / LOSE
// =======================
function checkGameStatus() {
  let wordDisplay = document.getElementById("word").textContent;

  if (wordDisplay.indexOf("_") === -1) {
    endGame(true);
  } else if (wrongGuesses >= maxWrong) {
    endGame(false);
  }
}

// =======================
// END GAME
// =======================
function endGame(win) {
  gameActive = false;
  stopTimer();

  if (win) {
    document.getElementById("message").textContent = "YOU WIN!";
  } else {
    document.getElementById("message").textContent =
      "Game Over! Word: " + secretWord;
    updateHangmanImage();
  }
}

// =======================
// RESTART
// =======================
function restartGame() {
  startGame(currentDifficulty);
}

// =======================
// ENTER KEY SUPPORT
// =======================
document.addEventListener("DOMContentLoaded", function () {
  let input = document.getElementById("guessInput");

  if (input) {
    input.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        handleGuess();
      }
    });
  }
});