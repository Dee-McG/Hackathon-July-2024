const options = document.querySelectorAll(".option");
const nextBtn = document.querySelector(".next");
let questions = [];
let index = 0;

/**
 * Loads quiz questions from json
 */
const loadQuestionsFromJson = async () => {
    const response = await fetch('assets/js/json/flags-quiz.json');
    const res = await response.json();
    questions = res["flags"];
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
    const questionDiv = document.querySelector(".question");
    questionDiv.innerHTML = questions[index].question;

    // Create a copy of the answers array and shuffle it
    let shuffledAnswers = [...questions[index].answers];
    shuffleArray(shuffledAnswers);

    for (let i = 0; i < shuffledAnswers.length; i++) {
        options[i].src = shuffledAnswers[i];
    }

    // Save the correct answer after shuffling
    questions[index].shuffledCorrect = shuffledAnswers.indexOf(questions[index].correct);
}

document.addEventListener("DOMContentLoaded", () => {
    loadQuestionsFromJson();
});

/**
 * Checks the answer and displays message indicating answer fact
 * @param {event} e 
 */
const checkAnswer = (e) => {
    let clicked = e.target;
    let ans = questions[index].correct;

    nextBtn.disabled = false;
    
    if (clicked.getAttribute("src") == ans) {
        clicked.style.border = "3px solid green";
    } else {
        clicked.style.border = "3px solid red";
    }

    document.querySelector(".messages").innerHTML = `<p>${questions[index].fact}</p>`;
}

/*
* Add click event on the images
*/
options.forEach((option) => {
    option.addEventListener('click', checkAnswer);
});

/**
 * Handles get next question, clears message container and removes disabled from buttons
 */
const handleNext = () => {
    document.querySelector(".messages").innerHTML = "";
    index++;

    options.forEach((item) => {
        item.style.border = "none";
    });

    displayQuestion();
}

/* Add event listener to next button */
nextBtn.addEventListener("click", handleNext);
