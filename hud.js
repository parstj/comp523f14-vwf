vwf_view.satProperty = function(nodeId, propertyName, propertyValye){
	if(nodeId == "navobj_" + vwf.moniker()){
		switch(propertyName){
			case "health":
				alert("Your health has changed");
		}
	}
}