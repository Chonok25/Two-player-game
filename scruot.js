const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");

let keys = {};
let running = false;
const gravity = 0.6;

// คะแนน
let scoreLeft = 0;
let scoreRight = 0;

// ผู้เล่น
const playerLeft = { x:150, y:320, vx:0, vy:0 };
const playerRight = { x:710, y:320, vx:0, vy:0 };

// ลูกบอล
let ball = { x:450, y:200, vx:2, vy:1 };

// เริ่มเกม
startBtn.onclick = () => {
  startBtn.style.display = "none";
  canvas.style.display = "block";
  running = true;
  resetBall();
  gameLoop();
};

// ใช้ e.code เพื่อให้ W A D ใช้ได้ทุกเครื่อง
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

function resetBall() {
  ball.x = 450;
  ball.y = 200;
  ball.vx = Math.random() > 0.5 ? 2 : -2;
  ball.vy = 1;
}

// อัปเดตผู้เล่นพร้อมขอบเขต
function updatePlayer(p, left, right, jump, minX, maxX) {
  if (keys[left]) p.vx = -4;
  else if (keys[right]) p.vx = 4;
  else p.vx = 0;

  if (keys[jump] && p.y >= 320) p.vy = -12;

  p.vy += gravity;
  p.x += p.vx;
  p.y += p.vy;

  // ขอบเขตแนวนอน
  if (p.x < minX) p.x = minX;
  if (p.x > maxX) p.x = maxX;

  // พื้น
  if (p.y > 320) {
    p.y = 320;
    p.vy = 0;
  }
}

function updateBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.y <= 0 || ball.y >= 390) ball.vy *= -1;

  if (hit(playerLeft) || hit(playerRight)) {
    ball.vx *= -1;
    ball.vy = -5;
  }

  // ตรวจสอบคะแนน
  if (ball.x < 0) {
    scoreRight++;
    resetBall();
  }
  if (ball.x > 900) {
    scoreLeft++;
    resetBall();
  }
}

function hit(p) {
  return (
    ball.x > p.x &&
    ball.x < p.x + 40 &&
    ball.y > p.y &&
    ball.y < p.y + 80
  );
}

// วาดผล
function draw() {
  ctx.clearRect(0,0,900,400);

  // เส้นแบ่งกลาง
  ctx.fillStyle = "black";
  ctx.fillRect(450,0,2,400);

  // ผู้เล่น
  ctx.fillStyle = "red";
  ctx.fillRect(playerLeft.x, playerLeft.y, 40, 80);

  ctx.fillStyle = "blue";
  ctx.fillRect(playerRight.x, playerRight.y, 40, 80);

  // ลูกบอล
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, 10, 0, Math.PI*2);
  ctx.fill();

  // คะแนน
  ctx.fillStyle = "black";
  ctx.font = "22px Arial";
  ctx.fillText(`ซ้าย: ${scoreLeft}`, 20, 30);
  ctx.fillText(`ขวา: ${scoreRight}`, 800, 30);
}

// เกมลูป
function gameLoop() {
  if (!running) return;

  // ฝั่งซ้าย: minX=0, maxX=450
  updatePlayer(playerLeft, "KeyA", "KeyD", "KeyW", 0, 450);

  // ฝั่งขวา: minX=450, maxX=860
  updatePlayer(playerRight, "ArrowLeft", "ArrowRight", "ArrowUp", 450, 860);

  updateBall();
  draw();
  requestAnimationFrame(gameLoop);
}


  