//**********************************************************
// Any Graphic Object in the game: Enemies, Player
//**********************************************************

var GraphicObject = function(sprite,x,y) {
    // The image/sprite for our graphic object, this uses a helper
    // to load de file from resourses.js

    this.sprite = sprite;
    this.x = x;
    this.y = y;
};


GraphicObject.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};




//**********************************************
// Enemies our player must avoid
//**********************************************
var Enemy = function(x,y,speed) {

    GraphicObject.call(this,'images/enemy-bug.png',x,y);
    this.speed = speed;
    this.collisionArea = 60;
};

Enemy.prototype = Object.create(GraphicObject.prototype);
Enemy.prototype.constructor = Enemy;



// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (this.x < 480 ) {
        this.x += this.speed*dt;
    } else {
        this.x = 0;
    }
    this.render();
};


// Check when the player colides with an enemy
Enemy.prototype.checkCollisions = function() {


    if (player.x < this.x + this.collisionArea &&
     player.x + this.collisionArea > this.x &&
     player.y < this.y + this.collisionArea &&
     player.y + this.collisionArea > this.y   ) {

        // make a sound when the collision happens
        colideSound.play();

        // when the player collides with a bug it lose points
        game.updateScore(-20);
        player.reset();
    }
};


//**********************************************
// Player of the game
//**********************************************
var Player = function(){

    // initial position for the player
    this.beginX = 202;
    this.beginY = 415;
    // widht and height helps the player to move
    this.width = 101;
    this.height = 83;
    GraphicObject.call(this,'images/char-princess-girl.png',this.beginX ,this.beginY);
};


Player.prototype = Object.create(GraphicObject.prototype);
Player.prototype.constructor = Player;

// update the player on the screen
Player.prototype.update = function(dt) {
    this.render();
};


// Make all the changes needed when the player goes to the water (win the game)
Player.prototype.score = function() {
    winSound.play();
    game.updateScore(100);
    this.reset();
};

// Moves the player to the position at the beginnig of the
// game
Player.prototype.reset = function() {
    this.x = this.beginX;
    this.y = this.beginY;
    this.render();
};


// Moves the player according with the keys (up, down, left, right)
Player.prototype.handleInput = function(key){

        // 404 = canvas - distanceX

    if (key === 'left') {
        // checks if the player's next position is going to be inside the canvas
        // if not, keeps the player to the far left position
        if (this.x > 0) {
            this.x -=  this.width;
        } else {
            this.x = 0;
        }
        this.update();
    }

    if (key === 'right') {
        // checks if the player's next position is going to be inside the canvas
        // if not, keeps the player to the far right position
        if (this.x < 404) {
            this.x += this.width;
        } else {
            this.x = 404;
        }
        this.update();
    }


    if (key === 'up') {
        this.y -= this.height;
        this.update();

        // if the player gets to the water, wins the game
        if (this.y < 83) {
            this.score();
        }
    }


    if (key === 'down') {
        // if the player wants to go down makes sure he doesn't
        // leave the canvas
        if (this.y < this.beginY) {
            this.y += this.height;
        } else {
            this.y = this.beginY;
        }
        this.update();
    }
};


//**********************************************
// Numbers of the game
//**********************************************
var Game = function() {
    this.score = 0;
    this.level = 1
};


// Update the score
Game.prototype.updateScore = function(x) {

    this.score = this.score + x;
    if (this.score / 1000 > this.level) {
        this.changeLevel();
    }

};

// Prints the score
Game.prototype.printScore = function() {

    ctx.fillStyle = "white";
    ctx.font="30px Impact";
    ctx.textAlign = "right";
    ctx.strokeStyle = "black";
    ctx.fillText(this.score, 490, 100);
    ctx.strokeText(this.score, 490, 100);
};



// Change the level's game
Game.prototype.changeLevel = function() {

    this.level = this.level + 1;

    switch(this.level) {
        case 2:
            allEnemies.push(new Enemy(80, 150, 300));
            break;
        case 3:
            allEnemies.push(new Enemy(100, 180, 220));
            break;
        case 4:
            allEnemies[2].speed = allEnemies[2].speed * 1.2;
            break;
        case 5:
            allEnemies[0].speed = allEnemies[0].speed * 1.3;
            break;
        case 6:
            allEnemies.push(new Enemy(300, 230, 320));
            break;
        case 7:
            allEnemies[1].speed = allEnemies[1].speed * 1.5;
            break;
        case 8:
            this.endGame();
            break;
    }
};


// Initializar game, set level, player and enemies
Game.prototype.initGame = function() {

    // clear allEnemies array

    allEnemies.splice(0,allEnemies.length);

    allEnemies.push(new Enemy(10, 230, 200));
    allEnemies.push(new Enemy(150, 80, 180));

    game.score = 0;
    game.level = 1;
};


// Initializar game, set level, player and enemies
Game.prototype.endGame = function() {

    var r = alert("Game Over !!!! Play again ?");
    this.initGame();
};

// Prints the level's game
Game.prototype.printLevel = function() {

    ctx.fillStyle = "white";
    ctx.font="30px Impact";
    ctx.textAlign = "right";
    ctx.strokeStyle = "black";
    ctx.fillText("L: " + this.level, 50, 100);
    ctx.strokeText("L: " + this.level, 50, 100);


};

// Prints the score
Game.prototype.printNumbers = function() {

    this.printScore();
    this.printLevel();

};




//**********************************************
// Now instantiate your objects.
//**********************************************

// DEPOIS PASSAR A GERAR NUMEROS RANDOMICOS ENTRE 0 - 505 PARA O X E 50 E 230 PARA O Y.

var winSound = new Audio('sounds/win.wav');
var colideSound = new Audio('sounds/colide.wav');
var game = new Game();
var allEnemies = [];
var player = new Player();




game.initGame();




// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

     player.handleInput(allowedKeys[e.keyCode]);
});


