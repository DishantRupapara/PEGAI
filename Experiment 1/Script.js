// ===============================
// DOM Elements
// ===============================

const board = document.getElementById("gameBoard");
const context = board.getContext("2d");

const scoreText = document.getElementById("scoreValue");
const lengthText = document.getElementById("lengthValue");
const bestText = document.getElementById("bestScore");
const stateText = document.getElementById("gameState");

const popup = document.getElementById("gamePopup");
const popupScore = document.getElementById("popupScore");

const restartButton = document.getElementById("playAgain");
const popupRestart = document.getElementById("popupRestart");

// ===============================
// Board Settings
// ===============================

const CELL_SIZE = 20;
const BOARD_SIZE = 30;

board.width = CELL_SIZE * BOARD_SIZE;
board.height = CELL_SIZE * BOARD_SIZE;

let snakeBody;
let currentMove;
let nextMove;

let apple;

let currentScore;
let highestScore = 0;

let timer;

// ===============================
// Random Position
// ===============================

function createPosition(){

    let point;

    do{

        point={
            x:Math.floor(Math.random()*BOARD_SIZE),
            y:Math.floor(Math.random()*BOARD_SIZE)
        };

    }while(
        snakeBody.some(
            part=>part.x===point.x && part.y===point.y
        )
    );

    return point;

}

// ===============================
// Initialize Game
// ===============================

function initializeGame(){

    snakeBody=[
        {x:15,y:15},
        {x:14,y:15},
        {x:13,y:15}
    ];

    currentMove={x:1,y:0};
    nextMove={x:1,y:0};

    currentScore=0;

    apple=createPosition();

    popup.classList.add("hidden");

    stateText.textContent="Running";

    clearInterval(timer);

    timer=setInterval(gameLoop,110);

    updatePanel();

    renderGame();

}

// ===============================
// Main Loop
// ===============================

function gameLoop(){

    currentMove=nextMove;

    const head={

        x:snakeBody[0].x+currentMove.x,

        y:snakeBody[0].y+currentMove.y

    };

    // Wall Collision

    if(

        head.x<0 ||

        head.y<0 ||

        head.x>=BOARD_SIZE ||

        head.y>=BOARD_SIZE

    ){

        return finishGame();

    }

    // Self Collision

    if(

        snakeBody.some(

            part=>part.x===head.x && part.y===head.y

        )

    ){

        return finishGame();

    }

    snakeBody.unshift(head);

    if(

        head.x===apple.x &&

        head.y===apple.y

    ){

        currentScore+=10;

        apple=createPosition();

    }

    else{

        snakeBody.pop();

    }

    updatePanel();

    renderGame();

}

// ===============================
// Draw Game
// ===============================

function renderGame(){

    context.fillStyle="#040814";

    context.fillRect(

        0,

        0,

        board.width,

        board.height

    );

    // Grid

    context.strokeStyle="rgba(255,255,255,.05)";

    for(let i=0;i<=BOARD_SIZE;i++){

        context.beginPath();

        context.moveTo(i*CELL_SIZE,0);

        context.lineTo(i*CELL_SIZE,board.height);

        context.stroke();

        context.beginPath();

        context.moveTo(0,i*CELL_SIZE);

        context.lineTo(board.width,i*CELL_SIZE);

        context.stroke();

    }

    // Apple

    context.fillStyle="#ff4d6d";

    context.beginPath();

    context.arc(

        apple.x*CELL_SIZE+10,

        apple.y*CELL_SIZE+10,

        8,

        0,

        Math.PI*2

    );

    context.fill();

    // Snake

    snakeBody.forEach((segment,index)=>{

        context.fillStyle=

            index===0

            ?"#00e5ff"

            :"#00ff88";

        context.fillRect(

            segment.x*CELL_SIZE+2,

            segment.y*CELL_SIZE+2,

            CELL_SIZE-4,

            CELL_SIZE-4

        );

    });

}

// ===============================
// Update Information
// ===============================

function updatePanel(){

    scoreText.textContent=currentScore;

    lengthText.textContent=snakeBody.length;

    if(currentScore>highestScore){

        highestScore=currentScore;

    }

    bestText.textContent=highestScore;

}

// ===============================
// Game Over
// ===============================

function finishGame(){

    clearInterval(timer);

    stateText.textContent="Stopped";

    popupScore.textContent=currentScore;

    popup.classList.remove("hidden");

}

// ===============================
// Keyboard Controls
// ===============================

document.addEventListener("keydown",event=>{

    switch(event.key){

        case "ArrowUp":

            if(currentMove.y!==1)

                nextMove={x:0,y:-1};

            break;

        case "ArrowDown":

            if(currentMove.y!==-1)

                nextMove={x:0,y:1};

            break;

        case "ArrowLeft":

            if(currentMove.x!==1)

                nextMove={x:-1,y:0};

            break;

        case "ArrowRight":

            if(currentMove.x!==-1)

                nextMove={x:1,y:0};

            break;

    }

});

// ===============================
// Restart Buttons
// ===============================

restartButton.onclick=initializeGame;

popupRestart.onclick=initializeGame;

// ===============================
// Start Game
// ===============================

initializeGame();
