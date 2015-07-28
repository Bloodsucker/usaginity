var Cache = require('./Cache'),
	Interaction = require('./Interaction'),
	Persistance = require('./Persistance');

var cache, persitance;

global.Usaginity = module.exports = function Usaginity () {
	cache = new Cache();
	persitance = new Persistance(cache);
};

Usaginity.prototype.entering = function() {
	setTimeout(function () {
		var enteringInteraction = new Interaction("entering");

		cache.push(enteringInteraction);

		window.addEventListener('beforeunload', function () {
			var leavingInteraction = new Interaction("leaving");

			cache.push(leavingInteraction);
		});
	});
};