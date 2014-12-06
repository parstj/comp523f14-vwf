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
		// case "healthMultiplier":
		// 	div = document.getElementById('enemyHealth');
		// 	div.innerHTML = '<p>Enemy Health: ' + propertyValue + '</p>';
		// 	break;
		// case "moveSpeed":
		// 	div = document.getElementById('enemyMoveSpeed');
		// 	div.innerHTML = '<p>Enemy Speed: ' + propertyValue + '</p>';
		// 	break; 
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
	}
};

vwf_view.deletedNode = function ( nodeID ) { 
    if ( nodeID.slice(0, 33) == "http-vwf-example-com-clients-vwf:" ) {
        // There is currently no way to match the deleted client to its associated navigation object
        // so loop over all the navobjects and set the one without a client to disconnected
        var players = vwf_view.kernel.find(vwf_view.kernel.find("","/")[0], "./element(*,'http://vwf.example.com/navigable.vwf')");
        var clients = vwf_view.kernel.findClients("", "/*");

        for(var i = 0; i < players.length; i++) {
            var clientFound = false;
            for (var j = 0; j < clients.length; j++) {
                if(vwf_view.kernel.name(players[i]).indexOf(vwf_view.kernel.name(clients[j])) >= 0) {
                    clientFound = true;
                    break;
                }
            }
            if(!clientFound) {
                vwf_view.kernel.callMethod( sceneNode, "playerDisconnected", players[i]);
            }
        }
    }
};