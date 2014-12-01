var userNodeID;
var div;

vwf_view.satProperty = function(nodeId, propertyName, propertyValue){
//	if(nodeId == userNodeID){
		switch(propertyName){
			case "healthMultiplier":
				div = document.getElementById('enemyHealth');
				div.innerHTML = '<p>Enemy Health: ' + propertyValue + '</p>';
				break;
			case "moveSpeed":
				div = document.getElementById('enemyMoveSpeed');
				div.innerHTML = '<p>Enemy Speed: ' + propertyValue + '</p>';
				break; 
			case "enemyCount":
				div = document.getElementById('enemies');
				div.innerHTML = '<p>Enemies: ' + propertyValue + '</p>';
				break; 
			case "enemiesKilled":
				div = document.getElementById('enemiesKilled');
				div.innerHTML = '<p>Enemies Killed: ' + propertyValue + '</p>';
				break; 
		}
//	}
};

vwf_view.initializedNode = function(nodeID, childID, childExtendsID, childImplementsIDs,
            childSource, childType, childIndex, childName, callback) {
    var navObjectName = this.kernel.moniker();
    if ( childName == navObjectName ) {
    	userNodeID = nodeID;
    }
};