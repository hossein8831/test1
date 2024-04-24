// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');

// Game Title
const gameTitle = document.querySelector('.header h1')
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');

// Countdown Page
const countdown = document.querySelector('.countdown');

// Game Page
const itemContainer = document.querySelector('.item-container');

// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations

let equationsArray = [];
let playerGuessArray =[];
let bestScoreArray = [];

// Game Page
let questionAmount = 0;
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timeplayed=0;
let penaltytime=0;
let finaltime=0;
let finaltimeDisplay = '0.0'
// Scroll
let valuelY = 0;


// functions

// Showing bestScores from localstorage to DOM

function showBestScoreDOM()
{
  bestScores.forEach((item,i)=>{
    // console.log(item.textContent)
    item.textContent =  `${bestScoreArray[i].bestScore}s`
  })
}

function getBestScroe()
{
  if(localStorage.getItem('bestScores'))
  {
    bestScoreArray = JSON.parse(localStorage.bestScores)
  }
  else
  {
    bestScoreArray=[
      {question: 10 , bestScore: finaltimeDisplay},
      {question: 25 , bestScore: finaltimeDisplay},
      {question: 50 , bestScore: finaltimeDisplay},
      {question: 99 , bestScore: finaltimeDisplay}
    ];
    localStorage.setItem('bestScores',JSON.stringify(bestScoreArray));
  }
  showBestScoreDOM()
  // updateBestScore()
}

// updating Best Score to the Array
function updateBestScore()
{
  bestScoreArray.forEach((el,i)=>{
    
    if(el.question == questionAmount)
    {
    
      const score = Number(bestScoreArray[i].bestScore);
      if(score === 0 || score > finaltime)
      {
        console.log('finaTimeDisplay is: ', finaltimeDisplay)
        bestScoreArray[i].bestScore = finaltimeDisplay;
      }
    }
  })
  console.log('updateBestScore: ', bestScoreArray)
  showBestScoreDOM()
  // localStorage

  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

function playAgain()
{
  scorePage.hidden = true;
  splashPage.hidden = false;
  playAgainBtn.hidden = true;
  equationObject = {};
  playerGuessArray=[];
  equationsArray=[];
  valuelY =0 ;
  gameTitle.textContent = 'Math Sprint Game'
  gamePage.addEventListener('click',startTimer)

}

function showScore()
{
  finaltimeDisplay=finaltime.toFixed(1);
  gameTitle.textContent = 'Results'
  baseTimeEl.textContent = `Base Time: ${timeplayed.toFixed(1)}`;
  penaltyTimeEl.textContent =`Penalty: ${penaltytime.toFixed(1)}`;
  finalTimeEl.textContent =`${finaltimeDisplay}s`;
  updateBestScore()
  itemContainer.scrollTo({top:0, behavior:'instant'});

  gamePage.hidden = true;
  scorePage.hidden = false;

  setTimeout(()=>{
    playAgainBtn.hidden = false;
  },1500)

  
}

function checkTime()
{
  console.log(timeplayed)
  gameTitle.textContent = `${timeplayed.toFixed(3)}sec`;
  if(playerGuessArray.length == questionAmount)
  {
    console.log(playerGuessArray);
    clearInterval(timer);
    console.log(equationsArray)
    equationsArray.forEach((eq,index)=>{
       if(eq.evaluated != playerGuessArray[index])
       {
        penaltytime += 0.5
       }
    })
    finaltime = timeplayed+penaltytime;
    showScore();
  }
}

function addTime()
{
  timeplayed += 0.1;
  checkTime()
}

function startTimer()
{
   timeplayed=0;
   penaltytime=0;
   finaltime=0;

   timer = setInterval(addTime,100)
  //  trigger only once
  gamePage.removeEventListener('click',startTimer);
}


function select(guessedTrue)
{ 
    // 80px
    valuelY += 80;
    itemContainer.scroll(0,valuelY)
    return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
}

// random  int
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// display Equations
function showGamePage()
{
  countdownPage.hidden = true;
  gamePage.hidden= false;
  populateGamePage();
}
// equation toDOM
function equationToDOM()
{

  equationsArray.forEach((eq)=>{

    const item = document.createElement('div');
    item.classList.add('item');

    const eqEl= document.createElement('h1')
    eqEl.textContent = eq.value;

    item.appendChild(eqEl);
    itemContainer.appendChild(item);
  });
}


// shuffle the array
function shuffle(array) {
let currentIndex = array.length,  randomIndex;

// While there remain elements to shuffle.
while (currentIndex != 0) {

  // Pick a remaining element.
  randomIndex = Math.floor(Math.random() * currentIndex);
  currentIndex--;

  // And swap it with the current element.
  [array[currentIndex], array[randomIndex]] = [
    array[randomIndex], array[currentIndex]];
}

return array;
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  // Set amount of wrong equations
  const wrongEquations =questionAmount - correctEquations

  console.log(correctEquations,"and",wrongEquations);
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt((correctEquations/questionAmount)*30);
    secondNumber = getRandomInt((wrongEquations+questionAmount)*3);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt((wrongEquations+questionAmount)*2);
    secondNumber = getRandomInt((correctEquations/questionAmount)*40);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3)
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);  
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);
  itemContainer.classList.add('stop-scrolling');
  // Create Equations, Build Elements in DOM
  createEquations();
  equationToDOM();
  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

function showCountdown()
{
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdown.textContent = '3'
  setTimeout(()=>{
    countdown.textContent = '2'
  },1000)
  setTimeout(()=>{
    countdown.textContent = '1'
  },2000)
  setTimeout(()=>{
    countdown.textContent = 'GO!'
  },3000)
  
}

function questionSelect(e)
{
  e.preventDefault();
    const el = Object.values(e.target)
    el.forEach((item)=>{
      if(item.checked)
      {
        questionAmount = item.value;
      }
    })
    console.log(questionAmount)
    if(questionAmount)
    {
      showCountdown();
      setTimeout(showGamePage,4000);
    }
}

startForm.addEventListener('click',()=>{

  radioContainers.forEach((item)=>{
    item.classList.remove('selected-label')
    if(item.children[1].checked)
    {
      item.classList.add('selected-label')
    }
  });
});

startForm.addEventListener('submit',questionSelect);
gamePage.addEventListener('click', startTimer)

getBestScroe();
