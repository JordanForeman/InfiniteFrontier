app.Controller = {

	cursors: null,
	game: null,

	init: function(game) {
		// Set up our controls.
		this.game = game;
		this.cursors = this.game.input.keyboard.createCursorKeys();

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

		return keypressed;

	},

};
