import english from "./data-english.js";
import japanese from "./data-japanese.js";
import italian from "./data-italian.js";
// import text from "./data-italian.js";

let mainText = 210;
let langChoice = "";
let currentModule = "";
let phrasesChosen = 0;
const phrasesChosenLimit = 40;

const navMain = document.querySelector("nav");
const btnGrid = document.querySelector(".button-grid");
const clickWrapper = document.querySelector(".click-wrapper");
const chooseWrapper = document.querySelector(".choose-wrapper");
const messageTextBox = document.querySelector(".message-text");
const messageSynonymBox = document.querySelector(".message-synonym");
const messagesOutputWrapper = document.querySelector('.messages-output-wrapper');


document.body.classList.add('no-language-chosen');
// accentColor();

// User Chooses Language, which loads module
navMain.addEventListener("click", (e) => {
  langChoice = e.target.innerText;
  document.body.className = langChoice;

  messageTextBox.textContent = " "; 
  messageSynonymBox.textContent = " ";

  if (langChoice == "english") {
    currentModule = english;
  }
  else if (langChoice == "japanese") {
    currentModule = japanese;
  }
  else if (langChoice == "italian") {
    currentModule = italian;
  }
  else {
    currentModule = "nuclear";
  }

  phrasesChosen = 0;
  preloadAudio();

document.body.classList.remove('no-language-chosen');  
setup();

});

// Put buttons on the Stage.
function setup() {

  if (phrasesChosen == 0) {
    document.body.classList.add("no-phrase-chosen");
  }
  else {
    document.body.classList.remove("no-phrase-chosen");
  }

  // First, remove any buttons that are on stage now:
  const existingButtons = btnGrid.querySelectorAll("button");
  existingButtons.forEach((button) => btnGrid.removeChild(button));

  // // if user comes back from nuclear, remove any boxes added to page.
  const newTextSynonymWrappers = document.querySelectorAll('.new-text-synonym-wrapper');
  newTextSynonymWrappers.forEach(wrapper => wrapper.remove());
  
  // And set the messagesOutWrapper opacity back to 100% 
  messagesOutputWrapper.style.opacity = 1;
  
  // Then put new buttons there.
  let numSounds = currentModule.length;
  if (currentModule == "nuclear") {
    numSounds = 160;
  }
  for (let i = 1; i < numSounds; i++) {
    
    const btn = document.createElement("button");
    btn.classList.add(`btn-${i}`);
    btn.dataset.number = i;
    
    btn.innerText = i;

    btnGrid.appendChild(btn);
  }

  btnGrid.addEventListener("click", handleClick);
  btnGrid.addEventListener('mouseover', handleClick);
}

function handleClick(e){

  if (phrasesChosen == 0) {
    document.body.classList.remove('no-phrase-chosen');
  }
  
  let btnClicked = Number(e.target.dataset.number); 
  const data = getPath(btnClicked);

  playSound(data);
  outputMessage(data);

  phrasesChosen++;
  if (phrasesChosen == phrasesChosenLimit) {
    phrasesChosen = 0;
    nuclear();
    currentModule = "nuclear";
  }
}

function getPath(btnClicked) {

  let number = btnClicked;
  let folder = langChoice;
  let sound; 
  let text;
  let synonym;

  if (currentModule == "nuclear") {

    const langModules = [japanese,english,italian];
    const langNames = ["japanese","english","italian"];
    const langLength = [japanese.length,english.length,italian.length];

    const rand = Math.floor(Math.random() * langLength.length);
    folder = langNames[rand]

    const module = langModules[rand];
    const randKey = Math.floor(Math.random() * module.length);
    sound = module[randKey].sound;
  
    text = module[randKey].text;
    synonym = module[randKey].synonym;

  }
   else {
    folder = langChoice;
    sound = currentModule[number-1].sound;
    text = currentModule[number-1].text;
    synonym = currentModule[number-1].synonym;
   }

  const path = `sounds/${folder}/${sound}`;

  const data = {
    path: path,
    text: text,
    synonym: synonym,
  }
  // console.log(path);

  return data;
}

function playSound(data) {
  const path = data.path;

  Pizzicato.context.resume();
  var mySound = new Pizzicato.Sound(
    { source: "file",
      options: { path: `${path}`, volume: 0.5 },
    },
    function () {
      mySound.play();
    }
  );

  mySound.on("end", function () {
    // console.log("sound over");
  });

}

function outputMessage(data) {
  if (currentModule != "nuclear") {
  messageTextBox.textContent = data.text;
  messageSynonymBox.textContent = data.synonym;
  randomTextSize(messageTextBox);
  randomTextSize(messageSynonymBox);
  }
  else {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    const randW = Math.floor(Math.random() * screenW);
    const randH = Math.floor(Math.random() * screenH);

    // console.log(screenW, screenH, randW, randH);

    const messages = document.querySelector('.messages');
    const newTextBox = messageTextBox.cloneNode();
    newTextBox.innerText = data.text;
    const newSynonymBox = messageSynonymBox.cloneNode();
    newSynonymBox.innerText = data.synonym;

    messagesOutputWrapper.style.opacity = .2;


    randomTextSize(newTextBox);
    randomTextSize(newSynonymBox);
    const newWrapper = document.createElement('div');
    newWrapper.style.opacity = Math.random() + .3;
    newWrapper.style.position = "absolute";
    newWrapper.style.top = `${randH - 50}px`;
    newWrapper.style.left = `${randW - 50}px`;
    newWrapper.style.color = "white";
    newWrapper.classList.add('new-text-synonym-wrapper');
    newWrapper.appendChild(newTextBox);
    newWrapper.appendChild(newSynonymBox);
    
    messages.appendChild(newWrapper);

  }

  
}

function randomTextSize(element) {

  if (currentModule == "nuclear") {
    mainText = 60;
  }
  element.style.fontSize = `${genRandom(mainText)}px`;
  element.style.fontSize = `${genRandom(mainText)}px`;
}

function genRandom(mainText) {
  const bodyWidth = window.innerWidth;

  if (bodyWidth < 600) {
    mainText = mainText/2;
  }
  else if (bodyWidth > 1700){
    mainText *=2;
  }
  let multiplier = Math.round(Math.random() * mainText);
  // if (multiplier <= 10) {
  //   multiplier +=10;
  // }
  return multiplier;
}


function nuclear(){
  langChoice = "nuclear";
  document.body.classList.add('nuclear');
}


function preloadAudio() {

  const soundsNum = currentModule.length;

  for (let i = 1; i <= soundsNum; i++) {

    const snd = currentModule[i-1].sound;
    const path = `sounds/${langChoice}/${snd}`;

    const audio = new Audio(path);
    audio.preload = "auto";
    // console.log(audio);
 
  }
}




// SET Random Accent Color
function accentColor(){
  const colors = [
    'hotpink', 
    'hsl(240, 60%, 70%)',
    'hsl(300,20%,50%)',
    'hsl(30,60%,60%)',
    'hsl(300, 20%, 70%)',
    'hsl(120, 70%, 80%)',
    'maroon',
     'teal',
    'olive',
    'orangered', 
];
const root = document.querySelector(':root');
const rn = Math.floor(Math.random() * colors.length); 
console.log(rn);

root.style.setProperty('--accentColor', colors[rn]);
}


