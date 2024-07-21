const options = document.querySelectorAll(".option");
const nextBtn = document.querySelector(".next");
const iconCentral = document.getElementById("icon-central");
const maxQuestions = 10;
let questions = [];
let index = 0;
let score = 0;
let answerSelected = false;

/**
 * Loads quiz questions from json
 */
const loadQuestionsFromJson = async () => {
    const response = await fetch('assets/js/json/flags-quiz.json');
    const res = await response.json();
    questions = res["flags"];
    shuffleArray(questions);
    displayQuestion();
}

/**
 * Shuffles array in place.
 * @param {Array} array 
 * @returns {Array}
 */
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Displays question and image flags
 */
const displayQuestion = () => {
    if (index >= maxQuestions || index >= questions.length) {
        endGame();
        return;
    }

    const questionDiv = document.querySelector(".question");
    questionDiv.innerHTML = questions[index].question;

    // Create a copy of the answers array and shuffle it
    let shuffledAnswers = [...questions[index].answers];
    shuffleArray(shuffledAnswers);

    for (let i = 0; i < shuffledAnswers.length; i++) {
        options[i].src = shuffledAnswers[i];
        // Reset borders and remove thumbs for new question
        options[i].style.border = "none";
        options[i].classList.remove('disabled');
    }

    // Hide the central icon and messages
    iconCentral.style.display = 'none';
    document.querySelector(".messages").classList.remove('visible');

    // Hide the next button
    nextBtn.style.display = 'none';

    // Save the correct answer after shuffling
    questions[index].shuffledCorrect = shuffledAnswers.indexOf(questions[index].correct);
    // Reset the answerSelected flag for the new question
    answerSelected = false;
}

/**
 * Updates the score display
 */
const updateScore = () => {
    document.querySelector(".score").innerText = `Score: ${score}`;
}

document.addEventListener("DOMContentLoaded", () => {
    loadQuestionsFromJson();
    updateScore();
});

/**
 * Checks the answer and displays message indicating answer fact
 * @param {event} e 
 */
const checkAnswer = (e) => {
    // If an answer has already been selected, do nothing
    if (answerSelected) return;

    let clicked = e.target;
    let ans = questions[index].correct;
    // Set the flag to indicate an answer has been selected
    answerSelected = true;

    nextBtn.style.display = 'none'; // Hide the next button initially

    if (clicked.getAttribute("src") == ans) {
        clicked.style.border = "3px solid green";
        score++;
        updateScore();
        // Show thumbs up in central icon
        iconCentral.innerHTML = `
            <img src="assets/icons/like-button-icon.svg" style="width: 100px; height: 100px;" alt="Correct">
        `;
    } else {
        clicked.style.border = "3px solid red";
        // Show thumbs down in central icon
        iconCentral.innerHTML = `
            <img src="assets/icons/dislike-button-icon.svg" style="width: 100px; height: 100px;" alt="Incorrect">
        `;
    }

    // Display the central icon
    iconCentral.style.display = 'block';

    // After a delay, show the correct answer flag in the central icon and description
    setTimeout(() => {
        // Show the correct answer flag in the central icon
        iconCentral.innerHTML = `
            <img src="${ans}" class="correct-flag" alt="Correct Flag">
        `;

        // Show the correct answer description
        const messagesDiv = document.querySelector(".messages");
        messagesDiv.innerHTML = `<p>${questions[index].fact}</p>`;
        messagesDiv.classList.add('visible');

        // Display and enable the next button
        nextBtn.style.display = 'block';
        nextBtn.disabled = false;

    }, 2000); // Display the thumbs up/down icon for 2 seconds
}

/**
 * Add click event on the images
 */
options.forEach((option) => {
    option.addEventListener('click', checkAnswer);
});

/**
 * Handles get next question, clears message container and removes disabled from buttons
 */
const handleNext = () => {
    document.querySelector(".messages").classList.remove('visible');
    index++;

    displayQuestion();
}

/**
 * Ends the game and displays the final score
 */
const endGame = () => {
    // Hide the central icon
    iconCentral.style.display = 'none';

    const questionDiv = document.querySelector(".question");
    questionDiv.innerHTML = `Game Over! You scored ${score} out of ${maxQuestions}.`;

    // Hide options and next button
    document.querySelector(".options").style.display = 'none';
    nextBtn.style.display = 'none';

    // Hide the score element
    document.querySelector(".score").style.display = 'none';

    // Add buttons for replaying the game or returning to the homepage
    const endGameDiv = document.createElement('div');
    endGameDiv.classList.add('endgame-options');

    const playAgainBtn = document.createElement('button');
    playAgainBtn.innerText = 'Play Again';
    playAgainBtn.addEventListener('click', () => {
        location.reload();
    });

    const homeLink = document.createElement('a');
    homeLink.href = 'index.html';
    homeLink.classList.add('button-link');
    const homeBtn = document.createElement('button');
    homeBtn.innerText = 'Return to Homepage';
    homeLink.appendChild(homeBtn);

    endGameDiv.appendChild(playAgainBtn);
    endGameDiv.appendChild(homeLink);
    questionDiv.appendChild(endGameDiv);
}

/**
 * Add event listener to next button
 */
nextBtn.addEventListener("click", handleNext);
