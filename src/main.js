var Cache = require('./Cache'),
	Interaction = require('./Interaction'),
	Persistance = require('./Persistance'),
	tools = require('./tools');

var cache, persitance;

function Usaginity () {
	var self = this;

	cache = new Cache();
	persitance = new Persistance(cache);

	self.timers = {};
};

global.Usaginity = module.exports = Usaginity;

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

Usaginity.prototype.transition = function () {
	setTimeout(function () {
		var tstart = simpleTracking.tstart;
		var tend = new Date();
		var tdiff = tend.getTime() - tstart.getTime();

		simpleTracking.referrer = simpleTracking.current;
		simpleTracking.current = document.URL;
		simpleTracking.tstart = new Date();

		createInteraction('transition', {
			tend: tend.getTime(),
			tdiff: tdiff
		});
	});
};


Usaginity.prototype.startTimer = function (timerId) {
	var self = this;

	setTimeout(function () {
		self.timers[timerId] = new Date();
	});
};

Usaginity.prototype.endTimer = function (timerId) {
	var self = this;

	setTimeout(function () {
		var tstart = self.timers[timerId];
		if (!tstart) return;

		var tend = new Date();
		var tdiff = tend.getTime() - tstart.getTime();

		createInteraction('timer', {
			timerName: timerId,
			tend: tend.getTime(),
			tdiff: tdiff
		});

		self.timers[timerId] = null;
	});
};

var simpleTracking = {
	referrer: document.referrer,
	current: document.URL,
	tstart: new Date()
};

function createInteraction(interactionName, interactionOptions) {
	var newInteraction = new Interaction(interactionName);

	var tracking = {
		referrer: simpleTracking.referrer,
		url: simpleTracking.current,
		title: document.title
	};

	tools.forcedExtend(newInteraction, tracking, interactionOptions);

	cache.push(newInteraction);
};