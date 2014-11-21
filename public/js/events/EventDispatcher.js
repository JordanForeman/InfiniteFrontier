app.Events = {

	events: {},

	on: function(event, callback) {
		var handlers = this.events[event] || [];
		handlers.push(callback);
		this.events[event] = handlers;
	},

	trigger: function(event, data) {
		var handlers = this.events[event];

		if (!handlers || handlers.length < 1)
			return;

		[].forEach.call(handlers, function(handler){
			handler(data);
		});
	}

};
