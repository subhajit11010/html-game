window.addEventListener('DOMContentLoaded', function(){ 
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const cw = canvas.width = 1000;
const ch = canvas.height = 500;
class Game{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.player = new Player(this);
        this.wall1 = new Wall1(this);
        this.keys = [];
        this.input = new InputHandler(this);
        this.ui = new UI(this);
        this.wallTimer = 1000;
        this.startTimer = 0;
        this.wallArr = [];
        this.gameOver = false;
        this.currentTime = 0;
        this.gameStart = false;
        this.next = false;
        this.gameSound = new Audio('gameSound.mp3');
        this.gameOverSound = new Audio('gameOverSound.wav');
        this.gameOverSoundPlayed = false;
        this.playerPosition;
    }
    update(deltaTime){
        if(this.gameStart && !this.gameOver){
        this.player.update();
        if(this.currentTime >= 5000){
            this.player.x -= 0.1
        }
        if(this.currentTime >= 10000){
            this.player.x += 0.5;
        }
        if(this.currentTime >= 20000){
            this.player.x -= 0.5;
        }
        if(this.currentTime >= 40000 && this.currentTime < 45000){
            this.player.x += 0.3;
            this.playerPosition = this.player.x;
        }
        if(this.currentTime >= 45000){
            this.player.x = this.playerPosition;
        }
        }
        if(this.startTimer > this.wallTimer){
            if(!this.gameOver && this.gameStart && this.next)
                {this.addWall();}
            this.startTimer = 0;
        }
        else{
            this.startTimer += deltaTime;
        }
        if(this.gameStart && !this.gameOver){
        this.wallArr.forEach(wall=>{
            
            wall.update(this.currentTime);
            
            if(!(this.player.x+this.player.width < wall.x)&&
                !(this.player.x + this.player.width > wall.x + wall.width)&&
                !(wall.y + wall.height < this.player.y)&&
                !(wall.y > this.player.y + this.player.height)
                ){
                console.log("Try again!");
                this.gameOver = true;
                
            }
        });
        this.wallArr = this.wallArr.filter(wall => !wall.markedForDeletion);
    }
    }
    display(deltaTime,context){
        if(!this.next){
        this.splashScreen(context);
        }
        if(!this.gameStart && this.next && !this.gameOver){
            this.Start(context);
        }
        
        if(this.gameStart && !this.gameOver){
            this.playSound();
        }
        
        if(!this.gameOver){
        this.backgroundColorDisplay(this.currentTime,context);
        }
        this.player.display(context);
        this.ui.display(context);
        if(!this.gameOver && this.gameStart && this.next){
        this.gameTime(deltaTime, context);
        }
        if(this.gameStart && !this.gameOver && this.next){
        this.wallArr.forEach(wall =>{
            
            wall.display(context);
            
        }); 
    }
        if(this.gameOver){

            this.gameOverMessage(context, this.currentTime);
            if(!this.gameOverSoundPlayed){
            this.gameoverSound();
            this.gameOverSoundPlayed = true;
            }
            this.gameSound.pause();

        }
    }
    addWall(){
        this.wallArr.push(new Wall1(this));
    }
    gameOverMessage(context, currentTime){
        context.fillStyle = 'yellow';
        context.font = "40px Arial";
        context.fillText("PLease try again!", 300, 250);
        context.fillStyle = 'green';
        context.font = "30px Helvetica";
        context.fillText("Survived for: ", 300, 300);
        var time = Math.floor(currentTime/1000);
        context.fillText(time, 480, 300);
        context.fillText("sec", 550, 300);
    }
    gameTime(deltaTime,context){
        this.currentTime = this.currentTime + deltaTime;
        var time = Math.floor(this.currentTime/1000);
        context.fillText(time, 890, 26);
        context.fillText("sec", 950, 26);
    }
    backgroundColorDisplay(ctime,context){
        if(ctime > 5000){
        context.fillStyle = 'aqua';
        context.fillRect(0, 0, 1000, 500);
        }
        if(ctime > 30000){
            context.fillStyle = 'violet';
            context.fillRect(0, 0, 1000, 500);
        }
        if(ctime > 60000){
            context.fillStyle = 'blue';
            context.fillRect(0, 0, 1000, 500);
        }
        if(ctime > 120000){
            context.fillStyle = 'green';
            context.fillRect(0, 0, 1000, 500);
        }
    }
    Start(context){
        context.fillStyle = 'white';
        context.font = "40px Helvetica";
        context.fillText("Press 's' to start the game!", 250, 250);
    }
    splashScreen(context){
        context.fillStyle = 'black';
        context.font = "40px Helvetica";
        context.fillRect(0, 0, 1000, 500);
        context.fillStyle = 'white';
        context.fillText("For up: ARROWUP", 300, 200);
        context.fillText("For down: ARROWDOWN", 300, 290);
        context.fillText("Press 'n' to go to the next page", 250, 380);
    }
    playSound(){
        var x = this.gameSound;
        x.loop = true;
        x.play();
    }
    gameoverSound(){
        this.gameOverSound.play();
    }
}
class Player{
    constructor(game){  
        this.game = game;
        this.height = 20;
        this.width = 20;
        this.x = 100;
        this.y = 230;
        this.speedY = 0;
    }
    update(){   
        if(this.game.keys.includes('ArrowUp')){
            this.speedY = -5;
        }
        else if(this.game.keys.includes('ArrowDown')){
            this.speedY = 5;
        }
        else {
            this.speedY = 0;
        }
        this.y += this.speedY;
        if(this.y <= 30){
            this.y = 30;
        }
        if(this.y + this.height >= canvas.height){
            this.y = canvas.height - this.height;
        }
    }
    display(context){
        context.fillStyle = 'red';
        context.fillRect(this.x, this.y, this.width, this.height);
    }   
}
class Wall1{
    constructor(game) {
        this.game = game;
        this.height = 200;
        this.width = 40;
        this.x = 900;
        this.y = 35 + Math.floor(Math.random() * 266);
        this.speedX = 2;
        this.markedForDeletion = false;
    }
    update(currentTime){
        this.x -= this.speedX;
        if(currentTime === 5000){
            this.speedX = 5;
        }
        if(this.x <= 0){
            this.markedForDeletion = true;
        }
    }
    display(context){
        context.fillStyle = 'white';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}
class InputHandler{
    constructor(game){
        this.game = game;
        window.addEventListener('keydown', e=>{
            if(e.key === 'ArrowUp' && this.game.keys.indexOf(e.key) === -1){
                this.game.keys.push(e.key);
            }
            else if(e.key === 'ArrowDown' && this.game.keys.indexOf(e.key) === -1){
                this.game.keys.push(e.key);
            }
            console.log(this.game.keys);
        });
        window.addEventListener('keyup', e=>{
            if(this.game.keys.indexOf(e.key) > -1){
                this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
            }
        });
        window.addEventListener('keydown', e=>{
            if(e.key === 's' && this.game.next){
                this.game.gameStart = true;
                
            }
        });
        window.addEventListener('keydown', e=>{
            if(e.key === 'n'){
                this.game.next = true;
                
            }
        });
    }
}
class UI{
    constructor(game){
        this.game = game;
        this.height = 30;
        this.width = 200;
    }
    display(context){
        context.strokeStyle = 'white';
        context.strokeRect(cw-this.width, 0, this.width, this.height);
        context.fillStyle = 'white';
        context.fillRect(0, 0, cw - 200, 30);
        context.fillStyle = 'black';
        context.font = '30px Arial';
        context.fillText("Survive!", 300, 26);
        context.font = "30px Arial";
        context.fillStyle = 'white';
        context.fillText("Time:", 800, 26)
    }
}
var game = new Game(cw, ch);
let lastTime = 0;
function animate(ctime){
    const deltaTime = ctime - lastTime;
    //console.log(deltaTime);
    lastTime = ctime;
    ctx.clearRect(0, 0, cw, ch);
    game.update(deltaTime);
    game.display(deltaTime,ctx);
    requestAnimationFrame(animate);
}
animate(0);
})