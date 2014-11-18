/// <reference path="phaser.js" />

// using canvas here just because it runs faster for the body debug stuff
var game = new Phaser.Game(800, 400, Phaser.AUTO, 'test', null, true, false);

var BasicGame = function (game) { };

BasicGame.Boot = function (game) {
	// nothing here
};

var isoGroup, cursor, cursorPos, water = [];

BasicGame.Boot.prototype =
{
	preload: function () {

		// Game Settings
		game.time.advancedTiming = true;
		game.debug.renderShadow = false;
		game.stage.disableVisibilityChange = true;

		// Plugins
		game.plugins.add(new Phaser.Plugin.Isometric(game));

		// Load assets
		game.load.image('cube', 'public/assets/cube.png');
		game.load.atlasJSONHash('tileset', 'public/assets/tileset.png', 'public/assets/tileset.json');

		game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
		game.iso.anchor.setTo(0.5, 0.1);

	},

	createTiles: function() {

		var tileArray = [];
		tileArray[0] = 'water';
		tileArray[1] = 'sand';
		tileArray[2] = 'grass';
		tileArray[3] = 'stone';
		tileArray[4] = 'wood';
		tileArray[5] = 'watersand';
		tileArray[6] = 'grasssand';
		tileArray[7] = 'sandstone';
		tileArray[8] = 'bush1';
		tileArray[9] = 'bush2';
		tileArray[10] = 'mushroom';
		tileArray[11] = 'wall';
		tileArray[12] = 'window';

		var tiles = [
			9, 2, 1, 1, 4, 4, 1, 6, 2, 10, 2,
			2, 6, 1, 0, 4, 4, 0, 0, 2, 2, 2,
			6, 1, 0, 0, 4, 4, 0, 0, 8, 8, 2,
			0, 0, 0, 0, 4, 4, 0, 0, 0, 9, 2,
			0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0,
			11, 11, 12, 11, 3, 3, 11, 12, 11, 11, 11,
			3, 7, 3, 3, 3, 3, 3, 3, 7, 3, 3,
			7, 1, 7, 7, 3, 3, 7, 7, 1, 1, 7
		];

		var size = 32;

		var i = 0, tile;
		for (var y = size; y <= game.physics.isoArcade.bounds.frontY - size; y += size) {
			for (var x = size; x <= game.physics.isoArcade.bounds.frontX - size; x += size) {
				// this bit would've been so much cleaner if I'd ordered the tileArray better, but I can't be bothered fixing it :P
				tile = game.add.isoSprite(x, y, tileArray[tiles[i]].match("water") ? 0 : game.rnd.pick([2, 3, 4]), 'tileset', tileArray[tiles[i]], isoGroup);
				tile.anchor.set(0.5, 1);
				tile.smoothed = false;
				tile.body.moves = false;
				if (tiles[i] === 4) {
					tile.isoZ += 6;
				}
				if (tiles[i] <= 10 && (tiles[i] < 5 || tiles[i] > 6)) {
					tile.scale.x = game.rnd.pick([-1, 1]);
				}
				if (tiles[i] === 0) {
					water.push(tile);
				}
				i++;
			}
		}

	},

	createPlayer: function() {
		// Create another cube as our 'player', and set it up just like the cubes above.
		player = game.add.isoSprite(128, 128, 128, 'cube', 0, isoGroup);
		player.tint = 0x86bfda;
		player.anchor.set(0.5);
		game.physics.isoArcade.enable(player);
		player.body.collideWorldBounds = true;
	},

	initializeControls: function() {
		// Set up our controls.
		this.cursors = game.input.keyboard.createCursorKeys();

		this.game.input.keyboard.addKeyCapture([
			Phaser.Keyboard.LEFT,
			Phaser.Keyboard.RIGHT,
			Phaser.Keyboard.UP,
			Phaser.Keyboard.DOWN,
			Phaser.Keyboard.SPACEBAR
		]);

		var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		space.onDown.add(function () {
			player.body.velocity.z = 300;
		}, this);
	},

	create: function () {
		isoGroup = game.add.group();

		cursorPos = new Phaser.Plugin.Isometric.Point3();

		// we won't really be using IsoArcade physics, but I've enabled it anyway so the debug bodies can be seen
		isoGroup.enableBody = true;
		isoGroup.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;
		game.physics.isoArcade.gravity.setTo(0, 0, -500);

		this.createTiles();
		this.createPlayer();
		this.initializeControls();
	},
	animateWater: function() {
		water.forEach(function (w) {
			w.isoZ = (-2 * Math.sin((game.time.now + (w.isoX * 7)) * 0.004)) + (-1 * Math.sin((game.time.now + (w.isoY * 8)) * 0.005));
			w.alpha = Phaser.Math.clamp(1 + (w.isoZ * 0.1), 0.2, 1);
		});
	},
	checkInputs: function() {
		// Move the player at this speed.
		var speed = 100;

		if (this.cursors.up.isDown) {
			player.body.velocity.y = -speed;
		}
		else if (this.cursors.down.isDown) {
			player.body.velocity.y = speed;
		}
		else {
			player.body.velocity.y = 0;
		}

		if (this.cursors.left.isDown) {
			player.body.velocity.x = -speed;
		}
		else if (this.cursors.right.isDown) {
			player.body.velocity.x = speed;
		}
		else {
			player.body.velocity.x = 0;
		}
	},
	
	checkMouse: function() {
		// Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
		isoGroup.forEach(function (tile) {
			var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
			// If it does, do a little animation and tint change.
			if (!tile.selected && inBounds) {
				tile.selected = true;
				tile.originalIsoZ = tile.isoZ;
				tile.tint = 0x86bfda;
				game.add.tween(tile).to({ isoZ: tile.isoZ + 4 }, 200, Phaser.Easing.Quadratic.InOut, true);
			}
			// If not, revert back to how it was.
			else if (tile.selected && !inBounds) {
				tile.selected = false;
				tile.tint = 0xffffff;
				game.add.tween(tile).to({ isoZ: tile.originalIsoZ }, 200, Phaser.Easing.Quadratic.InOut, true);
			}
		});
	},

	update: function () {
		// Update the cursor position.
		// It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
		// determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
		game.iso.unproject(game.input.activePointer.position, cursorPos);

		this.animateWater();
		this.checkInputs();
		this.checkMouse();

		game.physics.isoArcade.collide(isoGroup);
		game.iso.simpleSort(isoGroup);
	},
	render: function () {
		
		// Bounding Boxes <disabled>
		// isoGroup.forEach(function (tile) {
		//     game.debug.body(tile, 'rgba(189, 221, 235, 0.6)', false);
		// });

		game.debug.text('Infinite Frontier - Alpha Build', 2, game.world.length - 100, "#000000");
		game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
		game.debug.text(Phaser.VERSION, 2, game.world.height - 2, "#ffff00");
	}
};

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');