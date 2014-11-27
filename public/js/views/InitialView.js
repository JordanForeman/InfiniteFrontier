app.Views.InitialView = function(game) {
	this.game = game;
	this.controller = null;
	this.walls = null;
	this.bulletCache = null;
	this.water = [];
	this.physicsBodies = [];
	this.nextFire = 0;

	this.gameBounds = {
		height: 2048,
		width: 1024
	}
};

app.Views.InitialView.prototype = {

	preload: function() {

		// Game Settings
		this.game.time.advancedTiming = true;
		this.game.debug.renderShadow = false;
		this.game.stage.disableVisibilityChange = true;

		this.loadAssets();

		// In order to have the camera move, we need to increase the size of our world bounds.
        // this.game.world.setBounds(0, 0, this.gameBounds.height, this.gameBounds.width);
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
	},

	create: function() {
		this.controller = app.Controller.init(this.game);
		this.createEnvironment();
		this.createBulletCache();
		this.createPlayer();
	},

	update: function() {
		var game = this.game,
			keypressed = this.controller.checkInputs();

		if (!keypressed)
			this.player.stop();

		if (game.input.activePointer.isDown) {
			this.fireBullets();
		}

		game.physics.arcade.collide(this.player.gameObject, this.walls);
		game.physics.arcade.collide(this.bulletCache, this.walls, this.bulletHitWall);
	},

	render: function() {
		var game = this.game;

		game.debug.text('Infinite Frontier - Alpha Build', 2, game.world.length - 100, "#000000");
		game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
		game.debug.text(Phaser.VERSION, 2, game.world.height - 2, "#ffff00");
	},

	loadAssets: function() {
		// Load assets
		this.game.load.image('player', '/assets/player.png');
		this.game.load.image('wallV', '/assets/wallVertical.png');
		this.game.load.image('wallH', '/assets/wallHorizontal.png');
		this.game.load.image('bullet', '/assets/bullet.png');
	},

	createEnvironment: function() {
		var game = this.game;
		this.walls = game.add.group();
		this.walls.enableBody = true;

		// Create the 10 walls 
		game.add.sprite(0, 0, 'wallV', 0, this.walls); // Left
		game.add.sprite(480, 0, 'wallV', 0, this.walls); // Right

		game.add.sprite(0, 0, 'wallH', 0, this.walls); // Top left
		game.add.sprite(300, 0, 'wallH', 0, this.walls); // Top right
		game.add.sprite(0, 320, 'wallH', 0, this.walls); // Bottom left
		game.add.sprite(300, 320, 'wallH', 0, this.walls); // Bottom right

		game.add.sprite(-100, 160, 'wallH', 0, this.walls); // Middle left
		game.add.sprite(400, 160, 'wallH', 0, this.walls); // Middle right

		var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
		middleTop.scale.setTo(1.5, 1);
		var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
		middleBottom.scale.setTo(1.5, 1);

		this.walls.setAll('body.immovable', true);
		game.stage.backgroundColor = '#3498db';
	},

	createBulletCache: function() {
		this.bulletCache = this.game.add.group();
		this.bulletCache.enableBody = true;
		this.bulletCache.physicsBodyType = Phaser.Physics.ARCADE;

		this.bulletCache.createMultiple(50, 'bullet');
		this.bulletCache.setAll('checkWorldBounds', true);
		this.bulletCache.setAll('outOfBoundsKill', true);
	},

	fireBullets: function() {
		if (this.game.time.now > this.nextFire && this.bulletCache.countDead() > 0) {
			this.nextFire = this.game.time.now + this.player.fireRate;
			var bullet = this.bulletCache.getFirstDead();
			bullet.reset(this.player.gameObject.x, this.player.gameObject.y);
			bullet.rotation = this.game.physics.arcade.angleToPointer(bullet);
			this.game.physics.arcade.moveToPointer(bullet, 300);
		}
	},

	createPlayer: function() {
		this.player = new app.Player(this.game);
		this.game.physics.arcade.enable(this.player.gameObject);
		this.player.gameObject.body.gravity.y = 500;
		this.game.camera.follow(this.player.gameObject);
	},

	bulletHitWall: function(bullet, wall) {
		bullet.kill();
	},

	checkMouse: function() {

	}
};
