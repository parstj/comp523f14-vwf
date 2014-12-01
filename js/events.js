canvas.onmousedown = function(e) {
    if(playerNode) {
        vwf_view.kernel.callMethod(sceneNode, "pointerClick", [playerName]);
    }
};