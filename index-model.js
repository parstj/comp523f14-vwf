//Countdown until game starts
var countDown = 10;

//Template for enemies
var enemy = {
    extends: "http://vwf.example.com/node3.vwf",
    source: "models/Sloth.dae",
    properties: {
        enabled: false,
        visible: false,
		scale: .2,
        health: 1.0
    },
    children: {
        material: {
          extends: "http://vwf.example.com/material.vwf",
          properties:{
		  transparent: true
          }
        }
    }
};

//Template for powerups
var aPowerUp = {
    extends: "http://vwf.example.com/node3.vwf",
    source: "models/SpecialAmmo.dae",
    properties: {
      translation: [2,4,0],
      visible: false,
	  scale: .3
    },
    children: {
      material: {
      },
    },
};

//Template for bullets
var aBullet = {
    extends: "http://vwf.example.com/node3.vwf",
    source: "models/Orange.dae",
    properties: {
        enabled: false,
        visible: false,
        xPos: -2000,
        yPos: -2000,
        xSpeed: 0,
        ySpeed: 0,
        Speed: 10,
        scale: .1
    },
    children: {
        material: {
            extends: "http://vwf.example.com/material.vwf",
            properties: {
			  transparent: true
            },
        },
    },
};

this.initialize = function() 
{
	//Delay is added to ensure player initialization doesn't interrupt proper enemy initialization
    this.future(0).count_to_zero();
	this.future(30).initializeBullets();
	this.future(30).initializeEnemy();
	this.future(30).createEnemy();
	this.future(30).initializePowerUp();
	this.future(30).createPowerUp();
}

//creates 50 bullets of the aBullet template
this.initializeBullets = function(){
    for(var i = 0; i < 50; i++){
        var newBullet = $.extend(true, {}, aBullet);
        this.bullet.children.create("Bullet"+this.bulletCount, newBullet);
        this.bulletCount++;
    }
}

//Creates 10 enemies of the enemy template
this.initializeEnemy = function() {
    for(var i = 0; i < 10; i++ ){
        var newEnemy = $.extend(true, {}, enemy);
        this.enemies.children.create("Enemy"+i, newEnemy);
    }
}

this.count_to_zero = function() 
{
	if(this.countDown>0) {
		this.countDown--;
		this.future(1).count_to_zero();
	}
}

//creates the powerup
this.initializePowerUp = function(){
    var newPowerUp = $.extend(true, {}, aPowerUp);
    this.powerUps.children.create("powerUp", newPowerUp);
}

//Adds an enemy on the screen every 2 seconds if there are not the max number of enemies
this.createEnemy = function(){
    if(this.totalEnemies >= this.enemyCount){
        //Do nothing
    }
    else{
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

            this.totalEnemies++;
        }
    }

    this.future(2).createEnemy();
}

//adds a powerup to the field, if none exists, every 5 seconds
this.createPowerUp = function(){
    if(this.powerUps.powerUp.visible === false){
      //Randomize the powerup's starting position between -500 and 500 for x and y
      var xPos = Math.random() * 500;
      var yPos = Math.random() * 500;
      if(Math.random() < 0.5){
          xPos = xPos * -1;
      }
      if(Math.random() < 0.5){
          yPos = yPos * -1;
      }
      this.powerUps.powerUp.translation = [xPos, yPos, 0];
      this.powerUps.powerUp.visible = true;
    }
    this.future(5).createPowerUp();
}

//Increases enemy health over time
this.increaseEnemyHealth = function(){
    this.healthMultiplier = this.healthMultiplier + 0.5;
}

//Increases enemy speed over time
this.increaseEnemyMoveSpeed = function(){
    this.moveSpeed = this.moveSpeed + 0.2;
}

this.incrementWave = function(){
    this.increaseEnemyMoveSpeed();
    this.increaseEnemyHealth();
    this.enemyCount = 20;
    this.waveCounter++;
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
    //Loop through the list of players; if a player is closer than previously calculated players, they become the closest player
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

//Handles enemy movement AI
this.calculateEnemyMovement = function(closestPlayer, enemy) {
    if(!closestPlayer){
        closestPlayer = this.calculateClosestPlayer(enemy);
    }
    else if(enemy.visible === true){
        var xDistance = enemy.translation[0] - closestPlayer.translation[0];
        var yDistance = enemy.translation[1] - closestPlayer.translation[1];
        var distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));

        //Checks to see if the enemy is close enough to hit the player
        if(distance < 10){
            this.enemyHitsPlayer(closestPlayer, enemy);
        }
        else if(xDistance !== 0 || yDistance !== 0){
            //Checks what direction it needs to move in
            if(Math.abs(xDistance) > Math.abs(yDistance)){
                if(xDistance < 0){
                    enemy.translateBy([this.moveSpeed, 0, 0]); //Moves in the positive x direction
                }
                else{
                    enemy.translateBy([-this.moveSpeed, 0 ,0]); //Moves in the negative x direction
                }
            }
            else{
                if(yDistance < 0){
                    enemy.translateBy([0, this.moveSpeed, 0]); //Move in the positive y direction
                }
                else{
                    enemy.translateBy([0, -this.moveSpeed, 0]); //Move in the negative y direction
                }
            }
        }
        this.future( 1/30 ).calculateEnemyMovement(closestPlayer, enemy);
    }
}

//Checks hit detection between bullet and each enemy
this.checkIfHitEnemy = function(bullet){
    var enemies = this.enemies.children;
    for(var i = 0; i < enemies.length; i++){
        if(enemies[i].visible === true){
            if(Math.abs(bullet.translation[0] - enemies[i].translation[0]) < 12 &&
               Math.abs(bullet.translation[1] - enemies[i].translation[1]) < 12){
                //Subtract the enemy's health
                enemies[i].health = enemies[i].health - this.bulletMode;
                //Detect if the enemy has died
                if(enemies[i].health < 1){
                    enemies[i].visible = false;
                    enemies[i].enabled = false;
                    this.enemyCount--;
                    this.totalEnemies--;
                    //If there are no more enemies left, increment the wave
                    if(this.enemyCount === 0){
                        this.incrementWave();
                    }
                    this.enemiesKilled++;
                } 
                return true;
            }
        }
    }
}

//checks hit detection between enemy and a player
this.enemyHitsPlayer = function (closestPlayer, enemy){
    closestPlayer.playerHealth = closestPlayer.playerHealth - 1;
    if(closestPlayer.playerHealth <= 0){
        this.playerDied(closestPlayer);
    }
}

//resets a player when they reach 0 health
this.playerDied = function (closestPlayer){
    closestPlayer.translateTo( [0, 0, 0]);
    closestPlayer.numTimesDead = closestPlayer.numTimesDead + 1;
    closestPlayer.playerHealth = 100;
    this.livesRemaining--;
}

//move a bullet; if it connects with an enemy or powerup, handle that collision
//if the bullet reaches the edges of the playspace, it deactivates
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
    if(this.checkIfHitPowerUp(bullet) === true){
        this.bulletMode = this.bulletMode + 1;
        this.shotsUntilDowngrade = this.shotsUntilDowngrade + 10;
        this.powerUps.powerUp.visible = false;
    }
    if(bullet.enabled){
        this.future( 1/30 ).moveBullet(bullet);
    }
}

//takes a bullet, moves it to a player's position, and sends it in the direction of the mouseclick's global position
this.fire = function(newBull, playerPlace, globalPosition, thePlayer) {
    newBull.translateTo([playerPlace[0],playerPlace[1],0]);

	
	if(this.bulletMode>1)
	{
		newBull.material.texture = "models/textures/coconut.png";
		newBull.properties.scale = .2;
	}
	else
	{
		newBull.material.texture = "models/textures/orange.png";
		newBull.properties.scale = .1;
	}
	
    newBull.visible = true;
    var xDistance = playerPlace[0] - globalPosition[0];
    var yDistance = playerPlace[1] - globalPosition[1];
    var totalDistance = Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));
    newBull.xSpeed = -newBull.Speed * (xDistance/totalDistance);
    newBull.ySpeed = -newBull.Speed * (yDistance/totalDistance);
    //thePlayer.fireTime = 25; //line to reset timer on firing
    this.future( 1/30 ).moveBullet(newBull);
}

//event handler for left mouse click -- fires a bullet from the player
this.pointerClick = function( input ) {
    var players = this.findPlayers();
    var playerFired;
    var index;
    for(index = 0; index < players.length; index++){
      if(players[index].id.indexOf(this.client) > 0){ //is this the player that fired?
        playerFired = players[index];
      }
    }
    if(playerFired.fireTime > 0){ //if the player has fired too recently, they can't fire right now (UNIMPLEMENTED)
      return;
    }
    var pi = input;
    var playerPlace = playerFired.translation;
    var listOfBullets = this.bullet.children;
    var coolBullet;
    var test = true;
    var i = 0;
    while(test){
        if(listOfBullets[i].enabled === false){ //find an unused bullet
            coolBullet = listOfBullets[i];
            coolBullet.enabled = true;
            test = false;
        }
        i++;

        if(i>listOfBullets.length){
              test = false;
        }
    }
    this.future(j * 2/30).fire(coolBullet, playerPlace, input.globalPosition, playerFired);
    //this.future(j * 2/30) delays each bullet after the 0th to space out each shot
    //.fire( ... ) fires the bullet just generated

    if(this.shotsUntilDowngrade > 1){
      this.shotsUntilDowngrade--;
    }
    else if(this.shotsUntilDowngrade == 1){
      this.shotsUntilDowngrade--;
      this.bulletMode--;
      if(this.bulletMode > 1){
        this.shotsUntilDowngrade = 1;
      }
    }
}

//keeps track of the closest player to powerup
//if close enough, player picks up powerup
this.checkIfHitPowerUp = function(bullet) {
    var powerUp = this.powerUps.children;
    for(var i = 0; i < powerUp.length; i++){
        if(powerUp[i].visible === true){
            if(Math.abs(bullet.translation[0] - powerUp[i].translation[0]) < 12 &&
               Math.abs(bullet.translation[1] - powerUp[i].translation[1]) < 12){
                console.log("I hit a powerup!");
                return true;
            }
        }
    }
}