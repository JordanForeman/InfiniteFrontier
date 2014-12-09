module.exports = function(){
	return {

		INSTANCE_MAX_PLAYERS: 5,
		instances: [],

		addPlayerToInstance: function(pid) {
			var instanceId = "testInstance";
			if (this.instances.length < 1) {
				this.instances.push({
					id: instanceId,
					players: [pid]
				});
			} else {
				[].forEach.call(this.instances, function(instance){
					// TODO: Check if instance has open slot
				});
				this.instances[0].players.push(pid);
			}
			return instanceId;
		},

	}
};
