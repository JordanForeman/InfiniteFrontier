module.exports = function(httpserver) {

	this.io = require('socket.io')(httpserver);
	this.io.on('connection', newConnectionHandler);

	var instanceManager = require('./InstanceManager')();

	function newConnectionHandler(socket) {
		// Some JavaScript sorcery from: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
		var playerId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);return v.toString(16);}),
			instanceId = instanceManager.addPlayerToInstance(playerId);

		console.log("========== A player connected ========");
		console.log("Player ID: " + playerId);
		console.log("Instance ID: " + instanceId);

		socket.emit('connection-accept', {pid: playerId, iid: instanceId});
		socket.on('keypress', delegateKeyPress);
	};

	function delegateKeyPress(data) {
		var pid = data.pid,
			action = data.action;
	};

};
