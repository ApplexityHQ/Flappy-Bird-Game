const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const STATE = { INTRO:0, PLAY:1, OVER:2 };
let state = STATE.INTRO;

let frame = 0;
let score = 0;

// ===== BIRD =====
const bird = {
  x: 120,
  y: 300,
  r: 18,
  vel: 0,
  gravity: 0.45,
  jump: -7.5
};

// ===== GAME OBJECTS =====
const pipes = [];
const pipeW = 60;
const gap = 180;          // easier
const speed = 1.8;        // slower
const groundY = 580;

// ---------- DRAW HELPERS ----------
function drawSky() {
  ctx.fillStyle = "#4ec0ca";
  ctx.fillRect(0,0,canvas.width,canvas.height);
}

function drawGround() {
  ctx.fillStyle = "#e6d68a";
  ctx.fillRect(0, groundY, canvas.width, 60);

  ctx.fillStyle = "#c9b458";
  for(let i=0;i<canvas.width;i+=50){
    ctx.fillRect(i, groundY, 25, 60);
  }
}

function drawBird() {
  ctx.save();
  ctx.translate(bird.x, bird.y);
  ctx.rotate(Math.min(bird.vel / 10, 0.4));

  // body
  ctx.fillStyle = "#ffd93d";
  ctx.beginPath();
  ctx.arc(0,0,bird.r,0,Math.PI*2);
  ctx.fill();

  // wing
  ctx.fillStyle = "#f8bc06ff";
  ctx.beginPath();
  ctx.arc(-6,2,6,0,Math.PI*2);
  ctx.fill();

  // eye white
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(6,-4,4,0,Math.PI*2);
  ctx.fill();

  // pupil
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(7,-4,2,0,Math.PI*2);
  ctx.fill();

  // beak
  ctx.fillStyle = "#f90c04ff";
  ctx.beginPath();
  ctx.moveTo(bird.r,0);
  ctx.lineTo(bird.r+6,2);
  ctx.lineTo(bird.r,4);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawPipes() {
  ctx.fillStyle = "#3cb54a";
  pipes.forEach(p=>{
    ctx.fillRect(p.x,0,pipeW,p.top);
    ctx.fillRect(p.x,p.top+gap,pipeW,groundY);

    ctx.fillStyle="#2e8b3d";
    ctx.fillRect(p.x-4,p.top-12,pipeW+8,12);
    ctx.fillRect(p.x-4,p.top+gap,pipeW+8,12);
    ctx.fillStyle="#3cb54a";
  });
}

function drawPanel(y, h) {
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(60, y, canvas.width-120, h);
}

function drawCenteredText(text, y, size, color="#fff") {
  ctx.font = `${size}px 'Press Start 2P'`;
  ctx.textAlign = "center";
  ctx.fillStyle = color;
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.strokeText(text, canvas.width/2, y);
  ctx.fillText(text, canvas.width/2, y);
}

function drawScore() {
  drawPanel(20, 50);
  drawCenteredText("SCORE  " + score, 55, 16);
}

// ---------- UPDATE ----------
function updateBird() {
  bird.vel += bird.gravity;
  bird.y += bird.vel;

  if(bird.y + bird.r > groundY) state = STATE.OVER;
  if(bird.y - bird.r < 0) bird.y = bird.r;
}

function updatePipes() {
  if(frame % 120 === 0){
    pipes.push({
      x: canvas.width,
      top: Math.random()*220 + 80,
      passed:false
    });
  }

  pipes.forEach(p=>{
    p.x -= speed;

    if(
      bird.x+bird.r > p.x &&
      bird.x-bird.r < p.x+pipeW &&
      (bird.y-bird.r < p.top || bird.y+bird.r > p.top+gap)
    ){
      state = STATE.OVER;
    }

    if(!p.passed && p.x+pipeW < bird.x){
      p.passed = true;
      score++;
    }
  });

  while(pipes.length && pipes[0].x+pipeW<0) pipes.shift();
}

// ---------- GAME LOOP ----------
function loop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawSky();

  if(state === STATE.INTRO){
    drawGround();
    drawPanel(200,160);
    drawCenteredText("FLAPPY BIRD",260,28);
    drawCenteredText("PRESS SPACE",310,14);
    drawCenteredText("OR CLICK",335,14);
  }

  if(state === STATE.PLAY){
    drawPipes();
    updatePipes();
    updateBird();
    drawBird();
    drawGround();
    drawScore();
    frame++;
  }

  if(state === STATE.OVER){
    drawPipes();
    drawBird();
    drawGround();
    drawPanel(220,180);
    drawCenteredText("GAME OVER",270,24,"#ff5252");
    drawCenteredText("SCORE  " + score,315,16);
    drawCenteredText("PRESS SPACE",360,14);
    drawCenteredText("OR CLICK",385,14);
  }

  requestAnimationFrame(loop);
}

// ---------- INPUT ----------
function input(){
  if(state===STATE.INTRO) state=STATE.PLAY;
  else if(state===STATE.PLAY) bird.vel=bird.jump;
  else {
    pipes.length=0;
    bird.y=300;
    bird.vel=0;
    score=0;
    frame=0;
    state=STATE.PLAY;
  }
}

document.addEventListener("keydown",e=>e.code==="Space"&&input());
canvas.addEventListener("click",input);

loop();

