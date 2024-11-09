// Web Speech API setup
const synth = window.speechSynthesis;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';

let questionIndex = 0;
let hintsGiven = 0;
let score = 0;
let playerName = "";

// Define the quiz questions and their hints from the domain of computer science
const questions = [
  {
    question: "What is the full form of CPU?",
    answer: "central processing unit",
    hints: [
      "It's known as the brain of the computer.",
      "It handles all instructions from software and hardware.",
      "It is abbreviated as CPU."
    ]
  },
  {
    question: "Who is known as the father of computers?",
    answer: "charles babbage",
    hints: [
      "He was an English polymath.",
      "He invented the concept of a programmable computer.",
      "His first name is Charles."
    ]
  },
  {
    question: "What does HTML stand for?",
    answer: "hypertext markup language",
    hints: [
      "It is used to structure web pages.",
      "It contains tags and elements.",
      "It is abbreviated as HTML."
    ]
  },
  {
    question: "What is the main function of RAM in a computer?",
    answer: "temporary storage",
    hints: [
      "It is used for short-term memory.",
      "Data in it is lost when the computer turns off.",
      "It allows quick read and write operations."
    ]
  },
  {
    question: "What programming language is known for its snake logo?",
    answer: "python",
    hints: [
      "It is popular for data science and web development.",
      "It is named after a type of reptile.",
      "Its logo features a snake."
    ]
  }
];

// Function to start the game
function startGame() {
  playerName = document.getElementById("nameInput").value.trim();
  if (!playerName) {
    alert("Please enter your name to start the game.");
    return;
  }
  document.getElementById("startGame").disabled = true;
  document.getElementById("nameInput").disabled = true;
  questionIndex = 0;
  hintsGiven = 0;
  score = 0;
  updateScore();
  showNextQuestion();
}

// Function to speak text with delay
function speak(text, callback) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.onstart = () => {
    document.getElementById("status").innerText = "Please wait...";
  };
  utterance.onend = () => {
    document.getElementById("status").innerText = "Please say your answer now.";
    if (callback) callback();
  };
  synth.speak(utterance);
}

// Function to show the next question
function showNextQuestion() {
  const question = questions[questionIndex];
  if (hintsGiven === 0) {
    const questionText = `${playerName}, ${question.question}`;
    document.getElementById("question").innerText = questionText;
    speak(questionText, () => {
      startListening();
    });
  } else {
    const hintText = question.hints[hintsGiven];
    document.getElementById("hint").innerText = `Hint: ${hintText}`;
    speak(hintText, () => {
      startListening();
    });
  }
}

// Function to start listening
function startListening() {
  recognition.start();
  console.log("Speech recognition started... Listening for your answer...");
}

// Event handler for speech recognition result
recognition.onresult = (event) => {
  const playerAnswer = event.results[0][0].transcript.toLowerCase();
  console.log("Player said: " + playerAnswer);  // Debugging the player's spoken answer
  
  const correctAnswer = questions[questionIndex].answer.toLowerCase();

  if (playerAnswer === correctAnswer) {
    console.log("Correct answer detected!");
    speak("Correct!", () => {
      document.getElementById("status").innerText = "Correct! Moving to next question...";
      score += 10;
      updateScore();
      hintsGiven = 0; // Reset hints for next question
      setTimeout(nextQuestion, 1500);
    });
  } else {
    console.log("Incorrect answer, providing next hint...");
    hintsGiven++;
    if (hintsGiven < 3) {
      speak("Try again. Here's another hint.", () => {
        showNextQuestion();
      });
    } else {
      speak(`Sorry, the correct answer is ${correctAnswer}.`, () => {
        setTimeout(nextQuestion, 2000);
      });
    }
  }
};

// Function to go to the next question
function nextQuestion() {
  questionIndex++;
  if (questionIndex < questions.length) {
    showNextQuestion();
  } else {
    endGame();
  }
}

// Function to end the game and announce the score
function endGame() {
  speak(`Game over, ${playerName}. Your final score is ${score}.`);
  document.getElementById("status").innerText = `Game over, ${playerName}. Your final score is ${score}.`;
}

// Function to update the score display
function updateScore() {
  document.getElementById("score").innerText = `Score: ${score}`;
}
