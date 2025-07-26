const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const SCREEN_WIDTH = 1200;
const SCREEN_HEIGHT = 800;
const PLAYER_SPEED = 5;
let gameLoopId;
let currentScreen = "start";

// Game images
const bgImg = new Image();
bgImg.src = "assets/shop_bg.png"; 

const startBgImg = new Image();
startBgImg.src = "assets/start_bg.png"; 

const joeWhiteImg = new Image();
joeWhiteImg.src = "assets/joe_white.png";

const joeBrownImg = new Image();
joeBrownImg.src = "assets/joe_brown.png";

const itemImg = new Image();
itemImg.src = "assets/item.png";

let imagesLoaded = 0;

function checkAllLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 4) {
    startLoop();
  }
}

bgImg.onload = checkAllLoaded;
joeWhiteImg.onload = checkAllLoaded;
joeBrownImg.onload = checkAllLoaded;
itemImg.onload = checkAllLoaded;

// Keyboard input
const keysDown = {};
document.addEventListener("keydown", (e) => keysDown[e.code] = true);
document.addEventListener("keyup", (e) => keysDown[e.code] = false);

let player1 = {
  name: "Joe White", x: 200, y: 170, width: 64, height: 64,
  controls: { up: "KeyS", down: "KeyX", left: "KeyZ", right: "KeyC", action: "KeyR" },
  carrying: null, score: 0, wins: 0
};

let player2 = {
  name: "Joe Brown", x: 300, y: 170, width: 64, height: 64,
  controls: { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", action: "KeyP" },
  carrying: null, score: 0, wins: 0
};

// item and fix station
let item = { x: 400, y: 300, width: 48, height: 48, beingCarried: false };

let station = {
  x: SCREEN_WIDTH - 80, y: SCREEN_HEIGHT - 80, width: 80, height: 80,
  busy: false, startTime: null, currentPlayer: null, duration: 3000
};

// opening screen
function drawStartScreen() {
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  ctx.drawImage(startBgImg, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(SCREEN_WIDTH / 2 - 100, 300, 200, 60);

  ctx.fillStyle = "#FFF";
  ctx.font = "28px Arial";
  ctx.fillText("Start Game", SCREEN_WIDTH / 2 - 75, 340);
}

canvas.addEventListener("click", function (e) {
  if (currentScreen !== "start") return;

  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  if (mx > SCREEN_WIDTH / 2 - 100 && mx < SCREEN_WIDTH / 2 + 100 &&
      my > 300 && my < 360) {
    currentScreen = "game";
    gameLoop();
  }
});

// Loop for splash screen
function startLoop() {
  if (currentScreen === "start") {
    drawStartScreen();
    requestAnimationFrame(startLoop);
  }
}
startLoop();

// movement
function handleMovement(player) {
  if (keysDown[player.controls.up]) player.y -= PLAYER_SPEED;
  if (keysDown[player.controls.down]) player.y += PLAYER_SPEED;
  if (keysDown[player.controls.left]) player.x -= PLAYER_SPEED;
  if (keysDown[player.controls.right]) player.x += PLAYER_SPEED;

  player.x = Math.max(0, Math.min(SCREEN_WIDTH - player.width, player.x));
  player.y = Math.max(0, Math.min(SCREEN_HEIGHT - player.height, player.y));
}

// action
function handleAction(player) {
  const dx = player.x + player.width / 2 - (item.x + item.width / 2);
  const dy = player.y + player.height / 2 - (item.y + item.height / 2);
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 50 && !item.beingCarried && !player.carrying) {
    player.carrying = item;
    item.beingCarried = true;
    station.busy = false;
  }

  const dxs = player.x + player.width / 2 - (station.x + station.width / 2);
  const dys = player.y + player.height / 2 - (station.y + station.height / 2);
  const distToStation = Math.sqrt(dxs * dxs + dys * dys);

  if (player.carrying && distToStation < 50 && !station.busy) {
    station.busy = true;
    station.startTime = Date.now();
    station.currentPlayer = player;
  }
}

// Repair in the frame
function updateRepairStation() {
  if (station.busy) {
    const elapsed = Date.now() - station.startTime;
    if (elapsed >= station.duration) {
      station.busy = false;
      station.currentPlayer.carrying = null;
      item.beingCarried = false;
      station.currentPlayer.score += 1;

      const positions = [[400, 300], [150, 200], [250, 400], [600, 250]];
      const pos = positions[Math.floor(Math.random() * positions.length)];
      item.x = pos[0];
      item.y = pos[1];
    }
  }
}

// drawing the game
function drawGame() {
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  ctx.drawImage(bgImg, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  ctx.fillStyle = station.busy ? "#C86464" : "#64C864";
  ctx.fillRect(station.x, station.y, station.width, station.height);

  if (station.busy) {
    const elapsed = Date.now() - station.startTime;
    const pct = Math.min(elapsed / station.duration, 1);
    ctx.fillStyle = "#FFF";
    ctx.fillRect(station.x, station.y - 10, station.width * pct, 5);
  }

  if (!item.beingCarried) {
    ctx.drawImage(itemImg, item.x, item.y, item.width, item.height);
  }

  [player1, player2].forEach((p) => {
    const img = p === player1 ? joeWhiteImg : joeBrownImg;
    ctx.drawImage(img, p.x, p.y, p.width, p.height);

    if (p.carrying) {
      item.x = p.x + p.width / 2 - item.width / 2;
      item.y = p.y + p.height / 2 - item.height / 2;
      ctx.drawImage(itemImg, item.x, item.y, item.width, item.height);
    }
  });

  ctx.fillStyle = "#FFF";
  ctx.font = "20px Arial";
  ctx.fillText(`${player1.name}: ${player1.score}`, 20, 30);
  ctx.fillText(`${player2.name}: ${player2.score}`, 500, 30);
}

// Victory check
function checkVictory() {
  if (player1.score >= 10) {
    player1.wins += 1;
    showVictoryScreen(player1);
  } else if (player2.score >= 10) {
    player2.wins += 1;
    showVictoryScreen(player2);
  }
}

// Victory screen
function showVictoryScreen(winner) {
  cancelAnimationFrame(gameLoopId);

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  ctx.fillStyle = "#FFD700";
  ctx.font = "32px Arial";
  ctx.fillText(`${winner.name} Win!`, SCREEN_WIDTH / 2 - 100, 200);

  ctx.fillStyle = "#FFF";
  ctx.font = "24px Arial";
  ctx.fillText(`${player1.name} Victories: ${player1.wins}`, 200, 300);
  ctx.fillText(`${player2.name} Victories: ${player2.wins}`, 200, 350);

  ctx.fillStyle = "#333";
  ctx.fillRect(SCREEN_WIDTH / 2 - 75, 400, 150, 50);
  ctx.fillStyle = "#FFF";
  ctx.fillText("Play Again", SCREEN_WIDTH / 2 - 55, 435);

  canvas.addEventListener("click", handleRestartClick);
}


// Play again button
function handleRestartClick(e) {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  if (mx > SCREEN_WIDTH / 2 - 75 && mx < SCREEN_WIDTH / 2 + 75 &&
      my > 400 && my < 450) {
    canvas.removeEventListener("click", handleRestartClick);
    restartGame();
  }
}


// restart
function restartGame() {
  player1.x = 100; player1.y = 100; player1.score = 0; player1.carrying = null;
  player2.x = 200; player2.y = 100; player2.score = 0; player2.carrying = null;
  item.beingCarried = false;
  item.x = 400; item.y = 300;
  station.busy = false;
  currentScreen = "game";
  gameLoop();
}

// GameLoop
function gameLoop() {
  gameLoopId = requestAnimationFrame(gameLoop);

  handleMovement(player1);
  handleMovement(player2);

  if (keysDown[player1.controls.action]) handleAction(player1);
  if (keysDown[player2.controls.action]) handleAction(player2);

  updateRepairStation();
  drawGame();
  checkVictory();
}
