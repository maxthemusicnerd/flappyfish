
const CANVAS = document.getElementById("gameCanvas");
const ctx = CANVAS.getContext('2d');
const screenwidth = 1500;
const screenheight = 760;

CANVAS.width = screenwidth;
CANVAS.height = screenheight;

function getRandomInt(min, max) {
    min = Math.ceil(min); 
    max = Math.floor(max); 
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let gameStart = false;
let is_alive = true;

const fish = new Image();
fish.src = "images/bird3.png";
const obstacle = new Image();
obstacle.src = "images/obstacle.png";

let x = 60;
let y = 300;
let stored_y = y;
fish.onload = function() {
    draw_fish();
};

function draw_fish() {
    ctx.clearRect(x, stored_y, fish.width, fish.height);
    ctx.drawImage(fish, x, y);
}

//fish movement
const basegrav = 1;
let grav = basegrav;
function gravity() {
    function applyGravity() {
        if (!is_jumping && gameStart) {
            stored_y = y;
            y += grav; 
            draw_fish();
            if (y < screenheight) {
                requestAnimationFrame(applyGravity);
                if (grav < 2) {
                    grav += 0.1
                }
            }
        }
    }
    applyGravity()
}

//obstacles
let coordinates = [];
function handler() {
    if (gameStart === true) {
        requestAnimationFrame(function (){
            for (let i = 0; i < coordinates.length; i++) {
                let storedArray = coordinates[i];
                let moverX = storedArray[0];
                let moverY = storedArray[1];
                ctx.clearRect(moverX, moverY, obstacle.width, obstacle.height);
                if (moverX > -120) {
                    moverX -= 4;
                    ctx.drawImage(obstacle, moverX, moverY);
                    storedArray[0] = moverX;
                    coordinates[i] = storedArray;
                } else {
                    coordinates.splice(i, 1)
                }
            }
        })
    }
    
    requestAnimationFrame(handler);
}

function spawner() {
    if (gameStart === true) {
        let currentPipe = [screenwidth];
        let yPipe = getRandomInt(-470, -30);
        ctx.drawImage(obstacle, screenwidth, yPipe);
        currentPipe.push(yPipe)
        coordinates.push(currentPipe)
    }
}

function spawn_loop() {
    if (gameStart === true) {
        spawner();
        setTimeout(spawn_loop, 1500);
    } else {
        setTimeout(spawn_loop, 50);
    }
}

spawn_loop();
handler();

function death() {
    if (!is_alive) {
        ctx.clearRect(x, y, fish.width, fish.height);
        for (let i = 0; i < coordinates.length; i++) {
            let storedArray = coordinates[i];
            let moverX = storedArray[0];
            let moverY = storedArray[1];
            ctx.clearRect(moverX, moverY, obstacle.width, obstacle.height);
        }
        coordinates = [];
        x = 60;
        y = 300;
        setTimeout(ctx.drawImage(fish, x, y), 4000);
        is_alive = true;
        gameStart = false;
        alert("For shame...")
    }
}

//collision 
function collision_check() {
    boxes()
    if (y >= screenheight - 64 || conf_overlap) {
        is_alive = false;
        death();
        x_overlap = false;
        y_overlap = false;
        conf_overlap = false;
    }
    requestAnimationFrame(collision_check);
}

let conf_overlap = false;
function boxes() {
    let x_overlap = false;
    let y_overlap = false;
    for (let i = 0; i < coordinates.length; i++) {
        let storedArray = coordinates[i];
        let checker_x = storedArray[0]
        let checker_y = storedArray[1]
        if (checker_x <= x + 58 && x + 58 <= checker_x + obstacle.width) {
            x_overlap = true;
        }
        
        if (checker_y <= y - 2 && y - 2 <= checker_y + 482 
        || checker_y + 718 <= y + 58 && y + 58 <= checker_y + obstacle.height) {
            y_overlap = true;
            console.log(storedArray[0], storedArray[1])
            console.log(checker_y, y, checker_y + 502, checker_y + 698, y, checker_y + obstacle.height)
            console.log(y)
        }
        if (x_overlap && y_overlap) {
        conf_overlap = true;
        } else {
            y_overlap = false;
            x_overlap = false;
        }
    
    }

}

//jumping
let is_jumping = false;
let jumpspeed;
const maxjump = 160;

function jump() {
    collision_check();
    is_jumping = true;
    gameStart = true;
    let count_jump = 0;
    function executeJump() {
        jumpspeed = 6;
        stored_y = y;
        y -= jumpspeed;
        count_jump += jumpspeed;
        draw_fish();
        if (y > 0 && count_jump < maxjump) {
            requestAnimationFrame(executeJump);
            if (jumpspeed > 0.3) {
                jumpspeed -= 0.1;
            }
        } else {
            is_jumping = false;
            gravity();
            grav = basegrav;
            count_jump = 0;
        }
    }
    executeJump();
}

CANVAS.addEventListener('click', jump)



