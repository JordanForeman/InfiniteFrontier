app.Client = app.Client || {};
app.Client.InstanceManager = function() {

	this.socket = io();

	var playerId, instanceId;

	this.socket.on('connection-accept', function(data){
		playerId = data.pid;
		instanceId = data.iid;
		console.log("Player ID: " + playerId);
		console.log("Instance ID: " + instanceId);
	});

	app.Events.on('keypress', function(action){
		var data = {action: action, pid: playerId};
		this.socket.emit('keypress', data);
	}.bind(this));

};