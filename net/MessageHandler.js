module.exports = function(httpserver) {

	var io = require('socket.io')(httpserver);
	io.on('connection', newConnectionHandler);

	function newConnectionHandler(socket) {
		console.log("A user connected");
	};

};
