app.Views.InitialView = function(game) {
	this.game = game;
	this.controller = null;
	this.isoGroup = null;
	this.water = [];
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
	},

	update: function() {
		var isoGroup = this.isoGroup,
			game = this.game;

		// Update the cursor position.
		// It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
		// determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
		game.iso.unproject(game.input.activePointer.position, this.controller.cursorPos);

		this.animateWater();

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
		this.game.load.atlasJSONHash('xaldin', '/assets/xaldin.png', '/assets/xaldin.json');
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
		tileArray[13] = 'wireframe';

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

		var xtiles = [
			13,13,13,13,13,13,13,13,13,13,13,
			13,13,13,13,13,13,13,13,13,13,13,
			13,13,13,13,13,13,13,13,13,13,13,
			13,13,13,13,13,13,13,13,13,13,13,
			13,13,13,13,13,13,13,13,13,13,13,
			13,13,13,13,13,13,13,13,13,13,13,
			13,13,13,13,13,13,13,13,13,13,13,
			13,13,13,13,13,13,13,13,13,13,13,
			13,13,13,13,13,13,13,13,13,13,13,
			13,13,13,13,13,13,13,13,13,13,13,
			13,13,13,13,13,13,13,13,13,13,13
		];

		var size = 32;

		var i = 0, tile;
		for (var y = size; y <= this.game.physics.isoArcade.bounds.frontY - size; y += size) {
			for (var x = size; x <= this.game.physics.isoArcade.bounds.frontX - size; x += size) {
				// this bit would've been so much cleaner if I'd ordered the tileArray better, but I can't be bothered fixing it :P
				tile = this.game.add.isoSprite(
										x, y, 
										tileArray[tiles[i]].match("water") ? 0 : this.game.rnd.pick([2, 3, 4]), 
										'tileset', tileArray[tiles[i]], this.isoGroup);
				
				tile.anchor.set(0.5, 1);
				tile.smoothed = false;
				tile.body.moves = false;
				if (tiles[i] === 4) {
					tile.isoZ += 6;
				}
				if (tiles[i] <= 10 && (tiles[i] < 5 || tiles[i] > 6)) {
					tile.scale.x = this.game.rnd.pick([-1, 1]);
				}
				if (tiles[i] === 0) {
					this.water.push(tile);
				}
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
