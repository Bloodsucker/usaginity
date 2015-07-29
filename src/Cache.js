var tools = require('./tools');

module.exports = Cache;
function Cache () {
	var self = this;

	self.interactions =  [];
	self.onPushFn = [];
};

Cache.prototype.push = function (interaction) {
	this.interactions.push(interaction);

	tools.setJSONCookie('usaginity_cache', this.interactions);

	this.onPushFn.forEach(function (fn) {
		fn();
	});
};

Cache.prototype.listen = function (fn) {
	this.onPushFn.push(fn);
};
