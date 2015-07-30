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

var usaginity = null;
/**
 * Singleton for Usaginity.
 * It does not matter if it is executed as new Usaginity(); or just Usaginity();
 * @global
 * @param  {[type]} optConfig
 * @return {Usaginity}        Singleton for Usaginity.
 */
global.Usaginity = module.exports = function singleton(optConfig) {
	if (!usaginity) usaginity = new Usaginity(optConfig);
	return usaginity;
};

/**
 * It defines the API to interact with Usaginity.
 * @param {[object]} optConfig Optional configuration.
 */
function Usaginity (optConfig) {
	var self = this;

	//Identifies the browser.
	basicIdentity();

	if (!optConfig) optConfig = {persistance:{}};

	tools.extend(true, optConfig.persistance, defConfig.persistance);

	//Creates the persistance layer.
	var persitance = new Persistance(cache, optConfig.persistance);

	self.queue = new tools.InmediateAsyncTaskQueue();

	self.timers = {};
};

/**
 * Defines when to start tracking. It will detect automatically when to stop tracking.
 * @async
 */
Usaginity.prototype.entering = function() {
	var self = this;

	self.queue.enqueue(function () {
		createInteraction("entering");

		window.addEventListener('beforeunload', function () {
			self.queue.forceSync = true;

			self.end();
			createInteraction("leaving", null, true);
		});
	});
};

/**
 * Creates an Interaction event.
 * @async
 * @param  {string} eventType The event type. E.g. 'click'.
 * @param  {string} nameId    The id for the event.
 * @param  {string} label     A label to specify between different same events.
 */
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

/**
 * Defines a transition between two URL. It is useful when in sigle-page application.
 * @async
 */
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

/**
 * Defines an internal timer.
 * @async
 * @param  {string} timerId The timer ID.
 */
Usaginity.prototype.startTimer = function (timerId) {
	var self = this;

	self.queue.enqueue(function () {
		self.timers[timerId] = new Date();
	});
};

/**
 * Defines when to stop a previously executed timer.
 * @async
 * @param  {string} timerId The timer ID.
 */
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

/**
 * Automatically closes all opened timers.
 * @async It executes several async operations.
 */
Usaginity.prototype.end = function () {
	var self = this;

	var prop;
	for (prop in self.timers) {
		if (self.timers[prop]) {
			self.endTimer(prop);
		}
	}
};

/**
 * Helps to track main browser data.
 * In single pages it tracks from what sections user comes.
 */
var simpleTracking = {
	referrer: document.referrer,
	current: document.URL,
	tstart: new Date()
};

function basicIdentity() {
	var id = tools.getJSONCookie('ugId');
	if (!id) {
		id = tools.randomStr(32);
	}

	simpleTracking.trackId = id;

	tools.setJSONCookie("ugId", id);
};

/**
 * When a code action is executed, it might create an Interaction filling it with some data.
 * @param  {string} interactionName    		Interaction type name
 * @param  {[object]} interactionOptions 	An object to extend and personalize the Interaction
 * @param  {[boolean]} forcedSend         	If the browser is going to be closed inmediatelly, forceSend will be marked as true to try to send the Interaction. 
 */
function createInteraction(interactionName, interactionOptions, forcedSend) {
	var newInteraction = new Interaction(interactionName);

	var tracking = {
		referrer: simpleTracking.referrer,
		url: simpleTracking.current,
		title: document.title,
		trackId: simpleTracking.trackId
	};

	tools.forcedExtend(newInteraction, tracking, interactionOptions);

	//Send the new Interaction to the cache.
	cache.push(newInteraction, forcedSend);
};