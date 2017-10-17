/**
 * Level state.
 */
function Level() {
	Phaser.State.call(this);
	// NOTE:: put defaults here?
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State.prototype);
Level.prototype = proto;
Level.prototype.constructor = Level;

//----------------------------------------------------
//init
//----------------------------------------------------
Level.prototype.init = function() {

	this.scale.pageAlignHorizontally = true;
	this.scale.pageAlignVertically = true;
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

	this.world.resize(2200, 1800);
	this.world.setBounds(0, 0, 2200, 1800);

	this.physics.startSystem(Phaser.Physics.ARCADE);
	this.physics.arcade.gravity.y = 700;

};
//----------------------------------------------------
//preload
//----------------------------------------------------
var graphics = null;
Level.prototype.preload = function() {

	this.load.pack("level", "assets/assets-pack.json");
	graphics = this.add.graphics(100, 100);

};
//----------------------------------------------------
//render
//----------------------------------------------------
Level.prototype.render = function(){
	/*
	this.scene.titleScreen.x = this.camera.x;
	this.scene.titleScreen.y = this.camera.y;
	//this.scene.titleScreen.moveToFront();
	*/
};

//----------------------------------------------------
//create
//----------------------------------------------------
var MenuBool = false;
/*Screens
 * 0 -> Title
 * 1 -> Playing
 * 2 -> Lose
 * 3 -> Win
*/
Level.prototype.create = function() {
	
	this.scene = new Scene1(this.game);

	//camera
	//----------------------------------------------------
	this.camera.follow(this.scene.fPlayer, Phaser.Camera.FOLLOW_PLATFORMER);
	this.camera.bounds = null;
	this.scene.fBG.fixedToCamera = true;
	
	
	//titleScreen
	//-----------------
	//this.scene.titleScreen = this.game.add.sprite(this.camera.x, this.camera.y, 'titleScreen');
	//this.scene.titleScreen.wi = this.camera.width;
	//this.scene.titleScreen.height = this.camera.width*3/4;
	
	
	
	//sound
	//---------------------------------------------------
	this.ambiance = this.game.add.audio("ambiance");
	this.ambiance.loop = true;
	this.ambiance.play();
	this.playerOuch = this.game.add.audio("playerOuch");
	this.playerOuch.volume = 0.05;
	this.loseSound = this.game.add.audio("loseSound");
	//giantShroom win
	this.scene.fGiantShroom.setAll("body.immovable", true);
	this.scene.fGiantShroom.setAll("body.allowGravity", false);
	
	//collisionLayer
	//----------------------------------------------------
	this.scene.fCollisionLayer.setAll("body.immovable", true);
	this.scene.fCollisionLayer.setAll("body.allowGravity", false);
	this.scene.fCollisionLayer.setAll("renderable", false); //NOTE::
	
	//climbLayer
	//----------------------------------------------------
	this.scene.fClimbLayer.setAll("body.immovable", true);
	this.scene.fClimbLayer.setAll("body.allowGravity", false);
	this.scene.fClimbLayer.setAll("renderable", false); //NOTE::
	this.scene.fClimbLayer.setAll("body.checkCollision.up", false);
	this.scene.fClimbLayer.setAll("body.checkCollision.down", false);
	
	//pipeEntranceLayer
	//----------------------------------------------------
	this.scene.fPipeEntranceLayer.setAll("body.immovable", true);
	this.scene.fPipeEntranceLayer.setAll("body.allowGravity", false);
	this.scene.fPipeEntranceLayer.setAll("renderable", false); //NOTE::
	
	//breakLayer
	//----------------------------------------------------
	this.scene.fBreakLayer.setAll("body.immovable", true);
	this.scene.fBreakLayer.setAll("body.allowGravity", false);
	this.scene.fBreakLayer.setAll("renderable", true); //NOTE::

	
	//fruits (coins)
	//----------------------------------------------------
	this.scene.fFruits.setAll("body.allowGravity", false);
	this.scene.fFruits.setAll("anchor.x", 0.5);
	this.scene.fFruits.setAll("anchor.y", 0.5);
	
	//shrooms
	//----------------------------------------------------
	//Declare dictionary for making shroom sprites
	this.shroomDict = {
		"fireheavy": 0, "firespike": 1, "fireliquid": 2, "waterheavy": 3, "waterspike": 4, "waterliquid": 5, "grassheavy": 6, "grassspike": 7, "grassliquid": 8, "firesci": 9, "watersci": 10, "grasssci": 11
	};
	this.scene.shrooms = this.add.group();
	this.scene.shrooms.enableBody = true;
	this.scene.shrooms.physicsBodyType = Phaser.Physics.ARCADE;
	this.scene.shrooms.createMultiple(20, 'shrooms', [0]); //cracked default
	this.scene.shrooms.setAll('checkWorldBounds', false);
	this.scene.shrooms.setAll('outOfBoundsKill', true);
	this.scene.shrooms.setAll("body.allowGravity", false);
	this.scene.shrooms.forEach(
	        (function(shroom){
	        	shroom.type = null;
	        	shroom.element = null; 
	        }),
	        this, true
	 );
	
	//player
	//----------------------------------------------------
	this.scene.fPlayer.element = 'fire';
	this.scene.fPlayer.type = 'sci';
	
		//player healthbar
		//----------------------------------------------------
		//this.scene.fPlayer.healthbar = this.add.graphics(this.scene.fPlayer.body.x,this.scene.fPlayer.body.y-20);
		// draw a rectangle
		
		//graphics.lineStyle(2, 0x0000FF, 1);
		//this.scene.fPlayer.healthbar = graphics.drawRect(200, -800, 1000, 1000);
		//this.group.add(this.healthbar); // this.group being a pre-initialised group for this entity...
		this.scene.fPlayer.health = 150;
		//this.scene.fPlayer.totalhp = 100;
		//this.scene.fPlayer._lasthp = 100;
		var text = this.scene.fPlayer.health;
	    var style = { font: "52px Arial", fill: "white", align: "center" };
		this.scene.fPlayer.healthbar = this.add.text(this.scene.fPlayer.body.x, this.scene.fPlayer.body.y+70, text, style);
	
		//player bullets
		//----------------------------------------------------
		this.scene.fPlayer.fireRate = 250;
		this.scene.fPlayer.nextFire = 0;
		this.scene.fPlayer.bullets = this.add.group();
		this.scene.fPlayer.bullets.enableBody = true;
		this.scene.fPlayer.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.scene.fPlayer.bullets.createMultiple(50, 'bullets', [0]); //water default
		this.scene.fPlayer.bullets.setAll('checkWorldBounds', false);
		this.scene.fPlayer.bullets.setAll('outOfBoundsKill', true);
		this.scene.fPlayer.bullets.setAll("body.allowGravity", false);
		this.scene.fPlayer.bulletSpawnOffsetX = -5;
		this.scene.fPlayer.bulletSpawnOffsetY = -80;
		this.scene.fPlayer.bullets.forEach((function(bullet){
        	bullet.element = null;//initialize element
    	}), this, true);
	
	//mobs
	//----------------------------------------------------
	this.scene.fMobLayer.forEach(
	        (function(mob){
	            mob.body.velocity.x = 50;
	            mob.body.bounce.setTo(1, 0);
	            mob.health = 50;
	            mob.element = null;
	            mob.type = null;
		            //mob healthbar
		        	//----------------------------------------------------
		            var text = mob.health;
		    	    var style = { font: "22px Arial", fill: "white", align: "center" };
		    	    mob.healthbar = this.add.text(mob.body.x, mob.body.y-70, text, style);
	            this.assignEleMob(mob);
	            
		            //mob bullets
		        	//----------------------------------------------------
		            mob.fireRate = 1000;
		            mob.nextFire = 0;
		            mob.bullets = this.add.group();
		            mob.bullets.enableBody = true;
		            mob.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		            mob.bullets.createMultiple(50, 'bullets'); //water default texture
		            mob.bullets.setAll('checkWorldBounds', false);
		            mob.bullets.setAll('outOfBoundsKill', true);
		            mob.bullets.setAll("body.allowGravity", false);
		            mob.bulletSpawnOffsetX = 30;
		            mob.bulletSpawnOffsetY = 10;
		            mob.bullets.forEach((function(bullet){
		            	bullet.element = null;//initialize element
		        	}), this, true);
	        }),
	        this, true
	 );
	
	//controls
	//----------------------------------------------------
	this.cursors = this.input.keyboard.createCursorKeys();
	this.eKey = this.input.keyboard.addKey(Phaser.Keyboard.E);
	this.jKey = this.input.keyboard.addKey(Phaser.Keyboard.J);
	this.kKey = this.input.keyboard.addKey(Phaser.Keyboard.K);
	this.wKey = this.input.keyboard.addKey(Phaser.Keyboard.W);
	this.aKey = this.input.keyboard.addKey(Phaser.Keyboard.A);
	this.sKey = this.input.keyboard.addKey(Phaser.Keyboard.S);
	this.dKey = this.input.keyboard.addKey(Phaser.Keyboard.D);
	this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.D);
	
	//GUI
	//----------------------------------------------------
	var text = "E";
    var style = { font: "64px Arial", fill: "white", align: "center" };
	this.ePrompt = this.add.text(this.scene.fPlayer.body.x, this.scene.fPlayer.body.y, text, style);
	this.ePromptBool = false;

};
//----------------------------------------------------
//update
//----------------------------------------------------
Level.prototype.update = function() {
	
	
	//player handle
	//----------------------------------------------------
	// collide the player with the platforms/walls
	this.physics.arcade.collide(this.scene.fPlayer, this.scene.fCollisionLayer);
    
 // a flag to know if the player is (down) touching the platforms
    var touching = this.scene.fPlayer.body.touching.down;

    if (touching && this.wKey.isDown) {
        // jump if the player is on top of a platform and the up key is pressed
        this.scene.fPlayer.body.velocity.y = -500;
    }
    
    if (this.spaceKey.isDown) {
    	MenuBool = true;
    	
    }

    if (touching) {
        if (this.scene.fPlayer.body.velocity.x == 0) {
            // if it is not moving horizontally play the idle
            this.scene.fPlayer.play("idle");
        } else {
            // if it is moving play the walk
            this.scene.fPlayer.play("walk");
        }
    } else {
        // it is not touching the platforms so it means it is jumping.
        this.scene.fPlayer.play("jump");
    }
    
    //player shooting handler
	if (this.input.activePointer.isDown)
    {
        this.fire();
    }
	
	if(this.scene.fPlayer.type != 'liquid'){
		this.physics.arcade.collide(this.scene.fPlayer, this.scene.fPipeEntranceLayer);
	}
	
	if(this.scene.fPlayer.type != 'heavy'){
		this.physics.arcade.collide(this.scene.fPlayer, this.scene.fBreakLayer);
	}
	
	//handle player dying
	if(this.scene.fPlayer.health <= 0){
		this.loseSound.play();
		var gameOver = this.add.sprite(0, 0, 'gameOver');
		gameOver.anchor.x = 0.5; 
		gameOver.anchor.y = 0.5;
		gameOver.x = this.scene.fPlayer.x; 
		gameOver.y = this.scene.fPlayer.y;
		this.paused = true;
	}
	
	//handle healthbar
	this.scene.fPlayer.healthbar.text = this.scene.fPlayer.health;
	this.scene.fPlayer.healthbar.x = this.scene.fPlayer.body.x;
	this.scene.fPlayer.healthbar.y = this.scene.fPlayer.body.y -60;
	//this.updateHealthBar(this.scene.fPlayer.body, this.scene.fPlayer.healthbar, this.scene.fPlayer._lasthp,this.scene.fPlayer.totalhp);
	

    //cursor handle
	//----------------------------------------------------
    if (this.aKey.isDown) {
        // move to the left
        this.scene.fPlayer.body.velocity.x = -200;
        this.scene.fPlayer.scale.x = -1;
    } else if (this.dKey.isDown) {
        // move to the right
        this.scene.fPlayer.body.velocity.x = 200;
    } else {
        // dont move in the horizontal
        this.scene.fPlayer.body.velocity.x = 0;
        this.scene.fPlayer.scale.x = 1;
    }
    
    //mob handle
    //----------------------------------------------------
    //collide mobs with walls 
    this.physics.arcade.collide(this.scene.fMobLayer, this.scene.fCollisionLayer);
    this.scene.fMobLayer.forEach(
	        (function(mob){
	        	//mob dying
	        	if(mob.health <=0){
	        		//leave behind element/type shroom
	        		var shroom = this.scene.shrooms.getFirstDead();
	                shroom.reset(mob.body.x, mob.body.y+20);
	                this.shroomEleType(shroom, mob.element, mob.type);
	                mob.healthbar.visible = false;
	        		mob.kill();
	        		console.log("MOB DEDZ");
	        	}
	        	
	        	//handle healthbar
	        	mob.healthbar.text = mob.health;
	        	mob.healthbar.x = mob.body.x;
	        	mob.healthbar.y = mob.body.y -25;
	        	
	            if(mob.body.velocity.x >0){//right
	            	mob.scale.x = 1;
	            	mob.play("walk");
	            	
	            }
	            else{//left
	            	mob.scale.x = -1;
	            	mob.play("walk");
	            }
	            
	            //fire constantly
	            this.fireMob(mob);
	            
	            //mob bullet collide wall
	            this.physics.arcade.overlap(mob.bullets, this.scene.fCollisionLayer,
	        			this.bulletvsCollideWall, null, this);
	        	
	        	//mob bullet collide player
	        	this.physics.arcade.overlap(mob.bullets, this.scene.fPlayer,
	        			this.mobBulletVsPlayer, null, this);
	        	
	        	//player bullet collide mob
	        	this.physics.arcade.overlap(mob, this.scene.fPlayer.bullets,
	        			this.playerBulletVsMob, null, this);
	        	
	        }),
	        this, true
	 );

    
    //overlap handle
    //----------------------------------------------------
 // catch when the player overlaps with a tree
	this.physics.arcade.overlap(this.scene.fPlayer, this.scene.fGiantShroom,
			this.playerVsWin, null, this);
    
	// catch when the player overlaps with a fruit
	this.physics.arcade.overlap(this.scene.fPlayer, this.scene.fFruits,
			this.playerVsFruit, null, this);
	
	// catch when the player overlaps with a climbing wall
	this.physics.arcade.overlap(this.scene.fPlayer, this.scene.fClimbLayer,
			this.playervsClimb, null, this);
	
	// catch when the player overlaps with a pipe wall
	this.physics.arcade.overlap(this.scene.fPlayer, this.scene.fPipeEntranceLayer,
			this.playervsPipe, null, this);
	
	// catch when the player overlaps with a breaking wall
	this.physics.arcade.overlap(this.scene.fPlayer, this.scene.fBreakLayer,
			this.playervsBreak, null, this);
	
	// catch when the bullet overlaps with a collider wall
	this.physics.arcade.overlap(this.scene.fPlayer.bullets, this.scene.fCollisionLayer,
			this.bulletvsCollideWall, null, this);
	
	// catch when the shroom overlaps with player
	this.scene.shrooms.forEach( 
	        (function(shroom){
	        	this.physics.arcade.overlap(this.scene.fPlayer, shroom,
	        			this.playerVsShroom, null, this);
	        }),
	        this, true
	 );
	
	//GUI handle
    //----------------------------------------------------
	this.updateEPrompt(this.ePrompt, this.scene.fPlayer, this.ePromptBool);	
	this.ePromptBool = false;
	
	
	
};

//----------------------------------------------------
//overlap handle
//----------------------------------------------------
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
	this.playerOuch.play();
	console.log("OUCH");
};

Level.prototype.playervsClimb = function(player, wall) {

	if (this.wKey.isDown) {
		if(player.type == 'spike'){
			this.scene.fPlayer.body.velocity.y = -200;
		}
	}
};

Level.prototype.playervsPipe = function(player, pipe) {
	//sound effect
};

Level.prototype.playervsBreak = function(player, breakWall) {
	if(this.scene.fPlayer.type == 'heavy'){
		breakWall.kill();
	}
};

Level.prototype.bulletvsCollideWall = function(bullet, collisionWall) {
	bullet.kill();
};

Level.prototype.mobvsWall = function(mob, wall) {
	mob.body.velocity.x *= -1.01;
};

Level.prototype.mobBulletVsPlayer = function(player, mobBullet) {
	if(mobBullet.element == 'fire'){
		if(player.element == 'fire'){
			this.playerOuch.play();
			player.health -= 5;
		}
		else if(player.element == 'water'){
			this.playerOuch.play();
			player.health -= 10;
		}
	}
	if(mobBullet.element == 'water'){
		if(player.element == 'water'){
			this.playerOuch.play();
			player.health -= 5;
		}
		else if(player.element == 'grass'){
			this.playerOuch.play();
			player.health -= 10;
		}
	}
	if(mobBullet.element == 'grass'){
		if(player.element == 'grass'){
			this.playerOuch.play();
			player.health -= 5;
		}
		else if(player.element == 'fire'){
			this.playerOuch.play();
			player.health -= 10;
		}
	}
	
	mobBullet.kill();
};

Level.prototype.playerBulletVsMob = function(mob, playerBullet) {
	if(playerBullet.element == 'fire'){
		if(mob.element == 'fire'){
			mob.health -= 5;
		}
		else if(mob.element == 'water'){
			mob.health -= 10;
		}
	}
	if(playerBullet.element == 'water'){
		if(mob.element == 'water'){
			mob.health -= 5;
		}
		else if(mob.element == 'grass'){
			mob.health -= 10;
		}
	}
	if(playerBullet.element == 'grass'){
		if(mob.element == 'grass'){
			mob.health -= 5;
		}
		else if(mob.element == 'fire'){
			mob.health -= 10;
		}
	}
	console.log("MOB HEALTH:"+mob.health);
	playerBullet.kill();
};

Level.prototype.playerVsShroom = function(player, shroom) {
	//set prompt here
	this.ePromptBool = true;
    
	if(this.eKey.isDown){
		//element type handle for player
		this.eleTypeHandlePlayer(player, shroom.element, shroom.type);
		shroom.kill();
		this.ePromptBool = false;
	}
};

Level.prototype.playerVsWin = function(player, shroom) {
	var win = this.add.sprite(0, 0, 'winScreen');
	win.anchor.x = 0.5; 
	win.anchor.y = 0.5;
	win.x = this.scene.fPlayer.x; 
	win.y = this.scene.fPlayer.y-90;
	this.paused = true;
}
//----------------------------------------------------
//fire handling
//----------------------------------------------------
Level.prototype.fire = function(){
	if (this.time.now > this.scene.fPlayer.nextFire && this.scene.fPlayer.bullets.countDead() > 0){
		ele = this.scene.fPlayer.element;
		if(this.scene.fPlayer.element == 'water'){
			this.scene.fPlayer.bullets.forEach(function(item) {
				item.loadTexture('bullets',0);
				item.element = ele;
				});
		}
		if(this.scene.fPlayer.element == 'grass'){
			this.scene.fPlayer.bullets.forEach(function(item) {
				item.loadTexture('bullets',1);
				item.element = ele;
				});
		}
		if(this.scene.fPlayer.element == 'fire'){
			this.scene.fPlayer.bullets.forEach(function(item) {
				item.loadTexture('bullets',2);
				item.element = ele;
			});
		}
		
		this.scene.fPlayer.nextFire = this.time.now + this.scene.fPlayer.fireRate;

        var bullet = this.scene.fPlayer.bullets.getFirstDead();

        bullet.reset(this.scene.fPlayer.x + this.scene.fPlayer.bulletSpawnOffsetX, this.scene.fPlayer.y + this.scene.fPlayer.bulletSpawnOffsetX);

        this.physics.arcade.moveToPointer(bullet, 400);
    }
};

Level.prototype.fireMob = function(mob){
	if (this.time.now > mob.nextFire && mob.bullets.countDead() > 0){
		if(mob.element == 'water'){
			mob.bullets.forEach(function(item) {
				item.loadTexture('bullets',0);
				item.element = mob.element;
			});
		}
		if(mob.element == 'grass'){
			mob.bullets.forEach(function(item) {
				item.loadTexture('bullets',1);
				item.element = mob.element;
				});
		}
		if(mob.element == 'fire'){
			mob.bullets.forEach(function(item) {
				item.loadTexture('bullets',2);
				item.element = mob.element;
				});
		}
		
		mob.nextFire = this.time.now + mob.fireRate;

        var bullet = mob.bullets.getFirstDead();

        bullet.reset(mob.body.x + mob.bulletSpawnOffsetX, mob.body.y + mob.bulletSpawnOffsetX);

        if(mob.body.velocity.x >0){ //if hes moving right, shoot right
        	bullet.body.velocity.x=300;
        }
        else{
        	bullet.body.velocity.x=-300;
        }
        
    }
};

//----------------------------------------------------
//element/type handling
//----------------------------------------------------

Level.prototype.shroomEleType = function(shroom, element, type){
	//switch case to pick shroom based on ele and type 
	shroom.element = element;
	shroom.type = type;
	shroom.frame = this.shroomDict[element+type];
};

Level.prototype.eleTypeHandlePlayer = function(player, element, type){
	player.element = element;
	player.type = type;
	if(element == 'fire'){
		if(type == 'heavy'){
			player.loadTexture('heavyFire');
			player.body.setSize(100, 120, 10.8, 8.4); //heavy
			player.body.updateBounds();
			
		}
		else if(type == 'liquid'){
			player.loadTexture('liquidFire');
			player.body.setSize(119, 52, 9, 76); //liquid
			player.body.updateBounds();
		}
		else if(type == 'spike'){
			player.loadTexture('spikeFire');
			player.body.setSize(93.7, 109.28, 20.16, 18.72); //spike
			player.body.updateBounds();
		}
		else if(type == 'sci'){
			player.loadTexture('sciFire');
			player.body.setSize(37, 64, 6.3, 0); //sci
			player.bulletSpawnOffsetX = -5;
			player.bulletSpawnOffsetY = -80;
			player.body.updateBounds();
		}
	}
	else if(element == 'water'){
		if(type == 'heavy'){
			player.loadTexture('heavyWater');
			player.body.setSize(100, 120, 10.8, 8.4); //heavy
			player.body.updateBounds();
		}
		else if(type == 'liquid'){
			player.loadTexture('liquidWater');
			player.body.setSize(119, 52, 9, 76); //liquid
			player.body.updateBounds();
		}
		else if(type == 'spike'){
			player.loadTexture('spikeWater');
			player.body.setSize(93.7, 109.28, 20.16, 18.72); //spike
			player.body.updateBounds();
		}
		else if(type == 'sci'){
			player.loadTexture('sciWater');
			player.body.setSize(37, 64, 6.3, 0); //sci
			player.bulletSpawnOffsetX = -5;
			player.bulletSpawnOffsetY = -80;
			player.body.updateBounds();
		}
	}
	else if(element == 'grass'){
		if(type == 'heavy'){
			player.loadTexture('heavyGrass');
			player.body.setSize(100, 120, 10.8, 8.4); //heavy
			player.body.updateBounds();
		}
		else if(type == 'liquid'){
			player.loadTexture('liquidGrass');
			player.body.setSize(119, 52, 9, 76); //liquid
			player.body.updateBounds();
		}
		else if(type == 'spike'){
			player.loadTexture('spikeGrass');
			player.body.setSize(93.7, 109.28, 20.16, 18.72); //spike
			player.body.updateBounds();
		}
		else if(type == 'sci'){
			player.loadTexture('sciGrass');
			player.body.setSize(37, 64, 6.3, 0); //sci
			player.bulletSpawnOffsetX = -5;
			player.bulletSpawnOffsetY = -80;
			player.body.updateBounds();
		}
	}
};

Level.prototype.assignEleMob = function(mob){
	if(mob.key == 'sciFire'){
		mob.element = 'fire';
		mob.type = 'sci';
	}
	else if(mob.key == 'sciGrass'){
		mob.element = 'grass';
		mob.type = 'sci';
	}
	else if(mob.key == 'sciWater'){
		mob.element = 'water';
		mob.type = 'sci';
	}
	else if(mob.key == 'liquidFire'){
		mob.element = 'fire';
		mob.type = 'liquid';
	}
	else if(mob.key == 'liquidGrass'){
		mob.element = 'grass';
		mob.type = 'liquid';
	}
	else if(mob.key == 'liquidWater'){
		mob.element = 'water';
		mob.type = 'liquid';
	}
	else if(mob.key == 'spikeGrass'){
		mob.element = 'grass';
		mob.type = 'spike';
	}
	else if(mob.key == 'spikeWater'){
		mob.element = 'water';
		mob.type = 'spike';
	}
	else if(mob.key == 'spikeFire'){
		mob.element = 'fire';
		mob.type = 'spike';
	}
	else if(mob.key == 'heavyFire'){
		mob.element = 'fire';
		mob.type = 'heavy';
	}
	else if(mob.key == 'heavyWater'){
		mob.element = 'water';
		mob.type = 'heavy';
	}
	else if(mob.key == 'heavyGrass'){
		mob.element = 'grass';
		mob.type = 'heavy';
	}
};

//----------------------------------------------------
//GUI handling
//----------------------------------------------------
Level.prototype.updateEPrompt = function(prompt, player, visible){
	prompt.visible = visible;
	if(visible){
		prompt.x = player.body.x;
		prompt.y = player.body.y-120;
	}
};

Level.prototype.updateHealthBar = function(body, healthbar, hp, _lasthp, totalhp){
	if(_lasthp !== hp) {    
		healthbar.clear();
		var x = (hp / totalhp) * 100;
		var colour = utils.rgbToHex((x > 50 ? 1-2*(x-50)/100.0 : 1.0) * 255, (x > 50 ? 1.0 : 2*x/100.0) * 255, 0);
		healthbar.beginFill(colour);
		healthbar.lineStyle(5, colour, 1);
		healthbar.moveTo(body.x,body.y-30);
		healthbar.lineTo(config.tileSize * this.hp / this.totalhp, -5);
		healthbar.endFill();
	}
	this._lasthp = this.hp;
};