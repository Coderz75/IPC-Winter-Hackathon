"use strict";
/*
    Protect your host's body
    Copyright (C) 2024  Nuaym Syed

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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

var interval;
var gameTimer;
var level = 0;
var day = 1;
var gameTimer =0;
var lastTime = 0;
var enemies = [];
var dayTimer = 0;
var levelData ={
    0:{"lastday": -1},
    1:{
        "type": "Common cold",
        "info": "More than 200 viruses can cause the common cold, but rhinoviruses are the most common culprits. It's highly contagious and spreads through touch, airborne droplets from coughs and sneezes, and contaminated surfaces.",
        "infoImg": "common-cold.png",
        "img": "common-cold.png",
        "stats":{
            "dmg": 1,
            "health": 10,
            "speed": 10,
            "backlash": 1,
            "size": 10,
            "type": "calm"
        },
        "day1": 25,
        "day2": 25,
        "day3": 25,
        "day4": 25,
        "day5": 25,
        "day6": 25,
        "day7": 25,
        "lastday": 7,
        "spawn": {
            "x": 1896.6116313200093, 
            "y": 292
        }
    },
    2:{
        "type": "Influenza",
        "info": "Influenza, also commonly known as the flu, is a highly contagious respiratory illness caused by the influenza virus. It can infect the nose, throat, and lungs, and can cause mild to severe illness, and in some cases, even death. The flu is most common in the winter months, when people spend more time indoors and in close contact with each other.",
        "infoImg": "influenza.png",
        "img": "influenza.png",
        "stats":{
            "dmg": 5,
            "health": 10,
            "speed": 15,
            "backlash": 1,
            "size": 10,
            "type": "calm"
        },
        "day1": 25,
        "day2": 25,
        "day3": 25,
        "day4": 25,
        "day5": 25,
        "lastday": 5,
        "spawn": {
            "x": 35, 
            "y": 246
        }
    }
};

function start(){
    document.getElementById("welcome").style.display = "none";
    document.getElementById("game").style.display = "block";
    interval = setInterval(tick, 10);
    const d = new Date();
    lastTime = d.getTime();
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
    this.panels.info.card.img.src = "question_mark.png";
    this.panels.info.card.img.alt = document.getElementById("info-card-img").alt;
    this.panels.info.card.info = document.getElementById("info-card-info").innerHTML;

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
        document.getElementById("antiviral").innerHTML = `(${lifelines.antiViral})`
        document.getElementById("immuneBoost").innerHTML = `(${lifelines.immuneBooster})`
        document.getElementById("plasma").innerHTML = `(${lifelines.plasmaInjection})`
        // update texts
        document.getElementById("info-text").innerHTML = this.panels.info.text;
        document.getElementById("info-card-title").innerHTML = this.panels.info.card.title;
        document.getElementById("info-card-img").src = "assets/info/" + this.panels.info.card.img.src;
        document.getElementById("info-card-img").alt = this.panels.info.card.img.alt;
        document.getElementById("info-card-info").innerHTML = this.panels.info.card.info;


        document.getElementById("help-text").innerHTML = this.panels.help.text;
    }
}

function GameCanvasBody(){
    this.canvas = document.getElementById("game-canvas");
    this.offscreenCanvas = new OffscreenCanvas(2000,1436.5079365079364);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.offscreenCanvas.getContext("2d",{ willReadFrequently: true });
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
        if(level != 0){
            let levelImage = document.getElementById(`Level${level}-image`);
            this.imgHeight = levelImage.height*(2000/levelImage.width);
            this.context.drawImage(levelImage,0,0,2000,this.imgHeight);
        }
    }

    this.render = function(){
        this.canvas.getContext("2d").drawImage(this.offscreenCanvas,-this.scrollx,-this.scrolly);
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

function Pathogen(spawnx,spawny, img, dmg,health,speed,backlash,size, type = "calm"){
    this.x = spawnx; 
    this.y= spawny;
    this.img = img;
    this.dmg =dmg;
    this.health=health;
    this.speed = speed;
    this.backlash = backlash;
    this.size = size;
    this.sx = 0;
    this.sy = 0;
    this.dir = 0;
    this.dirSpeed = 0;
    this.type = type;
    this.antiBody = (day >= 5 ? true : false);

    let fimg = new Image();
    fimg.src = "assets/pathogens/"+this.img;
    fimg.id = this.img;
    fimg.style.display = "none";
    fimg.class = "hide";
    document.getElementById('rando').appendChild(fimg);

    this.update =  function(){
        if(this.type == "calm"){
            if(this.antiBody){
                this.speed == 1;
            }
            if(this.sx == 0){
                this.sx = Math.floor(Math.random() * this.speed) * (Math.random() < 0.5 ? -1 : 1);
            }
            if(this.sy == 0){
                this.sy = Math.floor(Math.random()*this.speed) * (Math.random() < 0.5 ? -1 : 1);;
            }
            if(this.dirSpeed == 0){
                this.dirSpeed = Math.random();
            }
            let oldx = this.x;
            let oldy = this.y;
            this.x += this.sx;
            this.y += this.sy;
            this.dir += this.dirSpeed;
            if(this.checkCollisions(this.x, this.y)){
                this.x = oldx;
                this.y = oldy;
                this.sx = 0;
                this.sy = 0;
            }

            //Check collisions with acid
            for(let i = 0; i < player.acids.length; i++){
                let acid = player.acids[i];
                let dist = Math.sqrt((this.x - acid.x)**2 + (this.y - acid.y)**2)
                if(dist <= this.size + acid.width){
                    this.health -= acid.damage;
                    player.acids.splice(i, 1);
                }
            }
            
            //check collisions with player
            let dist = Math.sqrt((this.x - player.x)**2 + (this.y - player.y)**2)
            if(dist <= this.size + player.size/2){
                player.health -= this.dmg;
                this.x = oldx;
                this.y = oldy;
                let playerDir = Math.atan2(this.x - player.x, this.y - player.y) - (2*Math.PI)/4
                playerDir %= 2*Math.PI
                this.sx = Math.sin(playerDir) * 10
                this.sy= Math.cos(playerDir) * -10;
                player.speedX += Math.sin(playerDir) * -10;
                player.speedY += Math.cos(playerDir) * 10;
            }
            //check collsions with helpers
            for(let i = 0; i < helpers.length; i++){
                let helper = helpers[i];
                let dist = Math.sqrt((this.x - helper.x)**2 + (this.y - helper.y)**2)
                if(dist <= this.size + helper.size/2){
                    helper.health -= this.dmg;
                    this.x = oldx;
                    this.y = oldy;
                    let helperDir = Math.atan2(this.x - helper.x, this.y - helper.y) - (2*Math.PI)/4
                    helperDir %= 2*Math.PI
                    this.sx = Math.sin(helperDir) * 10
                    this.sy= Math.cos(helperDir) * -10;
                    helper.speedX += Math.sin(helperDir) * -10;
                    helper.speedY += Math.cos(helperDir) * 10;
                }
            }

            if(this.health <= 0){
                enemies.splice(enemies.indexOf(this), 1);
            }

            
        }
    };

    this.draw = function(){
        //check if offscreen
        if(!((this.x - canvas.scrollx < -this.size || 
            this.x - canvas.scrollx > canvas.width + this.size) ||
            (this.y - canvas.scrolly > canvas.height + this.size||
            this.y - canvas.scrolly < -this.size))){
                let image = document.getElementById(this.img);
                
                canvas.context.save();

                // move to pos
                canvas.context.translate(this.x,this.y);

                //rotate image
                canvas.context.rotate(this.dir);

                
                canvas.context.drawImage(image,-this.size/2,-this.size/2,this.size,this.size);

                // restore
                canvas.context.restore();

                if(this.antiBody){
                    let ctx = canvas.context;
                    ctx.strokeStyle = "yellow";
                    ctx.lineWidth = 2;
                    ctx.moveTo(this.x - this.size/2, this.y);
                    ctx.lineTo(this.x + this.size/2, this.y);
                    ctx.moveTo(this.x,this.y + this.size/2);
                    ctx.lineTo(this.x, this.y - this.size/2);
                    ctx.stroke();
                }
        }
    };

    this.checkCollisions = function(x,y){
        //check collisions
        for(let i = 0; i < 2*Math.PI;i+=0.05){
            let pointX = Math.round(x - Math.sin(i)*(this.size/2+1));
            let pointY = Math.round(y+ Math.cos(i)*(this.size/2+1));
            const pointData = canvas.context.getImageData(pointX, pointY , 1, 1);
            
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
}

function acid(x,y,dir, damage = 5, speed = 8) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.damage = damage;
    this.width = 2;
    this.tick = 0;
    this.speed = speed;
    
    this.update = function(){
        this.tick += 1;
        if(this.tick >= 50){
            player.acids.splice(player.acids.indexOf(this), 1);
            return;
        }

        //collisions script

        for(let i = 0; i < 2*Math.PI;i+=0.1){
            let pointX = Math.round(this.x - Math.sin(i)*(this.width+1));
            let pointY = Math.round(this.y+ Math.cos(i)*(this.width+1));
            const pointData = canvas.context.getImageData(pointX, pointY, 1, 1);
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
        context.lineWidth = 1;
        context.fillStyle = 'yellow';
        context.beginPath();
        context.arc(this.x, this.y, this.width, 0, 2 * Math.PI, false);
        context.fillStyle = 'yellow';
        context.fill();
        context.stroke();
    };

}

function player_data(){
    this.x = 100;
    this.y = 1350;
    this.dir = 0;
    this.size = 100;
    this.speedX = 0;
    this.speedY = 0;
    this.speed = 2;
    this.maxSpeed = 2;
    this.acids = [];
    this.reload = 0;
    this.reloadTime = 50;
    this.health = 100;
    this.damage = 5;

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
            console.log(`Mx: ${canvas.mx} my: ${canvas.my}; Truex: ${canvas.mx + canvas.scrollx} my: ${canvas.my + canvas.scrolly}`)
            for(let i = -1; i < 1;i+=0.1){
                this.acids.push(new acid(this.x - Math.sin(this.dir) * this.size/2, this.y + Math.cos(this.dir)*this.size/2,this.dir+i,this.damage));
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

        if(canvas.scrollx<0){
            canvas.scrollx = 0;
        }else if(canvas.scrollx >2000 - canvas.width){
            canvas.scrollx = 2000 - canvas.width;
        }
        if(canvas.scrolly<0){
            canvas.scrolly = 0;
        }else if(canvas.scrolly > canvas.imgHeight - canvas.height){
            canvas.scrolly = canvas.imgHeight - canvas.height;
        }

        //Health
        if(this.health <= 0){
            stopGame("health");
        }
    };

    this.checkCollisions = function(x,y){
        //check collisions
        for(let i = 0; i < 2*Math.PI;i+=0.05){
            let pointX = Math.round(x - Math.sin(i)*(this.size/2+1));
            let pointY = Math.round(y+ Math.cos(i)*(this.size/2+1));
            const pointData = canvas.context.getImageData(pointX, pointY , 1, 1);
            
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
        canvas.context.translate(this.x,this.y);

        //rotate image
        canvas.context.rotate(this.dir);

        
        canvas.context.drawImage(image,-this.size/2,-this.size/2,this.size,this.size);

        // restore
        canvas.context.restore();

        //draw health
        let ctx = canvas.context;
        ctx.strokeStyle = "green";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(this.x - this.size/2, this.y - this.size/2 - 20);
        ctx.lineTo(this.x - this.size/2 + (this.health/100 * this.size), this.y - this.size/2-20);

        ctx.stroke();

        //Draw acids;
        ctx.strokeStyle = "yellow";
        for(let i = 0; i < this.acids.length; i++){
            this.acids[i].draw();
        }
    };
}
function Helper(){
    this.x = 100;
    this.y = 1350;
    this.dir = 0;
    this.size = 100;
    this.speedX = 0;
    this.speedY = 0;
    this.speed = 2;
    this.maxSpeed = 2;
    this.acids = [];
    this.reload = 0;
    this.reloadTime = 50;
    this.health = 100;
    this.damage = 5;

    this.update = function(){
        if(this.reload != 0){
            this.reload +=1;
        }

        //Nearest pathogen
        let f = [];
        for(let i = 0; i < enemies.length; i++){
            let badGuy = enemies[i];
            let dist = Math.sqrt((this.x - badGuy.x)**2 + (this.y - badGuy.y)**2)
            f.push([dist,badGuy.x,badGuy.y,badGuy.size/2]);
        }
        f.sort(function(a,b){return a[0]-b[0]});

        if(f.length > 0){
            let thing = f[0];
            //get dir
            this.dir = Math.atan2(thing[2] - this.y, thing[1] - this.x) - (2*Math.PI)/4
            this.dir %= 2*Math.PI
            //get pos
            if(thing[0] < 50 + this.size/2 + thing[3]){
                //too close
                this.speedX += Math.sin(this.dir)* 5;
                this.speedY += Math.cos(this.dir)* -5;
            }else{
                //too far
                this.speedX += Math.sin(this.dir)* -5;
                this.speedY += Math.cos(this.dir)* 5;
            }
        }
        

        let oldx = this.x;
        let oldy = this.y;

        //Ai


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
        if (this.reload == 0){
            for(let i = -1; i < 1;i+=0.1){
                player.acids.push(new acid(this.x - Math.sin(this.dir) * this.size/2, this.y + Math.cos(this.dir)*this.size/2,this.dir+i,this.damage));
            }
            this.reload = -this.reloadTime;
        }

        //Health
        if(this.health <= 0){
            helpers.splice(helpers.indexOf(this), 1);
        }
    };

    this.checkCollisions = function(x,y){
        //check collisions
        for(let i = 0; i < 2*Math.PI;i+=0.05){
            let pointX = Math.round(x - Math.sin(i)*(this.size/2+1));
            let pointY = Math.round(y+ Math.cos(i)*(this.size/2+1));
            const pointData = canvas.context.getImageData(pointX, pointY , 1, 1);
            
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
        canvas.context.translate(this.x,this.y);

        //rotate image
        canvas.context.rotate(this.dir);

        
        canvas.context.drawImage(image,-this.size/2,-this.size/2,this.size,this.size);

        // restore
        canvas.context.restore();

        //draw health
        let ctx = canvas.context;
        ctx.strokeStyle = "green";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(this.x - this.size/2, this.y - this.size/2 - 20);
        ctx.lineTo(this.x - this.size/2 + (this.health/100 * this.size), this.y - this.size/2-20);
        ctx.stroke();

    };
}
function LIFELINES(){
    this.antiViral = 1;
    this.immuneBooster = 1;
    this.plasmaInjection = 1;

    this.doAntiViral = function(){
        if(this.antiViral > 0){
            this.antiViral -=1;
            
            let amount = enemies.length /2;
            for(let i = 0; i<amount; i++){
                enemies.splice(i, 1);
            }
        }
    };

    this.doImmuneBoost = function(){
        if(this.immuneBooster > 0){
            this.immuneBooster -=1;
            player.damage *=2;
        }
    };

    this.doPlasmaInjection = function(){
        if(this.plasmaInjection > 0){
            this.plasmaInjection -=1;
            helpers.push(new Helper());
        }
    };

}



var outside = new OutsideWorldBody();
var canvas = new GameCanvasBody();
var player = new player_data();
var lifelines = new LIFELINES();
var helpers = [];

function tick(){
    outside.update();
    if(outside.openPanel == -1){
        const d = new Date();
        gameTimer += (d.getTime()- lastTime)/1000;
        lastTime = d.getTime();

        for(let i = 0; i< helpers.length; i++){
            helpers[i].update();
        }
        
        player.update();
        for(let i = 0; i < enemies.length; i++){
            enemies[i].update();
        }

        canvas.clear();
        for(let i = 0; i< helpers.length; i++){
            helpers[i].draw();
        }
        player.draw();
        
        for(let i = 0; i < enemies.length; i++){
            enemies[i].draw();
        }
        //mouse
        let ctx = canvas.context;
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(canvas.mx+canvas.scrollx, canvas.my - 50+canvas.scrolly);
        ctx.lineTo(canvas.mx+canvas.scrollx, canvas.my + 50+canvas.scrolly);
        ctx.moveTo(canvas.mx - 50+canvas.scrollx, canvas.my+canvas.scrolly);
        ctx.lineTo(canvas.mx + 50+canvas.scrollx, canvas.my+canvas.scrolly);
        ctx.stroke();

        canvas.render();
        //Gametimer
        let nctx = canvas.canvas.getContext("2d");;
        nctx.font = "30px Comic Sans MS";
        nctx.fillStyle = "black";
        let text = `Timer: ${Math.round((gameTimer + Number.EPSILON) * 100) / 100}`
        nctx.fillText(text, canvas.width - nctx.measureText(text).width- 5, canvas.height - 10);
        nctx.stroke();
        
        text = `Day: ${day}`
        nctx.fillText(text, canvas.width - nctx.measureText(text).width- 5, canvas.height - 50);
        nctx.stroke();

        if(day > levelData[level]["lastday"] && enemies.length ==0) {
            level += 1;
            player.x = 100;
            player.y = 1150;
            for(let i = 0; i < helpers.length; i++) {
                let helper = helpers[i];
                helper.x = 100;
                helper.y = 1150;
            }
            if(level in levelData){
                let stuff = levelData[level];
                day = 1;
                gameTimer = 0;
                dayTimer = 0
                for(let i = 0; i < stuff[`day1`];i++){
                    enemies.push(new Pathogen(stuff["spawn"]["x"],stuff["spawn"]["y"],stuff["img"],stuff["stats"]["dmg"],stuff["stats"]["health"],stuff["stats"]["speed"],stuff["stats"]["backlash"],stuff["stats"]["size"],stuff["stats"]["type"]));
                }
            }else{
                //YOU WIN!!!!
                document.getElementById("win").style.display = "inline-block";
                document.getElementById("win-text").innerHTML =
                `
                Congrats you have successfully defended the body from all threats!

                Author's Note: 
                Remember how annoying it was to defend the body against pathogens, all while your hosts barely cares, and continues to refuse to vaccinate, follow proper hygene, and be safe. Don't be that guy. You have thousands of cells trying to protect you and keep you healthy, the least you could, and should, do is keep yourself safe by vaccinating on time (don't be an anti-vaxxer) keeping proper hygiene and conducting proper quarantine if you're sick.

                To replay press the reload button on the top right.

                Images are either drawn directly by me or using Adobe Firefly.
                Protect your host's body
                Copyright (C) 2024  Nuaym Syed
            
                This program is free software: you can redistribute it and/or modify
                it under the terms of the GNU General Public License as published by
                the Free Software Foundation, either version 3 of the License, or
                (at your option) any later version.
            
                This program is distributed in the hope that it will be useful,
                but WITHOUT ANY WARRANTY; without even the implied warranty of
                MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
                GNU General Public License for more details.
            
                You should have received a copy of the GNU General Public License
                along with this program.  If not, see <https://www.gnu.org/licenses/>.
                `;
                clearInterval(interval);
            }
        }
        if(gameTimer - dayTimer > 30){
            day += 1;
            dayTimer += 30
            let stuff = levelData[level];
            if(day <= stuff["lastday"]){
                for(let i = 0; i < stuff[`day${day}`];i++){
                    enemies.push(new Pathogen(stuff["spawn"]["x"],stuff["spawn"]["y"],stuff["img"],stuff["stats"]["dmg"],stuff["stats"]["health"],stuff["stats"]["speed"],stuff["stats"]["backlash"],stuff["stats"]["size"],stuff["stats"]["type"]));
                }
            }
            if(day == 5){
                outside.panels.info.card.img.src = levelData[level]["infoImg"];
                outside.panels.info.card.img.alt = levelData[level]["type"];
                outside.panels.info.card.title = levelData[level]["type"];
                outside.panels.info.card.info = levelData[level]["info"];
                for(let i = 0; i < enemies.length; i++) {
                    enemies[i].antiBody = true;
                    enemies[i].sx = 0;
                    enemies[i].sy = 0;
                    enemies[i].health = 1;
                }
                outside.openInfo();
            }
        }

        outside.panels.info.text = `
        <b>YOUR GAME IS PAUSED</b> <br>
        Level: ${level} <br>
        Day: ${day} <br>
        Critical Infection at day: ${levelData[level]["lastday"] + 2} <br>
        Timer: ${Math.round((gameTimer + Number.EPSILON) * 100) / 100} seconds <br>
        Time until next day: ${30 - (Math.round((gameTimer + Number.EPSILON) * 100) / 100 - dayTimer)} seconds <br>
        Amount of confirmed Pathogens: ${enemies.length} <br>
        ${day>=5 ? `Pathogen Confirmed: ${levelData[level]["type"]} (see right) <br> Antibodies deployed!`:`Waiting for Pathogen type to be confirmed...`} <br>
        `

        

        if(day >= levelData[level]["lastday"] + 2){
            stopGame("too long");
        }
    }else{
        const d = new Date();
        lastTime = d.getTime();
    }
}

function stopGame(reason) {
    document.getElementById("loose").style.display = "inline-block";
    document.getElementById("loose-text").innerHTML =
    `
    ${reason == "health" ? "You ran out of health :(" : "The body became too sick and you passed away"} <br>
    Level: ${level} <br>
    Day: ${day} <br>
    Timer: ${Math.round((gameTimer + Number.EPSILON) * 100) / 100} seconds <br>

    To replay press the reload button on the top right.
    

    Images are either drawn directly by me or using Adobe Firefly.
    Protect your host's body
    Copyright (C) 2024  Nuaym Syed

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
    `;
    clearInterval(interval);
}