p5.disableFriendlyErrors = true;

let playerHeight = 10;
let playerWidth = 70;
let border = 10;
let playerX = 0;
let enemyX = 0;
let playerSpeed = 6;
let ballDimension = 10;
let InitialBallSpeed = 3;
let ballSpeed = InitialBallSpeed;
let ballSpeedX = 0;
let ballSpeedY = 0;
let ballX = 0;
let ballY = 0;
let owned = "player";
let gameOver = false;
let gameOverWait = 120;
let wait = 0;
let menuOpen = true;
let button1;
let button2;
let playersNumber = 1;
let winner = "";
let timer = 0;
let clockStarted = false;
let difficultyConstant = 200000;
let link = null;
let greyColor;
let botLosses = 0;
let botImprove = 0.5;

function setup() {
  createCanvas(500, 800);
  background(0);
  greyColor = color(255,255,255,100);
  frameRate(60);
  strokeWeight(0);
  fill(255);
  textFont('Helvetica');
  reset();
}

function draw() {
  if (!menuOpen) {
    background(0);
    game();
  } else {
    menu();
  }
}

function game() {
  if (!gameOver) {
    clock();
    difficulty();
    player();
    enemy();
    ball();

    fill(greyColor);
    if (owned == "player") {
      textAlign(CENTER);
      textSize(15);
      text('press ARROW UP to launch the ball', width / 2, height / 2);
    } else if (owned == "player2") {
      textAlign(CENTER);
      textSize(15);
      text('press W to launch the ball', width / 2, height / 2);
    }
    fill(255);
  } else {
    gameOverScreen();
  }
}

function menu() {
  noLoop();
  textAlign(CENTER);
  
  textSize(40);
  text("PONG", width / 2, (height / 2) - 100);
  textSize(16);
  fill(255,255,255,100);
  text("but it gets faster", width / 2, (height / 2) - 85);
  fill(255);
  
  textSize(17);
  let buttonColor = color(0, 0, 0, 50);
  let textColor = color(255);

  button1 = createButton('1 Player');
  button1.style('background-color', buttonColor);
  button1.style('color', textColor);
  button1.style('border-radius', '5px');
  button1.style('font-size', '17px');
  button1.position(width / 2 - (button1.width / 1.6), (height / 2) + 20);
  button1.mousePressed(onePlayer);

  button2 = createButton('2 Players');
  button2.style('background-color', buttonColor);
  button2.style('color', textColor);
  button2.style('border-radius', '5px');
  button2.style('font-size', '17px');
  button2.position(width / 2 - (button2.width / 1.6), (height / 2) - 20);
  button2.mousePressed(twoPlayers);
  
  playersInfo();
  
  showLink();
}

function showLink(){
  if (link == null){
    let linkColor = color(255,255,255,100);
    let buttonColor = color(0, 0, 0, 50);
    link = createButton('made by HellSingCoder');
    link.style('background-color', buttonColor);
    link.style('color', linkColor);
    link.style('border', 'none');
    link.style('font-family', 'Helvetica');
    link.style('font-size', '10px');
    link.style('text-decoration', 'none');
    link.position(width / 2 - (link.width / 2.6), height - (border * 2));
    link.mousePressed(openLink);
  }
}

function openLink() {
  window.open("https://www.simonepellegrino.com");
}

function closeMenu() {
  menuOpen = false;
  removeElements();
  link = null;
  loop();
  reset();
}

function onePlayer() {
  playersNumber = 1;
  closeMenu();
}

function twoPlayers() {
  playersNumber = 2;
  closeMenu();
}

function playersInfo() {
  textAlign(CENTER);
  textSize(15);
  text('PLAYER 1', width / 2 - 100, height / 2 + 180);
  text('PLAYER 2', width / 2 + 100, height / 2 + 180);
  textSize(13);
  fill(greyColor);
  text('use ARROWS to move', width / 2 - 100, height / 2 + 200);
  text('use WASD to move', width / 2 + 100, height / 2 + 200);
  fill(255);
}

function gameOverScreen() {
  background(0);
  textAlign(CENTER);

  // score
  textSize(30);
  fill(255, 255, 255, 100);
  text(timer, width / 2, (height / 2) - 100);
  fill(255);

  textSize(30);
  text('Game Over', width / 2, height / 2);
  textSize(15);
  text(winner + ' wins!', width / 2, height / 2 + 20);
  
  if (playersNumber == 1){
    fill(greyColor);
    textSize(10);
    text('level ' + botLosses, width / 2, height / 2 - 90);
    if(winner == 'Player 1'){
      text('level up!', width / 2, height / 2 - 130);
    }
    fill(255);
  }
  
  showLink();

  if (wait < gameOverWait) {
    wait++;
  } else {
    textSize(15);
    text('press any key to play again', width / 2, height / 2 + 50);
    if (keyIsPressed) {
      reset();
    }
  }
}

function reset() {
  removeElements();
  playerX = width / 2 - (playerWidth / 2);
  enemyX = width / 2 - (playerWidth / 2);
  ballX = width / 2;
  ballY = height / 2;
  ballSpeedX = 0;
  ballSpeedY = 0;

  let ownersOne = ["player", "enemy"];
  let ownersTwo = ["player", "player2"];
  if (playersNumber == 1) {
    owned = random(ownersOne);
  } else if (playersNumber == 2) {
    owned = random(ownersTwo);
  }

  gameOver = false;
  wait = 0;
  winner = "";
  timer = 0;
  clockStarted = false;

  ballSpeed = InitialBallSpeed;

  link = null;
}

function ball() {
  if (ballY < border || ballY > (height - border)) {
    gameOver = true;
    if (ballY < border) {
      winner = "Player 1";
      if (playersNumber == 1){
        botLosses ++;
      }
    } else if (ballY > (height - border)) {
      if (playersNumber == 2) {
        winner = "Player 2";
      } else {
        winner = "Enemy";
      }
    }
  }

  circle(ballX, ballY, ballDimension);
  
  if (owned == "player") {
    ballX = playerX + (playerWidth / 2);
    ballY = height - border - playerHeight - (ballDimension / 2);
    if (keyIsDown(UP_ARROW)) {
      launchBall();
    }
  } else if (owned == "player2") {
    ballX = enemyX + (playerWidth / 2);
    ballY = border + playerHeight + (ballDimension / 2);
    if (keyIsDown(87)) {
      launchBall();
    }
  } else if (owned == "enemy") {
    ballX = enemyX + (playerWidth / 2);
    ballY = border + playerHeight + (ballDimension / 2);
    launchBall();
  } else {

    // player bounce
    if (ballSpeedY > 0 && ballY > (height - border - playerHeight) && ballX > playerX && ballX < playerX + playerWidth) {
      ballSpeedY = -ballSpeedY;

      let playerCenter = (playerX + (playerWidth / 2));
      if (ballX > playerCenter) {
        ballSpeedX = ((ballX - playerCenter) / (playerWidth / 2) * ballSpeed);
      } else if (ballX < playerCenter) {
        ballSpeedX = -((playerCenter - ballX) / (playerWidth / 2) * ballSpeed);
      }
    }

    // enemy bounce
    if (ballSpeedY < 0 && ballY < (border + playerHeight) && ballX > enemyX && ballX < enemyX + playerWidth) {
      ballSpeedY = -ballSpeedY;

      let enemyCenter = (enemyX + (playerWidth / 2));
      if (ballX > enemyCenter) {
        ballSpeedX = ((ballX - enemyCenter) / (playerWidth / 2) * ballSpeed);
      } else if (ballX < enemyCenter) {
        ballSpeedX = -((enemyCenter - ballX) / (playerWidth / 2) * ballSpeed);
      }
    }

    // wall bounce
    if (ballX < (ballDimension / 2) || ballX > width - (ballDimension / 2)) {
      ballSpeedX = -ballSpeedX;
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;
  }
}

function launchBall() {
  if (owned == "player") {
    ballSpeedY = -ballSpeed;
  } else if (owned == "player2" || owned == "enemy") {
    ballSpeedY = ballSpeed;
  }
  owned = "";
  clockStarted = true;
}

function player() {
  rect(playerX, height - border - playerHeight, playerWidth, playerHeight);
  if (keyIsDown(LEFT_ARROW) && playerX > 0) {
    playerX -= playerSpeed;
  } else if (keyIsDown(RIGHT_ARROW) && playerX < (width - playerWidth)) {
    playerX += playerSpeed;
  }
}

function enemy() {
  rect(enemyX, border, playerWidth, playerHeight);
  if (owned == "" && playersNumber == 1) {
    if (ballX < (enemyX) && enemyX > 0) {
      enemyX -= playerSpeed -2 + (botLosses * botImprove);
    } else if (ballX > (enemyX + playerWidth) && enemyX < (width - playerWidth)) {
      enemyX += playerSpeed -2 + (botLosses * botImprove);
    }
  } else if (playersNumber == 2) {
    if (keyIsDown(65) && enemyX > 0) {
      enemyX -= playerSpeed;
    } else if (keyIsDown(68) && enemyX < (width - playerWidth)) {
      enemyX += playerSpeed;
    }
  }
}

function clock() {
  if (clockStarted) {
    textAlign(CENTER);
    textSize(30);
    fill(255, 255, 255, 30);
    text(timer, width / 2, height / 2);
    fill(255);
    timer++;
  }
}

function difficulty() {
  let addSpeed = timer / difficultyConstant;
  ballSpeed = ballSpeed + addSpeed;

  if (ballSpeedX > 0) {
    ballSpeedX = ballSpeedX + addSpeed;
  } else {
    ballSpeedX = ballSpeedX - addSpeed;
  }

  if (ballSpeedY > 0) {
    ballSpeedY = ballSpeedY + addSpeed;
  } else {
    ballSpeedY = ballSpeedY - addSpeed;
  }
}
