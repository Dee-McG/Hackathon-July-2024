const game = document.querySelector(".game");
const resultDisplay = document.querySelector("#result");
let cardArray = []
let cardImages = [];
let cardValues = [];
let totalCorrect = 0;


/**
 * Loads cards from json
 */
const loadFactsFromJson = async () => {
  const response = await fetch("assets/js/json/memory.json");
  const res = await response.json();
  cardArray = res["cards"];
  createBoard();
};

document.addEventListener("DOMContentLoaded", () => {
  cardArray.sort(() => 0.5 - Math.random());
  loadFactsFromJson();
});


/**
 * Check for matches
 */
const checkMatches = () =>{
  const cards = document.querySelectorAll(".imgs");
  const cardOne = cardValues[0];
  const cardTwo = cardValues[1];

  switch (cardImages[0] === cardImages[1]) {
    case true:
      cards[cardOne].removeEventListener("click", flipCard);
      cards[cardTwo].removeEventListener("click", flipCard);
      totalCorrect += 2;
      break;
    case false:
      cards[cardOne].setAttribute("src", "assets/images/background.webp");
      cards[cardTwo].setAttribute("src", "assets/images/background.webp");
  }

  cardImages = [];
  cardValues = [];
  if (totalCorrect === cardArray.length) {
    resultDisplay.textContent = "Congratulations! You found them all!";
  }
}

/**
 * Card flips
 * @param {event} e 
 */
const flipCard = (e) =>{
  let val = e.target.getAttribute("value");
  cardImages.push(cardArray[val].image);
  cardValues.push(val);
  e.target.setAttribute("src", cardArray[val].image);
  if (cardValues.length === 2) {
    setTimeout(checkMatches, 500);
  }
}

/**
 * Creates the game board
 */
function createBoard() {
  for (let i = 0; i < cardArray.length; i++) {
    const card = document.createElement("img");
    card.setAttribute("src", "assets/images/background.webp");
    card.setAttribute("value", i);
    card.classList.add("imgs","rounded","m-1","g-col-3");
    card.addEventListener("click", flipCard);
    game.appendChild(card);
  }
}