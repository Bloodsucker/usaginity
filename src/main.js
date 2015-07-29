var cache = require('./Cache'),
	Interaction = require('./Interaction'),
	Persistance = require('./Persistance'),
	tools = require('./tools');

var defConfig = {
	persistance: {
		instantly: false,
		buffer: 3,
		bfTimeout: 3000
	}
};

global.Usaginity = module.exports = Usaginity;
function Usaginity (optConfig) {
	var self = this;

	if (!optConfig) optConfig = {persistance:{}};

	tools.extend(true, optConfig.persistance, defConfig.persistance);

	var persitance = new Persistance(cache, optConfig.persistance);

	self.queue = new tools.InmediateAsyncTaskQueue();

	self.timers = {};
};

Usaginity.prototype.entering = function() {
	var self = this;

	self.queue.enqueue(function () {
		createInteraction("entering");

		window.addEventListener('beforeunload', function () {
			createInteraction("leaving", null, true);
		});
	});
};

Usaginity.prototype.event = function (eventType, nameId, label) {
	var self = this;

	self.queue.enqueue(function () {
		createInteraction('event', {
			eventType: eventType,
			nameId: nameId,
			label: label
		});
	});
};

Usaginity.prototype.transition = function () {
	var self = this;

	self.queue.enqueue(function () {
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

	self.queue.enqueue(function () {
		self.timers[timerId] = new Date();
	});
};

Usaginity.prototype.endTimer = function (timerId) {
	var self = this;

	self.queue.enqueue(function () {
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

function createInteraction(interactionName, interactionOptions, forcedSend) {
	var newInteraction = new Interaction(interactionName);

	var tracking = {
		referrer: simpleTracking.referrer,
		url: simpleTracking.current,
		title: document.title
	};

	tools.forcedExtend(newInteraction, tracking, interactionOptions);

	cache.push(newInteraction, forcedSend);
};