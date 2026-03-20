let wordBank = [
  "cupcake",
  "brownie",
  "donut",
  "cheesecake",
  "macaron",
  "pudding",
  "waffle",
  "cookie",
  "icecream",
  "tiramisu",
  "croissant",
  "cannoli"
];

let chosenWord = "";
let guessedLetters = [];
let guessesLeft = 0;


function startGame(maxGuesses) {

  let randomIndex = Math.floor(Math.random() * wordBank.length);
  chosenWord = wordBank[randomIndex];

  guessesLeft = maxGuesses;
  guessedLetters = [];

  document.getElementById("guessesLeft").innerHTML = guessesLeft;
  document.getElementById("usedLetters").innerHTML = "";
  document.getElementById("message").innerHTML = "";

  updateWordDisplay();
}


function updateWordDisplay() {

  let display = "";

  for (let i = 0; i < chosenWord.length; i++) {

    let letter = chosenWord.charAt(i);

    if (guessedLetters.indexOf(letter) !== -1) {
      display = display + letter + " ";
    }
    else {
      display = display + "_ ";
    }

  }

  document.getElementById("wordDisplay").innerHTML = display;
}


document.getElementById("guessBtn").onclick = function () {

  let input = document.getElementById("guessInput");
  let guess = input.value.toLowerCase();
  input.value = "";

  if (guess === "") {
    return;
  }

  guessedLetters.push(guess);

  document.getElementById("usedLetters").innerHTML = guessedLetters.join(", ");

 if (chosenWord.indexOf(guess) === -1) {
  guessesLeft = guessesLeft - 1;
  updateCake();
}

  document.getElementById("guessesLeft").innerHTML = guessesLeft;

  updateWordDisplay();
  checkGame();

};


function checkGame() {

  let won = true;

  for (let i = 0; i < chosenWord.length; i++) {

    let letter = chosenWord.charAt(i);

    if (guessedLetters.indexOf(letter) === -1) {
      won = false;
    }

  }

  if (won === true) {
    document.getElementById("message").innerHTML = "You Win!";
  }
  else if (guessesLeft === 0) {
    document.getElementById("message").innerHTML =
      "Game Over! The word was " + chosenWord;
  }

}

function updateCake() {
  document.getElementById("healthImg").src = "images/cake" + guessesLeft + ".png";
} 

startBtn.onclick = startGame;
nameInput.addEventListener("keydown", e => {
  if (e.key === "Enter") startGame();
});

/* Off canvas */
howHandle.onclick = () => howToPlayPanel.classList.toggle("open");
howClose.onclick = () => howToPlayPanel.classList.remove("open");