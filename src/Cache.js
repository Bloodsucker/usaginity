var tools = require('./tools');

module.exports = new Cache();
function Cache () {
	var self = this;

	self.interactions =  [];
	self.onPushFn = [];

	initializeCache(this);
};

Cache.prototype.push = function (interaction, forcedSend) {
	var self = this;

	self.interactions.push(interaction);

	tools.setJSONCookie('usaginity_cache', self.interactions);

	console.log("New Interaction (" + self.interactions.length + " queued):");
	// console.table([interaction]);

	self.onPushFn.forEach(function (fn) {
		setTimeout(function () {
			fn(forcedSend);
		});
	});
};

Cache.prototype.unqueue = function (max) {
	var self = this;

	var interactions = self.interactions.splice(0, max);

	tools.setJSONCookie('usaginity_cache', self.interactions);

	return interactions;
};

Cache.prototype.requeue = function (oldInteractions) {
	var self = this;

	Array.prototype.unshift.apply(self.interactions, oldInteractions);

	tools.setJSONCookie('usaginity_cache', self.interactions);
};

Cache.prototype.listen = function (fn) {
	this.onPushFn.push(fn);
};

function initializeCache (cache) {
	var oldCache = tools.getJSONCookie('usaginity_cache');
	if(!oldCache || oldCache.length === 0) return;

	for (var i = 0; i < oldCache.length; i++) {
		cache.interactions.push(oldCache[i]);
	}
};