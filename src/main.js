var Cache = require('./Cache'),
	Interaction = require('./Interaction'),
	Persistance = require('./Persistance'),
	tools = require('./tools');

var cache, persitance;

function Usaginity () {
	cache = new Cache();
	persitance = new Persistance(cache);
};

global.Usaginity = module.exports = Usaginity;

function createInteraction (interactionName, interactionOptions) {
	var newInteraction = new Interaction(interactionName);

	tools.extend(true, newInteraction, interactionOptions);

	cache.push(newInteraction);
};

Usaginity.prototype.entering = function() {
	setTimeout(function () {
		createInteraction("entering");

		window.addEventListener('beforeunload', function () {
			createInteraction("leaving");
		});
	});
};

Usaginity.prototype.event = function (eventType, nameId, label) {
	setTimeout(function () {
		createInteraction('event', {
			eventType: eventType,
			nameId: nameId,
			label: label
		});
	});
};