import { dictWords } from "./6_letter_words.js";

let container = document.querySelector(".container");
let winScreen = document.querySelector(".win-screen");
let submitButton = document.querySelector(".submit");
let inputCount, tryCount, inputRow, successCount, inputBox;
let backSpaceCount = 0;
let randomWord, finalWord;
let wordObj;
let wordValues = dictWords.map(({word})=>word);

//Detect touch device
const isTouchDevice = () => {
  try {
    //We try to create TouchEvent (it would fail for desktops and throw error)
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
};

//Initial Setup
const startGame = async () => {
  winScreen.classList.add("hide");
  container.innerHTML = "";
  inputCount = 0;
  successCount = 0;
  tryCount = 0;
  finalWord = "";

  //Creating the grid
  for (let i = 0; i < 7; i++) {
    let inputGroup = document.createElement("div");
    inputGroup.classList.add("input-group");
    for (let j = 0; j < 6; j++) {
      //Disabled by default. We will enable one by one
      inputGroup.innerHTML += `<input type="text" class="input-box" maxlength="1" disabled>`;
    }
    container.appendChild(inputGroup);
  }
//onkeyup="checker(event)"
  inputRow = document.querySelectorAll(".input-group");
  inputBox = document.querySelectorAll(".input-box");
  for (let k=0; k<inputBox.length; k++){
    inputBox[k].addEventListener("keyup", checker);
  };
  updateDivConfig(inputRow[tryCount].firstChild, false);
  wordObj = getRandom();
  randomWord = wordObj.word.toUpperCase();
  console.log(randomWord);
};

//Get random word
const getRandom = () =>
  dictWords[Math.floor(Math.random() * dictWords.length)];

//Update input to disabled status and set focus
const updateDivConfig = (element, disabledStatus) => {
  element.disabled = disabledStatus;
  if (!disabledStatus) {
    element.focus();
  }
};

//Logic for writing in the inputs
const checker = async (e) => {
  let value = e.target.value.toUpperCase();
  //disable current input box
  updateDivConfig(e.target, true);
  if (value.length == 1) {
    //if the word is less than 6 and the button isn't backspace
    if (inputCount <= 5 && e.key != "Backspace") {
      //Attach the letter to the final word
      finalWord += value;
      console.log("inputCount: "+ inputCount);
      if (inputCount < 5) {
        console.log("inputCountInside: "+ inputCount);
        //enable next
        updateDivConfig(e.target.nextSibling, false);
      }
    }
    inputCount += 1;
  } else if (value.length == 0 && e.key == "Backspace") {
    //Empty input box and the user presses Backspace
    finalWord = finalWord.substring(0, finalWord.length - 1);
    if (inputCount == 0) {
      //For first inputbox
      updateDivConfig(e.target, false);
      return false;
    }
    updateDivConfig(e.target, true);
    e.target.previousSibling.value = "";
    //enable previous and decrement count
    updateDivConfig(e.target.previousSibling, false);
    inputCount -= 1;
  }
};

//When user presses enter/backspace and all the inputs are filled
window.addEventListener("keyup", (e) => {
  if (inputCount > 5) {
    if (isTouchDevice()) {
      submitButton.classList.remove("hide");
    }
    if (e.key == "Enter") {
      validateWord();
    } else if (e.key == "Backspace") {
      inputRow[tryCount].lastChild.value = "";
      finalWord = finalWord.substring(0, finalWord.length - 1);
      updateDivConfig(inputRow[tryCount].lastChild, false);
      inputCount -= 1;
    }
  }
});

//Comparison Logic
const validateWord = async () => {
  if (isTouchDevice()) {
    submitButton.classList.add("hide");
  }
  let failed = false;
  //Get all input boxes of current row
  let currentInputs = inputRow[tryCount].querySelectorAll(".input-box");
  //Check if it is a valid Akuzipik word
  if (!wordValues.includes(finalWord)){
      console.clear();
      alert("Please Enter Valid Word");
      failed = true;
    }
  if(failed){
    return false;
  }
  //Initially set these
  let successCount = 0;
  let successLetters = "";
  //Checks for both words
  console.log("random: " + randomWord);
  console.log("final: " + finalWord);
  for (let i in randomWord) {
    //if same then green
    if (finalWord[i] == randomWord[i]) {
      currentInputs[i].classList.add("correct");
      successCount += 1;
      successLetters += randomWord[i];
    } else if (
      randomWord.includes(finalWord[i]) &&
      !successLetters.includes(finalWord[i])
    ) {
      //If the letter exist in the chosen word and is not present in the success array then yellow
      currentInputs[i].classList.add("exists");
    } else {
      currentInputs[i].classList.add("incorrect");
    }
  }
  //Increment try count
  tryCount += 1;
  //If all letters are correct
  if (successCount == 6) {
    //Display the win banner after 1 second
    setTimeout(() => {
      winScreen.classList.remove("hide");
      winScreen.innerHTML = `
        <a href="entry.html?entry=${randomWord.UUID}" class="result">
                <div class="entryContent">
                    <div class="entryTop">
                        <span class="entryHead">
                            <div class="headwordCont">${randomWord.headword}</div>
                            <div class="tagCont">${randomWord.pos}</div>
                        </span>
                        
                    </div>
                    <div class="entryBottom">
                        <span class="entryDef">${randomWord.gloss.join("; ")}</span>
                    </div>
                </div>
            </a>
        <span>Total guesses: ${tryCount}</span>
        <button onclick="startGame()">New Game</button>
        `;
    }, 1000);
  } else {
    //unsuccessful so next attempt
    inputCount = 0;
    finalWord = "";
    if (tryCount == 6) {
      //all attempts wrong
      tryCount = 0;
      winScreen.classList.remove("hide");
      winScreen.innerHTML = ` <span>Sorry, try again!</span>
        <button onclick="startGame()">New Game</button>`;
      return false;
    }
    //for next attempt move to first child of next row
    updateDivConfig(inputRow[tryCount].firstChild, false);
  }
  inputCount = 0;
};

window.onload = startGame();