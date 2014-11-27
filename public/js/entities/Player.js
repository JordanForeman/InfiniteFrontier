app.Player = function(game) {

	this.game = game;
	this.speed = 200;
	this.fireRate = 100;
	this.gameObject = this.game.add.sprite(this.game.world.centerX, 
											this.game.world.centerY, 
											'player');
	this.gameObject.tint = 0x86bfda;
	this.gameObject.anchor.setTo(0.5, 0.5);

	this.addListeners();
};

app.Player.prototype.addListeners = function() {
	app.Events.on('keypress', this.inputHandler.bind(this));
};

app.Player.prototype.stop = function() {
	var currXVelocity = this.gameObject.body.velocity.x;
	if (currXVelocity <= 0) return;

	var newXVelocity = currXVelocity - (this.speed / 10);
	this.gameObject.body.velocity.x = newXVelocity;
};

app.Player.prototype.inputHandler = function(keyCode) {

	if (keyCode == 'up' || keyCode == 'space' && this.gameObject.body.touching.down) {
		this.gameObject.body.velocity.y = -320;
	}

	if (keyCode == 'left') {
		this.gameObject.body.velocity.x = -this.speed;
	} else if (keyCode == 'right') {
		this.gameObject.body.velocity.x = this.speed;
	}
};
