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
    this.context = this.canvas.getContext("2d",{ willReadFrequently: true });
    this.canvas.onmousemove = updatemouse;
    this.canvas.onmousedown = mouse_click;
    this.canvas.onmouseup = mouse_up;
    this.keys = [];
    this.level = 1;


    this.mx = 0;
    this.my = 0;
    this.mouseDown = false;
    this.scrollx = 0;
    this.scrolly = 0;


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

        let levelImage = document.getElementById("Level1-image");
        this.imgHeight = levelImage.height*(2000/levelImage.width);
        canvas.context.drawImage(levelImage,-this.scrollx-2000/2,-this.scrolly-this.imgHeight/2,2000,this.imgHeight);
        
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

function acid(dir, damage = 1, speed = 5) {
    this.x = player.x;
    this.y = player.y;
    this.dir = dir;
    this.damage = damage;
    this.width = 2;
    this.tick = 0;
    this.speed = speed;
    
    this.update = function(){
        this.tick += 1;
        if(this.tick >= 100){
            player.acids.splice(player.acids.indexOf(this), 1);
            return;
        }

        //collisions script

        for(let i = 0; i < 2*Math.PI;i+=0.1){
            let pointX = Math.round(this.x - Math.sin(i)*(this.width+1));
            let pointY = Math.round(this.y+ Math.cos(i)*(this.width+1));
            const pointData = canvas.context.getImageData(pointX-canvas.scrollx, pointY-canvas.scrolly , 1, 1);
            //console.log(pointData);
            if(
                pointData.data[0]>=60&&
                pointData.data[1]==0&&
                pointData.data[2]==0
            ){
                player.acids.splice(player.acids.indexOf(this), 1);
                return;
            }
        }

        this.x += Math.sin(this.dir) * -this.speed;
        this.y += Math.cos(this.dir) * this.speed;
    };
    this.draw = function(){
        let context = canvas.context;
        context.fillStyle = 'black';
        context.beginPath();
        context.arc(this.x-canvas.scrollx, this.y-canvas.scrolly, this.width, 0, 2 * Math.PI, false);
        context.fillStyle = 'black';
        context.fill();
        context.stroke();
    };

}

function player_data(){
    this.x = -900;
    this.y = 450;
    this.dir = 0;
    this.size = 100;
    this.speedX = 0;
    this.speedY = 0;
    this.speed = 2;
    this.maxSpeed = 4;
    this.acids = [];
    this.reload = 0;
    this.reloadTime = 100;

    this.update = function(){
        if(this.reload != 0){
            this.reload +=1;
        }

        this.dir = Math.atan2(canvas.my - this.y+canvas.scrolly, canvas.mx - this.x+canvas.scrollx) - (2*Math.PI)/4
        this.dir %= 2*Math.PI

        let oldx = this.x;
        let oldy = this.y;

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

        if(this.speedX > this.maxSpeed){
            this.speedX = this.maxSpeed;
        }else if(this.speedX < -this.maxSpeed){
            this.speedX = -this.maxSpeed;
        }

        if(this.speedY > 0 ){
            this.speedY -= 1;
        }else if(this.speedY < 0){
            this.speedY +=1;
        }

        if(this.speedY > this.maxSpeed){
            this.speedY = this.maxSpeed;
        }else if(this.speedY < -this.maxSpeed){
            this.speedY = -this.maxSpeed;
        }
        
        
        if(this.checkCollisions(this.x,this.y)){
            let newX = this.x;
            let newY = this.y;
            
            let match = false;
            if(Math.abs(this.speedX) > Math.abs(this.speedY)){
                //fidget y
                for(let i = 1; i < 12; i++){
                    if(!this.checkCollisions(newX,newY+i)){
                        this.y = newY + i;
                        match = true;
                        break;
                    }else if(!this.checkCollisions(newX,newY-i)){
                        this.y = newY - i;
                        match = true;
                        break;
                    }
                }
            }else{
                //fidget x
                for(let i = 1; i < 12;i++){
                    if(!this.checkCollisions(newX+i,newY)){
                        this.x = newX + i;
                        match = true;
                        break;
                    }else if(!this.checkCollisions(newX-i,newY)){
                        this.x = newX - i;
                        match = true;
                        break;
                    }
                }
            }
            if(!match){
                this.speedX = 0;
                this.speedY = 0;
                this.x = oldx
                this.y = oldy;
            }
        };
        


        //Shoot acids
        if (canvas.mouseDown && this.reload == 0){
            //const pointData = canvas.context.getImageData(canvas.mx, canvas.my , 1, 1);
            //console.log(pointData);
            for(let i = -1; i < 1;i+=0.1){
                this.acids.push(new acid(this.dir+i));
            }
            this.reload = -this.reloadTime;
            
        }

        //Update acids;
        for(let i = 0; i < this.acids.length; i++){
            this.acids[i].update();
        }

        //update canvas

        canvas.scrollx += (this.x-(canvas.scrollx+canvas.width/2))/10
        canvas.scrolly += (this.y-(canvas.scrolly+canvas.height/2))/10

        if(canvas.scrollx<-1000){
            canvas.scrollx = -1000;
        }
        if(canvas.scrolly<-canvas.imgHeight/2){
            canvas.scrolly = -canvas.imgHeight/2;
        }
        if(canvas.scrollx>1000-canvas.width){
            canvas.scrollx = 1000-canvas.width;
        }

        if(canvas.scrolly>canvas.imgHeight/2-canvas.height){
            canvas.scrolly = canvas.imgHeight/2-canvas.height;
        }
    };

    this.checkCollisions = function(x,y){
        //check collisions
        for(let i = 0; i < 2*Math.PI;i+=0.05){
            let pointX = Math.round(x - Math.sin(i)*(this.size/2+1));
            let pointY = Math.round(y+ Math.cos(i)*(this.size/2+1));
            const pointData = canvas.context.getImageData(pointX-canvas.scrollx, pointY-canvas.scrolly , 1, 1);
            
            if(
                pointData.data[0]>=150&&
                pointData.data[1]==0&&
                pointData.data[2]==0
            ){
                return true;
            }
        }
        return false;
    }

    this.draw = function(){
        let image = document.getElementById("charachter-image");

        canvas.context.save();

        // move to pos
        canvas.context.translate(this.x-canvas.scrollx,this.y-canvas.scrolly);

        //rotate image
        canvas.context.rotate(this.dir);

        
        canvas.context.drawImage(image,-this.size/2,-this.size/2,this.size,this.size);

        // restore
        canvas.context.restore();

        //Draw acids;
        for(let i = 0; i < this.acids.length; i++){
            this.acids[i].draw();
        }
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