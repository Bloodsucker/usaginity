var tools = require('./tools');

module.exports = new Cache();
function Cache () {
	var self = this;

	self.interactions =  [];
	self.onPushFn = [];

	initializeCache(this);
};

/**
 * Saves an Interaction in the cache
 * @param  {Interaction} interaction Personalized Interaction object to store.
 * @param  {[boolean]} forcedSend  As true, it will try to send the interaction inmediatelly.
 */
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

/**
 * Retrieves a maximum number of cached Interactions.
 * @param  {int} max 
 * @return {Interaction[]}
 */
Cache.prototype.unqueue = function (max) {
	var self = this;

	var interactions = self.interactions.splice(0, max);

	tools.setJSONCookie('usaginity_cache', self.interactions);

	return interactions;
};

/**
 * Enqueue at the beginning of the cache Interactions.
 * @param  {Interaction[]} oldInteractions
 */
Cache.prototype.requeue = function (oldInteractions) {
	var self = this;

	Array.prototype.unshift.apply(self.interactions, oldInteractions);

	tools.setJSONCookie('usaginity_cache', self.interactions);
};

/**
 * Listen for new pushed Interaction
 * @param  {Function} fn Callback to be executed when a new Interaction has been pushed.
 */
Cache.prototype.listen = function (fn) {
	this.onPushFn.push(fn);
};

/**
 * Loads to the cache a possible old local cache.
 * @param  {Cache} cache
 */
function initializeCache (cache) {
	var oldCache = tools.getJSONCookie('usaginity_cache');
	if(!oldCache || oldCache.length === 0) return;

	for (var i = 0; i < oldCache.length; i++) {
		cache.interactions.push(oldCache[i]);
	}
};