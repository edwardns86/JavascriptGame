/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/

let timer;
let bgReady, heroReady, monsterReady, iceLollyReady, cupCakeReady;
let bgImage, heroImage, monsterImage, iceLollyImage, cupCakeImage;
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;
let isGameOver = false;
let gameStarted = false;
let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

let heroX = Math.ceil(Math.random() * (canvas.width - 45) + 45) - 32;
let heroY = Math.ceil(Math.random() * (canvas.width - 64) + 64) - 32;

let monsterX = Math.ceil(Math.random() * (canvas.width - 45) + 45) - 32;
let monsterY = Math.ceil(Math.random() * (canvas.width - 64) + 64) - 32;

let cupCakeX = Math.ceil(Math.random() * (canvas.width - 45) + 45) - 32;
let cupCakeY = Math.ceil(Math.random() * (canvas.width - 64) + 64) - 32;

let iceLollyX = Math.ceil(Math.random() * (canvas.width - 45) + 45) - 32;
let iceLollyY = Math.ceil(Math.random() * (canvas.width - 64) + 64) - 32;

let score = 0;

function startGame() {
  const appState = getAppState();
  appState.currentUser =
    document.getElementById("playerName").value || "Anonymous";
  appState.gameStarted = true;
  save(appState);

  timer = setInterval(() => {
    elapsedTime += 1;
    document.getElementById("timer").innerHTML =
      SECONDS_PER_ROUND - elapsedTime;
  }, 1000);
}

function getAppState() {
  return JSON.parse(localStorage.getItem('playerData')) || {
    gameStarted: false,
    currentScore: 0,
    gameHistory: [],
    currentUser: 'Anonymous',
    currentHighScore: { score: 0, username: null },
  }
}

function save(playerData) {
  localStorage.setItem('playerData', JSON.stringify(playerData))
}

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    bgReady = true;
  };
  bgImage.src = "images/background-copy.png";
  heroImage = new Image();
  heroImage.onload = function () {
    heroReady = true;
  };
  heroImage.src = "images/hero2.png";
  monsterImage = new Image();
  monsterImage.onload = function () {
    monsterReady = true;
  };
  monsterImage.src = "images/taco.png";
  iceLollyImage = new Image();
  iceLollyImage.onload = function () {
    iceLollyReady = true;
  };
  iceLollyImage.src = "images/iceLolly.png";
  cupCakeImage = new Image();
  cupCakeImage.onload = function () {
    cupCakeReady = true;
  };
  cupCakeImage.src = "images/cupCake.png";
};

let keysDown = {};
function setupKeyboardListeners() {
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}

function move() {  //This function controls movement
  if (38 in keysDown) { // Player is holding up key
    heroY -= 5;
  }
  if (40 in keysDown) { // Player is holding down key
    heroY += 5;
  }
  if (37 in keysDown) { // Player is holding left key
    heroX -= 5;
  }
  if (39 in keysDown) { // Player is holding right key
    heroX += 5;
  }
}

function heroInCanvas() {
  if (heroX <= 0) {
    heroX = 0
  }
  if (heroX >= 480 + 1) {
    heroX = 480
  }
  if (heroY <= 32 + 1) {
    heroY = 32
  }
  if (heroY >= 448 + 1) {
    heroY = 448
  }
}

function randomlyPlaceMonster() {
  monsterX = Math.ceil(Math.random() * (canvas.width - 45) + 45) - 32;
  monsterY = Math.ceil(Math.random() * (canvas.width - 64) + 64) - 32;
}
function updateScores() {
  score += 1;
  document.getElementById("userScoreCurrent").innerHTML = score;

  const appState = getAppState()
  const hasHigherScoreThanCurrentHighScore = appState.currentHighScore.score < score
  if (hasHigherScoreThanCurrentHighScore) {
    appState.currentHighScore = {
      score: score,
      username: appState.currentUser
    }
    save(appState)
  }
}

function randomlyPlaceIceLolly() {
  iceLollyX = Math.ceil(Math.random() * (canvas.width - 45) + 45) - 32;
  iceLollyY = Math.ceil(Math.random() * (canvas.width - 64) + 64) - 32;
}
function updateScores() {
  score += 1;
  document.getElementById("userScoreCurrent").innerHTML = score;

  const appState = getAppState()
  const hasHigherScoreThanCurrentHighScore = appState.currentHighScore.score < score
  if (hasHigherScoreThanCurrentHighScore) {
    appState.currentHighScore = {
      score: score,
      username: appState.currentUser
    }
    save(appState)
  }
}

function randomlyPlaceCupCake() {
  cupCakeX = Math.ceil(Math.random() * (canvas.width - 45) + 45) - 32;
  cupCakeY = Math.ceil(Math.random() * (canvas.width - 64) + 64) - 32;
}
function updateScores() {
  score += 1;
  document.getElementById("userScoreCurrent").innerHTML = score;

  const appState = getAppState()
  const hasHigherScoreThanCurrentHighScore = appState.currentHighScore.score < score
  if (hasHigherScoreThanCurrentHighScore) {
    appState.currentHighScore = {
      score: score,
      username: appState.currentUser
    }
    save(appState)
  }
}
function restartGame() {
  window.location.reload();
}

// High Score Table Section - Still To Be Completed

function highScoreDisplay() {
  var showDiv = document.getElementById("highScoreTable");
  if (showDiv.style.display === "none") {
    showDiv.style.display = "block";
  } else {
    showDiv.style.display = "none";
  }
}

function stopClock() {
  clearInterval(timer);
}

function checkIfMonsterIsCaughtUpdateScorePushLocalMemory() {
  const heroCaughtMonster = heroX <= (monsterX + 32)
    && monsterX <= (heroX + 32)
    && heroY <= (monsterY + 32)
    && monsterY <= (heroY + 32)
  if (heroCaughtMonster) {
    randomlyPlaceMonster()
    updateScores()
  }
}
function checkIfIceLollyIsCaughtUpdateScorePushLocalMemory() {
  const heroCaughtIceLolly = heroX <= (iceLollyX + 32)
    && iceLollyX <= (heroX + 32)
    && heroY <= (iceLollyY + 32)
    && iceLollyY <= (heroY + 32)
  if (heroCaughtIceLolly) {
    randomlyPlaceIceLolly()
    updateScores()
  }
}
function checkIfCupCakeIsCaughtUpdateScorePushLocalMemory() {
  const heroCaughtCupCake = heroX <= (cupCakeX + 32)
    && cupCakeX <= (heroX + 32)
    && heroY <= (cupCakeY + 32)
    && cupCakeY <= (heroY + 32)
  if (heroCaughtCupCake) {
    randomlyPlaceCupCake()
    updateScores()
  }
}

function updateUI() {
  const appState = getAppState()
  document.getElementById('highScoreCurrent').innerHTML = appState.currentHighScore.score;
  document.getElementById('playerNameDisplay').innerHTML = appState.currentUser;
}
let update = function () {
  const isGameOver = elapsedTime >= SECONDS_PER_ROUND;
  const appState = getAppState();
  if (appState.gameStarted == false) return;

  if (isGameOver) {
    stopClock();
    appState.gameStarted = false;
    save(appState);
  }
  if (appState.gameStarted) {
    move()
    heroInCanvas()
    checkIfMonsterIsCaughtUpdateScorePushLocalMemory()
    checkIfCupCakeIsCaughtUpdateScorePushLocalMemory()
    checkIfIceLollyIsCaughtUpdateScorePushLocalMemory()
    updateUI()
  }
};
const render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  if (iceLollyReady) {
    ctx.drawImage(iceLollyImage, iceLollyX, iceLollyY);
  }
  if (cupCakeReady) {
    ctx.drawImage(cupCakeImage, cupCakeX, cupCakeY);
  }
  ctx.font = '25px roboto'

  if (elapsedTime >= SECONDS_PER_ROUND) {
    ctx.fillText(`GAME OVER`, 20, 30);
  } else {
    ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 20, 30);
  }
  ctx.fillText(`Your Current Score: ${score}`, 20, 60);
  document.getElementById("userScoreCurrent").innerHTML = score;
};

const main = function () {
  update();
  render();
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
const w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();



