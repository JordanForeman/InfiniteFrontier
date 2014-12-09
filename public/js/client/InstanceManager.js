app.Client = app.Client || {};
app.Client.InstanceManager = function() {

	this.socket = io();
	console.log(this.socket);

};