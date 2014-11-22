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
