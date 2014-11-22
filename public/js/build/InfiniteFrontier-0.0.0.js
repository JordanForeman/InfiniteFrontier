window.app = window.app || {};
app.Events = {};
app.Views = {};

app.Constants = {

	// Sprite Directions
	DIRECTION_FORWARD: "forward",
	DIRECTION_FORWARD_LEFT: "forward-left",
	DIRECTION_LEFT: "left",
	DIRECTION_AWAY_LEFT: "away-left",
	DIRECTION_AWAY: "away",
	DIRECTION_AWAY_RIGHT: "away-right",
	DIRECTION_RIGHT: "right",
	DIRECTION_FORWARD_RIGHT: "forward-right",

	// Tile Constants
	TILE_WIDTH: 32

};

app.Controller = {

	cursors: null,
	cursorPos: null,
	game: null,

	init: function(game) {
		// Set up our controls.
		this.game = game;
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.cursorPos = new Phaser.Plugin.Isometric.Point3();

		this.game.input.keyboard.addKeyCapture([
			Phaser.Keyboard.LEFT,
			Phaser.Keyboard.RIGHT,
			Phaser.Keyboard.UP,
			Phaser.Keyboard.DOWN,
			Phaser.Keyboard.SPACEBAR
		]);

		var space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		space.onDown.add(function(){
			app.Events.trigger('keypress', 'space');
		});

		return this;
	},

	checkInputs: function() {
		var inputData = null,
			keypressed = false;

		if (this.cursors.up.isDown) {
			inputData = 'up';
			keypressed = true;
		} else if (this.cursors.down.isDown) {
			inputData = 'down';
			keypressed = true;
		}

		if (this.cursors.left.isDown) {
			inputData = 'left';
			keypressed = true;
		} else if (this.cursors.right.isDown) {
			inputData = 'right';
			keypressed = true;
		}


		if (keypressed)
			app.Events.trigger('keypress', inputData);
		else
			app.Events.trigger('no-keypress');

	},

};

app.Player = {

	game: null,
	isoGroup: null,
	gameObject: null,
	speed: 200,

	currentDirection: app.Constants.DIRECTION_FORWARD_LEFT,

	init: function(game, isoGroup) {
		// Create another cube as our 'player', and set it up just like the cubes above.
		this.game = game;
		this.isoGroup = isoGroup;
		this.gameObject = this.game.add.isoSprite(128, 128, 128, 'character', this.currentDirection, this.isoGroup);
		this.gameObject.tint = 0x86bfda;
		this.gameObject.anchor.set(0.5);
		game.physics.isoArcade.enable(this.gameObject);
		this.gameObject.body.collideWorldBounds = true;

		this.addListeners();

		return this.gameObject;
	},

	addListeners: function() {
		app.Events.on('keypress', this.inputHandler.bind(this));
		app.Events.on('keypress', this.updateCurrentDirection.bind(this));
		app.Events.on('no-keypress', this.noKeyPressHandler.bind(this));
	},

	noKeyPressHandler: function() {
		this.gameObject.body.velocity.y = 0;
		this.gameObject.body.velocity.x = 0;
	},

	updateCurrentDirection: function(keyCode) {

		var currentDirection = this.currentDirection;

		if (keyCode == 'up')
			this.currentDirection = app.Constants.DIRECTION_AWAY_RIGHT;
		if (keyCode == 'down')
			this.currentDirection = app.Constants.DIRECTION_FORWARD_LEFT;
		if (keyCode == 'left')
			this.currentDirection = app.Constants.DIRECTION_AWAY_LEFT;
		if (keyCode == 'right')
			this.currentDirection = app.Constants.DIRECTION_FORWARD_RIGHT;

		this.gameObject.setFrame(this.currentDirection);

	},

	inputHandler: function(keyCode) {

		if (keyCode == 'space') {
			this.gameObject.body.velocity.z = 300;
		}

		if (keyCode == 'up') {
			this.gameObject.body.velocity.y = -this.speed;
		} else if (keyCode == 'down') {
			this.gameObject.body.velocity.y = this.speed;
		}

		if (keyCode == 'left') {
			this.gameObject.body.velocity.x = -this.speed;
		} else if (keyCode == 'right') {
			this.gameObject.body.velocity.x = this.speed;
		}
	}

};

app.Events = {

	events: {},

	on: function(event, callback) {
		var handlers = this.events[event] || [];
		handlers.push(callback);
		this.events[event] = handlers;
	},

	trigger: function(event, data) {
		var handlers = this.events[event];

		if (!handlers || handlers.length < 1)
			return;

		[].forEach.call(handlers, function(handler){
			handler(data);
		});
	}

};

app.Views.InitialView = function(game) {
	this.game = game;
	this.controller = null;
	this.isoGroup = null;
	this.water = [];

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

		var isoPlugin = new Phaser.Plugin.Isometric(this.game);
		this.game.plugins.add(isoPlugin);

		this.loadAssets();

		// In order to have the camera move, we need to increase the size of our world bounds.
        this.game.world.setBounds(0, 0, this.gameBounds.height, this.gameBounds.width);

		this.game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
		this.game.iso.anchor.setTo(0.5, 0.1);

	},

	create: function() {

		this.controller = app.Controller.init(this.game);
		this.isoGroup = this.game.add.group();

		// we won't really be using IsoArcade physics, but I've enabled it anyway so the debug bodies can be seen
		this.isoGroup.enableBody = true;
		this.isoGroup.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;
		this.game.physics.isoArcade.gravity.setTo(0, 0, -500);

		this.createTiles();

		this.player = app.Player.init(this.game, this.isoGroup);
		this.game.camera.follow(this.player);
	},

	update: function() {
		var isoGroup = this.isoGroup,
			game = this.game;

		// Update the cursor position.
		// It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
		// determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
		game.iso.unproject(game.input.activePointer.position, this.controller.cursorPos);

		// this.animateWater();

		this.controller.checkInputs();

		game.physics.isoArcade.collide(isoGroup);
		game.iso.simpleSort(isoGroup);
	},

	render: function() {
		var game = this.game;

		// Bounding Boxes <disabled>
		// isoGroup.forEach(function (tile) {
		//     game.debug.body(tile, 'rgba(189, 221, 235, 0.6)', false);
		// });

		game.debug.text('Infinite Frontier - Alpha Build', 2, game.world.length - 100, "#000000");
		game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
		game.debug.text(Phaser.VERSION, 2, game.world.height - 2, "#ffff00");
	},

	loadAssets: function() {
		// Load assets
		this.game.load.image('cube', '/assets/cube.png');
		this.game.load.atlasJSONHash('tileset', '/assets/tileset.png', '/assets/tileset.json');
		this.game.load.atlasJSONHash('character', '/assets/character.png', '/assets/character.json');
	},

	generateRandomMap: function(tileArray) {
		var array = [];

		var hVar = this.gameBounds.height / app.Constants.TILE_WIDTH,
			wVar = this.gameBounds.width / app.Constants.TILE_WIDTH;


		for (var h = 0; h < hVar; h++) {
			for (var w = 0; w < wVar; w++) {
				var tileType = Math.floor(Math.random()*(tileArray.length));
				array.push(tileType);
			}
		}

		return array;
	},

	createTiles: function() {

		var tileArray = ['grass', 'bush1', 'bush2', 'mushroom'];
		// tileArray[0] = 'water';
		// tileArray[1] = 'sand';
		// tileArray[2] = 'grass';
		// tileArray[3] = 'stone';
		// tileArray[4] = 'wood';
		// tileArray[5] = 'watersand';
		// tileArray[6] = 'grasssand';
		// tileArray[7] = 'sandstone';
		// tileArray[8] = 'bush1';
		// tileArray[9] = 'bush2';
		// tileArray[10] = 'mushroom';
		// tileArray[11] = 'wall';
		// tileArray[12] = 'window';
		// tileArray[13] = 'wireframe';

		var tiles = this.generateRandomMap(tileArray),
			size = app.Constants.TILE_WIDTH,
			i = 0, 
			tile,
			y_bounds = this.game.physics.isoArcade.bounds.frontY - size,
			x_bounds = this.game.physics.isoArcade.bounds.frontX - size;

		for (var y = size; y <= y_bounds; y += size) {
			for (var x = size; x <= x_bounds; x += size) {

				// this bit would've been so much cleaner if I'd ordered the tileArray better, but I can't be bothered fixing it :P
				tile = this.game.add.isoSprite(x, y, 0, 'tileset', tileArray[tiles[i]], this.isoGroup);
				tile.anchor.set(0.5, 1);
				tile.smoothed = false;
				tile.body.moves = false;
				
				// FIXME: Bridge is 6 units above level
				// if (tiles[i] === 4)
				// 	tile.isoZ += 6;

				// FIXME: Scale stuff?
				// if (tiles[i] <= 10 && (tiles[i] < 5 || tiles[i] > 6))
				// 	tile.scale.x = this.game.rnd.pick([-1, 1]);

				// TODO: uncomment this once map is finished
				// Add water tile to list of tiles to update for water
				// if (tiles[i] === 0)
				// 	this.water.push(tile);

				i++;
			}
		}

	},

	animateWater: function() {
		this.water.forEach(function (w) {
			w.isoZ = (-2 * Math.sin((this.game.time.now + (w.isoX * 7)) * 0.004)) + (-1 * Math.sin((this.game.time.now + (w.isoY * 8)) * 0.005));
			w.alpha = Phaser.Math.clamp(1 + (w.isoZ * 0.1), 0.2, 1);
		}.bind(this));
	},

	checkMouse: function() {
		var cursorPos = this.controller.cursorPos;

		// Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
		this.isoGroup.forEach(function (tile) {
			var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
			// If it does, do a little animation and tint change.
			if (!tile.selected && inBounds) {
				tile.selected = true;
				tile.originalIsoZ = tile.isoZ;
				tile.tint = 0x86bfda;
				this.game.add.tween(tile).to({ isoZ: tile.isoZ + 4 }, 200, Phaser.Easing.Quadratic.InOut, true);
			}
			// If not, revert back to how it was.
			else if (tile.selected && !inBounds) {
				tile.selected = false;
				tile.tint = 0xffffff;
				this.game.add.tween(tile).to({ isoZ: tile.originalIsoZ }, 200, Phaser.Easing.Quadratic.InOut, true);
			}
		});
	}
};

app.Game = {

	game: null,

	init: function() {

		this.game = new Phaser.Game(window.screen.availWidth, window.screen.availHeight, Phaser.AUTO, 'test', null, true, false);
		
		this.addGameStates();

		this.startGame();
	},

	addGameStates: function() {
		var initialView = new app.Views.InitialView(this.game);
		this.game.state.add('start', initialView);
	},

	startGame: function() {
		this.game.state.start('start');
	}

};

app.Game.init();
