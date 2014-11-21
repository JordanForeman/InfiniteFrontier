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
