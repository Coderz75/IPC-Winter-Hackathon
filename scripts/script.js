"use strict";

var panelOpen = false;

function setup(){
    document.getElementById("game").style.display = "none";
    var panels = document.getElementsByClassName("panel");
    for(var i = 0; i < panels.length; i++) {
        panels[i].style.display = "none";
    }
    var hides = document.getElementsByClassName("hide");
    for(var i = 0; i < hides.length; i++) {
        hides[i].style.display = "none";
    }
}

function start(){
    document.getElementById("welcome").style.display = "none";
    document.getElementById("game").style.display = "block";
    var interval = setInterval(tick, 10);
}

function InfoImage(){
    this.src = "";
    this.alt = "";
}

function InfoCard(){
    this.title = "";
    this.info = "";
    this.img = new InfoImage();
}

function Panel(){
    this.text = "";
    this.card = new InfoCard();
}


function OutsideWorldBody(){
    this.panels = ["Info","Lifeline","Help"];
    this.openPanel = -1;
    this.panels.info = new Panel();
    this.panels.lifeline = new Panel();
    this.panels.help = new Panel();

    this.panels.info.text = document.getElementById("info-text").innerHTML;
    this.panels.info.card.title = document.getElementById("info-card-title").innerHTML;
    this.panels.info.card.img.src = document.getElementById("info-card-img").src;
    this.panels.info.card.img.alt = document.getElementById("info-card-img").alt;
    this.panels.info.card.info = document.getElementById("info-card-info").innerHTML;

    this.panels.lifeline.text = document.getElementById("lifeline-text").innerHTML;

    this.panels.help.text = document.getElementById("help-text").innerHTML;

    this.openInfo = function(){
        if(this.openPanel != -1){
            eval(`this.close${this.panels[this.openPanel]}();`)
        }
        document.getElementById("info").style.display = "inline-block";
        this.openPanel = 0;
    }

    this.openLifeline = function(){
        if(this.openPanel != -1){
            eval(`this.close${this.panels[this.openPanel]}();`)
        }
        document.getElementById("lifeline").style.display = "inline-block";
        this.openPanel = 1;
    }
    this.openHelp = function(){
        if(this.openPanel != -1){
            eval(`this.close${this.panels[this.openPanel]}();`)
        }
        document.getElementById("help").style.display = "inline-block";
        this.openPanel = 2;
    }

    //Close
    this.closeInfo = function(){
        document.getElementById("info").style.display = "none";
        this.openPanel=-1;
    }

    this.closeLifeline = function(){
        document.getElementById("lifeline").style.display = "none";
        this.openPanel=-1;
    }
    this.closeHelp = function(){
        document.getElementById("help").style.display = "none";
        this.openPanel=-1;
    }

    this.update = function(){
        // update texts
        document.getElementById("info-text").innerHTML = this.panels.info.text;
        document.getElementById("info-card-title").innerHTML = this.panels.info.card.title;
        document.getElementById("info-card-img").src = this.panels.info.card.img.src;
        document.getElementById("info-card-img").alt = this.panels.info.card.img.alt;
        document.getElementById("info-card-info").innerHTML = this.panels.info.card.info;

        document.getElementById("lifeline-text").innerHTML = this.panels.lifeline.text;

        document.getElementById("help-text").innerHTML = this.panels.help.text;
    }
}

function GameCanvasBody(){
    this.canvas = document.getElementById("game-canvas");
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext("2d");
    this.canvas.onmousemove = updatemouse;
    this.canvas.onmousedown = mouse_click;
    this.canvas.onmouseup = mouse_up;
    this.keys = [];

    this.mx = 0;
    this.my = 0;
    this.mouseDown = false;

    this.canvas.style.cursor = 'none';
    window.addEventListener('keydown', function (e) {
        canvas.keys = (canvas.keys || []);
        canvas.keys[e.keyCode] = true;
      })
    window.addEventListener('keyup', function (e) {
        canvas.keys[e.keyCode] = false;
    })
    this.clear = function() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
function mouse_click(event){
    canvas.mouseDown = true;
    
}
function mouse_up (event){
    canvas.mouseDown = false;
}
function updatemouse(event){
    canvas.mx = event.clientX;
    canvas.my = event.clientY;
}

function player_data(){
    this.x = 0;
    this.y = 0;
    this.dir = 0;
    this.size = 100;
    this.speedX = 0;
    this.speedY = 0;
    this.speed = 2;

    this.update = function(){
        this.dir = Math.atan2(canvas.my - this.y, canvas.mx - this.x) - (2*Math.PI)/4
        this.dir %= 2*Math.PI

        //A
        if (canvas.keys && (canvas.keys[37] || canvas.keys[65])) {player.speedX -= this.speed; }
        //W
        if (canvas.keys && (canvas.keys[39] || canvas.keys[68])) {player.speedX += this.speed; }
        //W
        if (canvas.keys && (canvas.keys[38] || canvas.keys[87])) {player.speedY -= this.speed; }
        //S
        if (canvas.keys && (canvas.keys[40] || canvas.keys[83])) {player.speedY += this.speed; }
        this.x += this.speedX;
        this.y += this.speedY;

        if(this.speedX > 0 ){
            this.speedX -= 1;
        }else if(this.speedX < 0){
            this.speedX +=1;
        }

        if(this.speedX > 10){
            this.speedX = 10;
        }else if(this.speedX < -10){
            this.speedX = -10;
        }

        if(this.speedY > 0 ){
            this.speedY -= 1;
        }else if(this.speedY < 0){
            this.speedY +=1;
        }

        if(this.speedY > 10){
            this.speedY = 10;
        }else if(this.speedY < -10){
            this.speedY = -10;
        }

    };
    this.draw = function(){
        let image = document.getElementById("charachter-image");

        canvas.context.save();

        // move to pos
        canvas.context.translate(this.x,this.y);

        //rotate image
        canvas.context.rotate(this.dir);

        
        canvas.context.drawImage(image,-this.size/2,-this.size/2,this.size,this.size);

        // restore
        canvas.context.restore();
    };
}

var outside = new OutsideWorldBody();
var canvas = new GameCanvasBody();
var player = new player_data();

function tick(){
    outside.update();
    player.update();
    canvas.clear();
    player.draw();
    
    //mouse
    let ctx = canvas.context;
    ctx.beginPath();
    ctx.moveTo(canvas.mx, canvas.my - 50);
    ctx.lineTo(canvas.mx, canvas.my + 50);
    ctx.moveTo(canvas.mx - 50, canvas.my);
    ctx.lineTo(canvas.mx + 50, canvas.my);
    ctx.stroke();
}