/**
 * Title state.
 */
function Title() {
	Phaser.State.call(this);
	// NOTE:: put defaults here?
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State.prototype);
Title.prototype = proto;
Title.prototype.constructor = Title;

//----------------------------------------------------
//init
//----------------------------------------------------
Title.prototype.init = function() {
	this.scale.pageAlignHorizontally = true;
	this.scale.pageAlignVertically = true;
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

	this.world.resize(2200, 1800);
	this.world.setBounds(0, 0, 2200, 1800);

};
//----------------------------------------------------
//preload
//----------------------------------------------------
Title.prototype.preload = function() {
	this.load.pack("level", "assets/assets-pack.json");

};
//----------------------------------------------------
//render
//----------------------------------------------------
Title.prototype.render = function(){
};

//----------------------------------------------------
//create
//----------------------------------------------------
Title.prototype.create = function() {
	
	this.scene = new titleScreen(this.game);
	
	//sound
	//---------------------------------------------------
	this.ambiance = this.game.add.audio("ambiance");
	this.ambiance.loop = true;
	this.ambiance.play();
	
	
	//controls
	//----------------------------------------------------
	this.cursors = this.input.keyboard.createCursorKeys();
	this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACE);
	
	//GUI
	//----------------------------------------------------
	//var text = "E";
    //var style = { font: "64px Arial", fill: "white", align: "center" };
	//this.ePrompt = this.add.text(this.scene.fPlayer.body.x, this.scene.fPlayer.body.y, text, style);

};
//----------------------------------------------------
//update
//----------------------------------------------------
Title.prototype.update = function() {

    //cursor handle
	//----------------------------------------------------
    if (this.spaceKey.isDown) {
    	//game.state.add("Level", Level, true); //switch to game!
    }
    
    //overlap handle
    //----------------------------------------------------
	// catch when the player overlaps with a fruit
	//this.physics.arcade.overlap(this.scene.fPlayer, this.scene.fFruits,
	//		this.playerVsFruit, null, this);
	
	//GUI handle
    //----------------------------------------------------
	
};

//----------------------------------------------------
//overlap handle
//----------------------------------------------------
/*
Level.prototype.playerVsFruit = function(player, fruit) {
	fruit.body.enable = false;
	
	this.add.tween(fruit).to({
		y : fruit.y - 50
	}, 1000, "Expo.easeOut", true);
	
	this.add.tween(fruit.scale).to({
		x : 2,
		y : 2
	}, 1000, "Linear", true);

	this.add.tween(fruit).to({
		alpha : 0.2
	}, 1000, "Linear", true).onComplete.add(fruit.kill, fruit);
	
	player.health -= 10;
};
*/

//----------------------------------------------------
//GUI handling
//----------------------------------------------------