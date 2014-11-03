var enemy = {
  extends: "http://vwf.example.com/node3.vwf",
  source: "ball.dae",
  properties: {
    enabled: true,
    visible: false
  },
  children: {
    material: {
      extends: "http://vwf.example.com/material.vwf",
      properties: {
        color: "#ff0000"
      }
    }
  }
};

this.initialize = function() {
    console.log("Initialized");
    for(var i = 0; i < 10; i++ ){
        console.log("Creating enemy");
        var newEnemy = $.extend(true, {}, enemy);
        this.enemies.children.create("Enemy"+this.enemyCount, newEnemy);
        this.enemyCount += 1;
    }
    this.future( 0 ).initializeEnemy();
}

this.findUnusedEnemy = function(){
    var enemies = this.enemies.children;
    console.log(enemies.length);
    for(var i = 0; i < enemies.length; i++){
        console.log("Checking if enemy is visible");
        if(enemies[i].visible == false){
            return enemies[i];
        }
    }
    return undefined;
}

this.initializeEnemy = function(){
    console.log("initializing enemy");
    var newEnemy = this.findUnusedEnemy();
    if(newEnemy){
        console.log("Found an enemy");
        newEnemy.visible = true;
        newEnemy.translation = [200, 0, 0];

        console.log("Getting ready to calculate closestPlayer");
        var closestPlayer = this.calculateClosestPlayer(newEnemy);
        this.calculateEnemyMovement(closestPlayer, newEnemy);
    }
    else{
        console.log("Could not find an enemy to use");
    }

    this.future(2).initializeEnemy();
}

this.findPlayers = function() {
    return this.find("./element(*,'http://vwf.example.com/navigable.vwf')");
}

this.calculateClosestPlayer = function(enemy){
    console.log("Calculating closest player.");
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
        console.log("Found closest player");
        return closestPlayer;
    }
    return undefined;
}

this.playerDied = function (closestPlayer){
    closestPlayer.translateTo( [0, 0, 0]);
    closestPlayer.numTimesDead = closestPlayer.numTimesDead + 1;
    closestPlayer.health = 100;
    console.log("A player has been killed");
}

this.enemyHitsPlayer = function (closestPlayer, enemy){
    closestPlayer.health = closestPlayer.health - 1;
    if(closestPlayer.health <= 0){
        this.playerDied(closestPlayer);
    }
    console.log(closestPlayer.health);  
}

this.calculateEnemyMovement = function(closestPlayer, enemy) {
    if(!closestPlayer){
        closestPlayer = this.calculateClosestPlayer(enemy);
    }
    else{
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
    }

    this.future( 1.0/60.0 ).calculateEnemyMovement(closestPlayer, enemy);
}