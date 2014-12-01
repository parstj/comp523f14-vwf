var enemy = {
    extends: "http://vwf.example.com/node3.vwf",
    source: "ball3.dae",
    properties: {
        enabled: false,
        visible: false,
        health: 1.0
    },
    children: {
        material: {
          extends: "http://vwf.example.com/material.vwf",
          properties:{
            color: "#dd5511"
          }
        }
    }
};


//Creates the bullet object
var aBullet = {
    extends: "http://vwf.example.com/node3.vwf",
    source: "ball.dae",
    properties: {
        enabled: false,
        visible: false,
        xPos: -2000,
        yPos: -2000,
        xSpeed: 0,
        ySpeed: 0,
        Speed: 10,
        translation: [0, 0, 0 ],
        scale: 0.5,
    },
    children: {
        material: {
            extends: "http://vwf.example.com/material.vwf",
            properties: {
                color: "#ff0000",
            },
        },
    },
};

this.initialize = function() {
    this.future( 0 ).initializeBullets();
    this.future( 0 ).initializeEnemy();
    this.future( 0 ).createEnemy();
    this.future( 30 ).increaseEnemyMoveSpeed();
    this.future( 120 ).increaseEnemyHealth();
}

this.initializeBullets = function(){
    for(var i = 0; i < 50; i++){
        var newBullet = $.extend(true, {}, aBullet);
        this.bullet.children.create("Bullet"+this.bulletCount, newBullet);
        this.bulletCount++;
    }
}

this.initializeEnemy = function() {
    //Creates a list of unused enemies for use by the program
    for(var i = 0; i < 10; i++ ){
        var newEnemy = $.extend(true, {}, enemy);
        this.enemies.children.create("Enemy"+this.enemyCount, newEnemy);
        this.enemyCount += 1;
    }
}



//Adds an enemy on the screen every 2 seconds if there are not the max number of enemies
this.createEnemy = function(){
    var newEnemy = this.findUnusedEnemy(); //Check to see if we can add a new enemy
    if(newEnemy){
        newEnemy.visible = true;
        newEnemy.enabled = true;
        newEnemy.health = this.healthMultiplier; 

        //Randomize the enemy's starting position between -500 and 500 for x and y
        var xPos = Math.random() * 500;
        var yPos = Math.random() * 500;
        if(Math.random() < 0.5){
            xPos = xPos * -1;
        }
        if(Math.random() < 0.5){
            yPos = yPos * -1;
        }

        newEnemy.translation = [xPos, yPos, 0];

        var closestPlayer = this.calculateClosestPlayer(newEnemy);
        this.calculateEnemyMovement(closestPlayer, newEnemy);
    }

    this.future(2).createEnemy();
}

this.increaseEnemyHealth = function(){
    this.healthMultiplier = this.healthMultiplier + 1;
    console.log("Increasing health of enemies to: " + this.healthMultiplier);
    this.future( 120 ).increaseEnemyHealth();
}

this.increaseEnemyMoveSpeed = function(){
    this.moveSpeed = this.moveSpeed +0.1;
    console.log("Increasing enemy moveSpeed to: " + this.moveSpeed);
    this.future( 30 ).increaseEnemyMoveSpeed();
}

//Returns a list of all of the players currently connected
this.findPlayers = function() {
    return this.find("./element(*,'http://vwf.example.com/navigable.vwf')");
}

//Checks to see if there is an unused enemy that can be initialized
this.findUnusedEnemy = function(){
    var enemies = this.enemies.children;
    for(var i = 0; i < enemies.length; i++){
        if(enemies[i].visible === false){
            return enemies[i];
        }
    }
    return undefined;
}

//Finds the closest player to an enemy
this.calculateClosestPlayer = function(enemy){
    var closestPlayer;
    var currentDistance;
    var shortestDistance = 99999;
    var xDistance, yDistance;
    var listOfPlayers = this.findPlayers();

    if(listOfPlayers){
        for(var i = 0; i < listOfPlayers.length; i++){
            xDistance = enemy.translation[0] - listOfPlayers[i].translation[0];
            yDistance = enemy.translation[1] - listOfPlayers[i].translation[1];

            currentDistance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
            if(currentDistance < shortestDistance){
                shortestDistance = currentDistance;
                closestPlayer = listOfPlayers[i];
            }
        }
        return closestPlayer;
    }
    return undefined;
}

this.calculateEnemyMovement = function(closestPlayer, enemy) {
    if(!closestPlayer){
        closestPlayer = this.calculateClosestPlayer(enemy);
    }
    else if(enemy.visible === true){
        var xDistance = enemy.translation[0] - closestPlayer.translation[0];
        var yDistance = enemy.translation[1] - closestPlayer.translation[1];

        var distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));

        //Checks to see if the enemy needs to move
        if(distance < 10){      
            this.enemyHitsPlayer(closestPlayer, enemy);  
        }
        else if(xDistance !== 0 || yDistance !== 0){
            //Checks what direction it needs to move in
            if(Math.abs(xDistance) > Math.abs(yDistance)){
                if(xDistance < 0){
                    enemy.translateBy([this.moveSpeed, 0, 0]);
                }
                else{
                    enemy.translateBy([-this.moveSpeed, 0 ,0]);
                }
            }
            else{
                if(yDistance < 0){
                    enemy.translateBy([0, this.moveSpeed, 0]);
                }
                else{
                    enemy.translateBy([0, -this.moveSpeed, 0]);
                }
            }   
        }
        this.future( 1/30 ).calculateEnemyMovement(closestPlayer, enemy);
    }
}

this.checkIfHitEnemy = function(bullet){
    var enemies = this.enemies.children;
    for(var i = 0; i < enemies.length; i++){
        if(enemies[i].visible === true){
            if(Math.abs(bullet.translation[0] - enemies[i].translation[0] - 120) < 12 &&
               Math.abs(bullet.translation[1] - enemies[i].translation[1]) < 12){
                console.log("I hit an enemy!");
                enemies[i].health = enemies[i].health - 1;
                console.log("The enemy's health is: " + enemies[i].health);
                if(enemies[i].health < 1){
                    enemies[i].visible = false;
                    enemies[i].enabled = false;
                } 
                return true;
            }    
        }
    }   
}

this.enemyHitsPlayer = function (closestPlayer, enemy){
    closestPlayer.health = closestPlayer.health - 1;
    if(closestPlayer.health <= 0){
        this.playerDied(closestPlayer);
    }
}

this.playerDied = function (closestPlayer){
    closestPlayer.translateTo( [0, 0, 0]);
    closestPlayer.numTimesDead = closestPlayer.numTimesDead + 1;
    closestPlayer.health = 100;
}

this.moveBullet = function( bullet ){
    bullet.translateBy([bullet.xSpeed, bullet.ySpeed, 0]);
    if(bullet.translation[0] > 1000 || bullet.translation[0] < -1000 || bullet.translation[1] > 1000 || bullet.translation[1] < -1000){
        bullet.enabled = false;
        bullet.visible = false;
        bullet.xSpeed = 0;
        bullet.ySpeed = 0;
    }
    if(this.checkIfHitEnemy(bullet) === true){
        bullet.enabled = false;
        bullet.visible = false;
        bullet.xSpeed = 0;
        bullet.ySpeed = 0;   
    }
    if(bullet.enabled){
        this.future( 1/30 ).moveBullet(bullet);
    }
}


this.fire = function( newBull, playerPlace, globalPosition, thePlayer) {
    newBull.translateTo([playerPlace[0] +120,playerPlace[1],0]);
    newBull.visible = true;
    var xDistance = playerPlace[0] + 240 - globalPosition[0];
    var yDistance = playerPlace[1] - globalPosition[1];
    var totalDistance = Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));
    newBull.xSpeed = -newBull.Speed * (xDistance/totalDistance);
    newBull.ySpeed = -newBull.Speed * (yDistance/totalDistance);
    //thePlayer.fireTime = 25;
    this.future( 1/30 ).moveBullet(newBull);
}

this.pointerClick = function( input ) {
    var players = this.findPlayers();
    var playerFired;
    var index;
    for(index = 0; index < players.length; index++){
      if(players[index].id.indexOf(this.client) > 0){
        playerFired = players[index];
      }
    }
    if(playerFired.fireTime > 0){
      return;
    }

    var pi = input;
    var playerPlace = playerFired.translation;
    var listOfBullets = this.bullet.children;
    var coolBullet;
    var test = true;
    var i = 0;
    while(test){
        if(listOfBullets[i].enabled === false){
            coolBullet = listOfBullets[i];
            coolBullet.enabled = true;
            test = false;
        }
        i++;
        
        if(i>listOfBullets.length){
            test = false;
        }
    }
    this.fire(coolBullet, playerPlace, input.globalPosition, playerFired);

}

//@ sourceURL=index-model.js