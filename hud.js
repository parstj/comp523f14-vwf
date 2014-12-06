var sceneNode = vwf.find("","/")[0];


vwf_view.satProperty = function(nodeId, propertyName, propertyValue){
	switch(propertyName){
		case "playerCount":
			alert('player count changed to: '+propertyValue);
			break;
		case "countDown":
			div = document.getElementById('overlay');
			if(propertyValue>0){
				div.innerHTML = '<h1>Game starts in: ' + propertyValue + ' </h1> <h2> Wave: 0 </h2>';
			}
			else if(propertyValue==0) {
				div.innerHTML = '<h1> RELEASE THE SLOTHS! </h1> <h2> Wave: 1 </h2>';
			}
			break;
		case "waveCounter":
			div = document.getElementById('overlay');
			div.innerHTML = '<h1> RELEASE THE SLOTHS! </h1> <h2> Wave: '+propertyValue+' </h2>';
			break;
		case "enemyCount":
			div = document.getElementById('enemies');
			div.innerHTML = '<p>Enemies left: ' + propertyValue + '</p>';
			break;			 
		case "enemiesKilled":
			div = document.getElementById('enemiesKilled');
			div.innerHTML = '<p> <img src=\"UI_Elements/SlothIcon.png\" height=\"40px\">  ' + propertyValue + '</p>';
			break; 
		case "shotsUntilDowngrade":
			div = document.getElementById('numberBulletsLeft');
			div.innerHTML = '<p> <img src=\"UI_Elements/Bullets.png\" height=\"40px\"> ' + propertyValue + ' </p>';
			break;
		case "livesRemaining":
			div = document.getElementById('livesRemaining');
			div.innerHTML = '<p>Lives remaining: ' + propertyValue + '</p>';
			if(propertyValue === 0){
				div = document.getElementById('overlay');
				div.innerHTML = '<h1> Game Over! </h1> ';
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
						div.innerHTML = div.innerHTML = '<p> <img src=\"UI_Elements/Health.png\" height=\"40px\"> ' + propertyValue + '</p>';
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