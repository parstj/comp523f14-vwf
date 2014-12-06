var sceneNode = vwf.find("","/")[0];


vwf_view.satProperty = function(nodeId, propertyName, propertyValue){
	switch(propertyName){
		case "waveCounter":
			div = document.getElementById('waveNumber');
			div.innerHTML = '<p>Wave: ' + propertyValue + '</p>';
			break;
		case "enemyCount":
			div = document.getElementById('enemies');
			div.innerHTML = '<p>Enemies left: ' + propertyValue + '</p>';
			break;			 
		case "enemiesKilled":
			div = document.getElementById('enemiesKilled');
			div.innerHTML = '<p>Enemies Killed: ' + propertyValue + '</p>';
			break; 
		case "shotsUntilDowngrade":
			div = document.getElementById('numberBulletsLeft');
			div.innerHTML = '<p>Super bullets left: ' + propertyValue + '</p>';
			break;
		case "bulletMode":
		 	div = document.getElementById('bulletMultiplier');
			div.innerHTML = '<p>Damage multiplier: x' + propertyValue + '</p>';
			break;
		case "livesRemaining":
			div = document.getElementById('livesRemaining');
			div.innerHTML = '<p>Lives remaining: ' + propertyValue + '</p>';
			if(propertyValue === 0){
				alert("Game over!");
			}
			break;
		case "playerHealth":
			var clients = vwf_view.kernel.findClients("", "/*");
			var players = vwf_view.kernel.find(vwf_view.kernel.find("","/")[0], "./element(*,'http://vwf.example.com/navigable.vwf')");

			for(var i = 0; i < players.length; i++) {
				var found = false;
	            for (var j = 0; j < clients.length; j++) {
	                if(vwf_view.kernel.name(players[i]).indexOf(vwf_view.kernel.name(clients[j])) >= 0) {
	                    div = document.getElementById('health');
						div.innerHTML = '<p>Health: ' + propertyValue + '</p>';
						found = true;
						break;
	                }
	            if(found === true){
	            	break;
	            }
            }
            break;
        }
	}
};