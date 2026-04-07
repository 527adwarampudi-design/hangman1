// =======================
// WORD BANKS BY DIFFICULTY 
// =======================
let easyWords = [
  "cake", "pie", "flan", "tart", "oreo",
  "milk", "jelly", "fudge", "chips", "candy"
];

let mediumWords = [
  "donut", "cookie", "waffle", "brownie", "eclair",
  "muffin", "gelato", "sundae", "pudding", "cupcake"
];

let hardWords = [
  "croissant", "macaron", "tiramisu", "cheesecake", "strudel",
  "baklava", "profiterole", "pavlova", "churros", "cannoli"
];

// =======================
// GAME VARIABLES
// =======================
let secretWord = "";
let guessedLetters = [];
let wrongGuesses = 0;
let maxWrong = 8; // Easy mode = 8 lives
let gameActive = false;
let currentDifficulty = "";
let playerGender = "male";

// Timer variables
let timeLeft = 180;
let timerInterval = null;

// =======================
// GENDER POPUP
// =======================
function showGenderPopup(difficulty) {
  currentDifficulty = difficulty;
  
  const overlay = document.createElement('div');
  overlay.id = 'genderOverlay';
  overlay.className = 'gender-overlay';
  
  overlay.innerHTML = `
    <div class="gender-popup">
      <h2 class="gender-popup__title"> Welcome to ${difficulty.toUpperCase()} Mode!</h2>
      <p class="gender-popup__text">Choose your final character:</p>
      <div class="gender-popup__options">
        <button type="button" class="gender-popup__button gender-popup__button--male" onclick="selectGender('male')">Male</button>
        <button type="button" class="gender-popup__button gender-popup__button--female" onclick="selectGender('female')">Female</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
}

function selectGender(gender) {
  playerGender = gender;
  localStorage.setItem('hangmanGender', gender);
  document.getElementById('genderOverlay').remove();
  startGame(currentDifficulty);
}

// =======================
// START GAME
// =======================
function startGame(difficulty) {
  if (difficulty === "easy") maxWrong = 8;
  if (difficulty === "medium") maxWrong = 6;
  if (difficulty === "hard") maxWrong = 4;

  guessedLetters = [];
  wrongGuesses = 0;
  gameActive = true;

  let wordList = difficulty === "easy" ? easyWords : 
                difficulty === "medium" ? mediumWords : hardWords;
  
  secretWord = wordList[Math.floor(Math.random() * wordList.length)].toLowerCase();

  // Reset UI
  document.getElementById("message").textContent = "";
  document.getElementById("guessed").textContent = "";
  document.getElementById("hangmanImage").src = "image.png"; // Start image
  updateWordDisplay();

  if (difficulty === "hard") startTimer();
}

// =======================
// UPDATE HANGMAN IMAGE (YOUR SPECIFIC IMAGES)
// =======================
function updateHangmanImage() {
  let imagePath;
  
  if (wrongGuesses === 0) imagePath = "image.png";
  else if (wrongGuesses === 1) imagePath = "image1.png";
  else if (wrongGuesses === 2) imagePath = "image2.png";
  else if (wrongGuesses === 3) imagePath = "image3.png";
  else if (wrongGuesses === 4) imagePath = "image4.png";
  else if (wrongGuesses === 5) imagePath = "image5.png";
  else if (wrongGuesses === 6) imagePath = "image6.png";
  else if (wrongGuesses >= 7) {
    // FINAL IMAGE - Gender specific
    imagePath = playerGender === "female" ? "imagefemale.png" : "imagemale.png";
  }
  
  const img = document.getElementById("hangmanImage");
  img.src = imagePath;
}

// =======================
// OTHER FUNCTIONS (updateWordDisplay, handleGuess, etc.)
// =======================
function updateWordDisplay() {
  let display = "";
  for (let i = 0; i < secretWord.length; i++) {
    display += guessedLetters.includes(secretWord[i]) ? secretWord[i] + " " : "_ ";
  }
  document.getElementById("word").textContent = display.trim();
}

function handleGuess() {
  if (!gameActive) return;

  let input = document.getElementById("guessInput");
  let guess = input.value.toLowerCase().trim();
  input.value = "";

  if (guess.length !== 1 || !/[a-z]/.test(guess)) {
    document.getElementById("message").textContent = "Enter ONE letter A-Z!";
    return;
  }

  if (guessedLetters.includes(guess)) {
    document.getElementById("message").textContent = "Already guessed!";
    return;
  }

  guessedLetters.push(guess);

  if (secretWord.includes(guess)) {
    document.getElementById("message").textContent = "Correct!";
  } else {
    wrongGuesses++;
    updateHangmanImage();
    document.getElementById("message").textContent = "Wrong guess!";
  }

  updateWordDisplay();
  document.getElementById("guessed").textContent = guessedLetters.join(", ");
  checkGameStatus();
  input.focus();
}

function checkGameStatus() {
  if (!document.getElementById("word").textContent.includes("_")) {
    endGame(true);
  } else if (wrongGuesses >= maxWrong) {
    endGame(false);
  }
}

function restartGame() {
  startGame(currentDifficulty);
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 180;
  const timerElement = document.getElementById("timer");
  if (timerElement) {
    timerElement.textContent = formatTime(timeLeft);
  }

  timerInterval = setInterval(() => {
    if (!gameActive) {
      clearInterval(timerInterval);
      return;
    }

    timeLeft--;
    if (timerElement) {
      timerElement.textContent = formatTime(timeLeft);
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeLeft = 0;
      if (timerElement) {
        timerElement.textContent = formatTime(timeLeft);
      }
      endGame(false);
    }
  }, 1000);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function stopTimer() {
  clearInterval(timerInterval);
}

function endGame(win) {
  gameActive = false;
  stopTimer();
  if (win) {
    document.getElementById("message").textContent = "YOU WIN!";
  } else {
    document.getElementById("message").textContent = `Game Over! Word: ${secretWord.toUpperCase()}`;
    updateHangmanImage(); // Show final gender image
  }
}

// Enter key support
document.addEventListener("DOMContentLoaded", function() {
  let input = document.getElementById("guessInput");
  if (input) {
    input.addEventListener("keypress", function(e) {
      if (e.key === "Enter") handleGuess();
    });
    input.focus();
  }
});