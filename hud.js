var userNodeID;

vwf_view.satProperty = function(nodeId, propertyName, propertyValue){
	if(nodeId == userNodeID){
		switch(propertyName){
			case "health":
				alert(propertyValue);
		}
	}
};

vwf_view.initializedNode = function(nodeID, childID, childExtendsID, childImplementsIDs,
            childSource, childType, childIndex, childName, callback) {
    var navObjectName = this.kernel.moniker();
    if ( childName == navObjectName ) {
    	userNodeID = nodeID;
    }
};