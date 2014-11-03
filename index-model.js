this.initialize = function() {
    this.future( 0 ).initializeEnemy();
}

this.initializeEnemy = function(){
    var closestPlayer = this.calculateClosestPlayer();
    this.calculateEnemyMovement(closestPlayer);
}

this.findPlayers = function() {
    return this.find("./element(*,'http://vwf.example.com/navigable.vwf')");
}

this.calculateClosestPlayer = function(){
    var closestPlayer;
    var currentDistance;
    var shortestDistance = 99999;
    var xDistance, yDistance;
    var listOfPlayers = this.findPlayers();

    if(listOfPlayers){
        for(var i = 0; i < listOfPlayers.length; i++){
            xDistance = this.enemy.translation[0] - listOfPlayers[i].translation[0];
            yDistance = this.enemy.translation[1] - listOfPlayers[i].translation[1];

            currentDistance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
            if(currentDistance < shortestDistance){
                shortestDistance = currentDistance;
                closestPlayer = listOfPlayers[i];
            }
        }
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

this.enemyHitsPlayer = function (closestPlayer){
    closestPlayer.health = closestPlayer.health - 1;
    if(closestPlayer.health <= 0){
        this.playerDied(closestPlayer);
    }
    console.log(closestPlayer.health);  
}

this.calculateEnemyMovement = function(closestPlayer) {
    if(!closestPlayer){
        closestPlayer = this.calculateClosestPlayer();
    }
    else{
        var xDistance = this.enemy.translation[0] - closestPlayer.translation[0];
        var yDistance = this.enemy.translation[1] - closestPlayer.translation[1];

        var distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))

        //Checks to see if the enemy needs to move
        if(distance < 10){      
            this.enemyHitsPlayer(closestPlayer);  
        }
        else if(xDistance != 0 || yDistance != 0){
            //Checks what direction it needs to move in
            if(Math.abs(xDistance) > Math.abs(yDistance)){
                if(xDistance < 0){
                    this.enemy.translateBy([this.moveSpeed, 0, 0]);
                }
                else{
                    this.enemy.translateBy([-this.moveSpeed, 0 ,0]);
                }
            }
            else{
                if(yDistance < 0){
                    this.enemy.translateBy([0, this.moveSpeed, 0]);
                }
                else{
                    this.enemy.translateBy([0, -this.moveSpeed, 0]);
                }
            }   
        }
    }

    this.future( 1.0/60.0 ).calculateEnemyMovement(closestPlayer);
}