window.onload = function() {
	
	var w = window.innerWidth;
	var h = window.innerHeight;
	var f = h / w;
	
	if (w > h) {
		w = 1300;
		h = w * f;
	} else {
		h = 800;
		w = 800 / f;
	}
	
	var game = new Phaser.Game(w, h, Phaser.AUTO);
	game.state.add("Level", Level, true);
	//game.state.add("Title", Title, true);
	//this.game.state.start("Title");
};
