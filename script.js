const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let x = canvas.width/2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let ballRadius = 10;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth)/2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let bricks = [];
for (c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for (r=0; r<brickRowCount; r++) {
        bricks[c][r] = {x: 0, y: 0};
    };
};

function drawBricks() {
    for (c=0; c<brickColumnCount; c++) {
        for (r=0; r<brickRowCount; r++) {
            let brickX = (c*(brickWidth + brickPadding)) + brickOffsetLeft;
            let brickY = (r*(brickHeight + brickPadding)) + brickOffsetTop;

            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = '#0095DD';
            ctx.fill();
            ctx.closePath();
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

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
};

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
};

function draw() {
    //clearRect - nadaje granice
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();

    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height - ballRadius) {
        //jeśli jest pomiędzy lewym a prawym przegiem paddle
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            alert('GAME OVER');
            document.location.reload();
        };
    };

    if(x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
        dx = -dx;
    };

    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    };

    x += dx;
    y += dy;
};

setInterval(draw, 10);