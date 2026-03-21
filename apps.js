// =========================
// WORD BANKS
// =========================
let easyWords = ["cake","pie","flan","tart","donut"];
let mediumWords = ["cookie","brownie","waffle","pudding"];
let hardWords = ["cheesecake","tiramisu","croissant","macaron"];


// =========================
// GAME VARIABLES
// =========================
let chosenWord = "";
let guessedLetters = [];
let guessesLeft = 0;
let maxGuesses = 0;
let gameOver = false;
let timer = null;
let timeLeft = 180; // 180 seconds (3 minutes) for hard mode


// =========================
// PAGE LOAD SETUP
// =========================
createAlphabetButtons();


// =========================
// CREATE ALPHABET BUTTONS
// =========================
function createAlphabetButtons() {
  const alphabetContainer = document.getElementById("alphabet");
  if (!alphabetContainer) return; // Skip if element doesn't exist (easy/medium modes)

  alphabetContainer.innerHTML = ""; // Clear existing buttons

  for (let i = 65; i <= 90; i++) { // A-Z
    const letter = String.fromCharCode(i);
    const button = document.createElement("button");
    button.textContent = letter;
    button.className = "alphabet-btn";
    button.id = "btn-" + letter.toLowerCase();
    button.addEventListener("click", function() {
      handleGuess(letter.toLowerCase());
    });
    alphabetContainer.appendChild(button);
  }
}


// =========================
// UPDATE BUTTON STATE
// =========================
function updateButtonState(letter, isCorrect) {
  const button = document.getElementById("btn-" + letter);
  if (button) {
    button.disabled = true;
    if (isCorrect) {
      button.classList.add("correct");
    } else {
      button.classList.add("incorrect");
    }
  }
}

// =========================
// RESET BUTTONS
// =========================
function resetButtons() {
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i).toLowerCase();
    const button = document.getElementById("btn-" + letter);
    if (button) {
      button.disabled = false;
      button.classList.remove("correct", "incorrect");
    }
  }
}


// =========================
// START GAME
// =========================
function startGame(difficultyGuesses) {

  console.log("Game starting...");

  maxGuesses = difficultyGuesses;

  let wordBank;

  if (maxGuesses === 8) {
    wordBank = easyWords;
  } 
  else if (maxGuesses === 6) {
    wordBank = mediumWords;
  } 
  else {
    wordBank = hardWords;
  }

  // pick random word
  chosenWord = wordBank[Math.floor(Math.random() * wordBank.length)];

  guessedLetters = [];
  guessesLeft = maxGuesses;
  gameOver = false;

  // reset UI
  document.getElementById("guessesLeft").textContent = guessesLeft;
  document.getElementById("usedLetters").textContent = "";
  document.getElementById("message").textContent = "";

  document.getElementById("guessInput").disabled = false;
  document.getElementById("guessBtn").disabled = false;

  // reset alphabet buttons
  resetButtons();

  // reset visuals
  updateWord();
  updateCake();
  resetHangman();

  // start timer for hard mode
  if (maxGuesses === 4) {
    timeLeft = 180;
    updateTimerDisplay();
    startTimer();
  } else {
    stopTimer();
  }
}


// =========================
// HANDLE GUESS
// =========================
function handleGuess(guess) {

  if (gameOver) return;

  // If no guess provided, try to get from input (fallback for easy/medium)
  if (!guess) {
    let input = document.getElementById("guessInput");
    if (input) {
      guess = input.value.toLowerCase().trim();
      input.value = "";
    }
  }

  // VALIDATION
  if (!guess || guess.length !== 1 || !/[a-z]/.test(guess)) {
    document.getElementById("message").textContent = "Enter ONE letter only!";
    return;
  }

  // DUPLICATE CHECK
  if (guessedLetters.includes(guess)) {
    document.getElementById("message").textContent = "You already guessed that!";
    return;
  }

  guessedLetters.push(guess);

  document.getElementById("usedLetters").textContent =
    guessedLetters.join(", ");

  // WRONG GUESS
  if (!chosenWord.includes(guess)) {
    guessesLeft--;
    updateCake();
    updateHangman();
    updateButtonState(guess, false); // Mark as incorrect
  } else {
    updateButtonState(guess, true); // Mark as correct
  }

  document.getElementById("guessesLeft").textContent = guessesLeft;

  updateWord();
  checkGame();
}


// =========================
// UPDATE WORD DISPLAY
// =========================
function updateWord() {

  let display = "";

  for (let i = 0; i < chosenWord.length; i++) {

    let letter = chosenWord.charAt(i);

    if (guessedLetters.includes(letter)) {
      display += letter + " ";
    } else {
      display += "_ ";
    }

  }

  document.getElementById("wordDisplay").textContent = display;
}


// =========================
// CHECK WIN / LOSE
// =========================
function checkGame() {

  let won = true;

  for (let i = 0; i < chosenWord.length; i++) {
    if (!guessedLetters.includes(chosenWord.charAt(i))) {
      won = false;
      break;
    }
  }

  if (won) {
    document.getElementById("message").textContent = "🎉 You Win!";
    endGame();
  }
  else if (guessesLeft === 0) {
    document.getElementById("message").textContent =
      "💀 Game Over! Word was: " + chosenWord;
    endGame();
  }
}


// =========================
// END GAME
// =========================
function endGame() {
  stopTimer();
  gameOver = true;

  document.getElementById("guessInput").disabled = true;
  document.getElementById("guessBtn").disabled = true;
}


// =========================
// CAKE IMAGE SYSTEM 🍰
// =========================
function updateCake() {
  let healthText = "";
  for (let i = 0; i < guessesLeft; i++) {
    healthText += "🍰";
  }
  document.getElementById("healthDisplay").textContent = healthText;
}


// =========================
// DESSERT HANGMAN 🍩
// =========================
function updateHangman() {

  let parts = document.querySelectorAll(".part");

  let wrongGuesses = maxGuesses - guessesLeft;

  for (let i = 0; i < parts.length; i++) {

    if (i < wrongGuesses) {
      parts[i].style.display = "block";
    } else {
      parts[i].style.display = "none";
    }

  }
}


// RESET HANGMAN
function resetHangman() {

  let parts = document.querySelectorAll(".part");

  for (let i = 0; i < parts.length; i++) {
    parts[i].style.display = "none";
  }
}


// =========================
// coded through outside sources 
// TIMER FUNCTIONS
// =========================


function startTimer() {
  stopTimer(); // clear any existing timer
  timer = setInterval(function() {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      stopTimer();
      document.getElementById("message").textContent = " Time's up! Game Over! Word was: " + chosenWord;
      endGame();
    }
  }, 1000);
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function updateTimerDisplay() {
  let timerElement = document.getElementById("timerDisplay");
  if (timerElement) {
    timerElement.textContent = timeLeft;
  }
}