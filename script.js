const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let x = (canvas.width/2) + Math.floor(Math.random()*21) - 10;
let y = (canvas.height - 30) + Math.floor(Math.random()*21) - 10;
let dx = 3;
let dy = -3;
let ballRadius = 20;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth)/2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 3;
let brickColumnCount = 7;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 50;
let score = 0;
let lives = 3;
let gameOver = false;
let level = 1;
let maxLevel = 5;
let paused = false;
const ball = new Image();
ball.src = 'http://pngimg.com/uploads/football/football_PNG52790.png';

let bricks = [];
initBricks();

function initBricks() {
    for (c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for (r=0; r<brickRowCount; r++) {
            bricks[c][r] = {x: 0, y: 0, status: 1};
        };
    };
};

function drawBricks() {
    for (c=0; c<brickColumnCount; c++) {
        for (r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                let brickX = (c*(brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r*(brickHeight + brickPadding)) + brickOffsetTop;

                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#fff';
                ctx.fill();
                ctx.closePath();
            }            
        }
    }
}

function keyDownHandler(e) {
    //39 - right arrow button, 37 - left
    if(e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode ==37) {
        leftPressed = true;
    };
};

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode ==37) {
        leftPressed = false;
    };
};

function mouseMoveHandler(e) {
    //e.clientX - begin of page left side, canvas.offsetLeft - begin of canvas left side
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 + paddleWidth/2 && relativeX < canvas.width - paddleWidth/2) {
        paddleX = relativeX - paddleWidth/2;
    }
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

function drawBall() {
    ctx.drawImage(ball, x, y, ballRadius, ballRadius);
};

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, (canvas.height-paddleHeight)-10, paddleWidth, paddleHeight);
    ctx.fillStyle = '#C29D69';
    ctx.fill();
    ctx.closePath();
};

function bricksCollisionDetector() {
    for (c=0; c<brickColumnCount; c++) {
        for (r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy =- dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        if(level === maxLevel) {
                            alert("YOU WIN!");
                            document.location.reload();
                        } else {
                            level++;
                            brickRowCount++;
                            initBricks();
                            score = 0;
                            dx += 1;
                            dy = -dy;
                            dy -= 1;
                            x = (canvas.width/2) + Math.floor(Math.random()*21) - 10;
                            y = (canvas.height - 30) + Math.floor(Math.random()*21) - 10;
                            paddleX = (canvas.width - paddleWidth) / 2;
                            paused = true;
                            
                            ctx.beginPath();
                            ctx.rect(0, 0, canvas.width, canvas.height);
                            ctx.fillStyle = "#fff";
                            ctx.fill();
                            ctx.font = "16px Arial";
                            ctx.fillStyle = "#000";
                            ctx.fillText('Level: ' + (level - 1) + ' completed, starting next level...', 110, 150);

                            setTimeout(function() {
                                paused = false;
                                draw();
                            }, 3000);
                        }
                    }
                }
            }
            
        }
    }
};

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#C29D69";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#C29D69";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawLevel() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#C29D69";
    ctx.fillText("Level: " + level, 310, 20);
}

function draw() {
    //clearRect - gives border
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    bricksCollisionDetector();
    drawScore();
    drawLives();
    drawLevel();

    //border top and x for ball
    if(x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
        dx = -dx;
    };

    //paddle controler
    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    };

    //ball collision detection
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height - ballRadius) {
        //if ball is between left&right paddle
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if(!lives && !gameOver) {
                gameOver = true;
                alert('GAME OVER');
                document.location.reload();
            } else {
                x = (canvas.width/2) + Math.floor(Math.random()*21) - 10;
                y = (canvas.height - 30) + Math.floor(Math.random()*21) - 10;
                paddleX = (canvas.width - paddleWidth)/2;
            }
        };
    };

    x += dx;
    y += dy;

    if(!paused) {
        requestAnimationFrame(draw);
    };    
};

draw();