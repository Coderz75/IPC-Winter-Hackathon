"use strict";

var panelOpen = false;

function setup(){
    document.getElementById("game").style.display = "none";
    var panels = document.getElementsByClassName("panel");
    for(var i = 0; i < panels.length; i++) {
        panels[i].style.display = "none";
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

var outside = new OutsideWorldBody();

function tick(){
    outside.update();
}