var tools = require('./tools');

var defConfig = {
	windowSize: Infinity,
	instantly: true,
	buffer: 3,
	bfTimeout: 3000
};

module.exports = Persistence;
/**
 * Persitance layer of Usaginity.
 * @param {Cache} cache     	Cache to listen. When there are new Interactions, this layer will know.
 * @param {[type]} optConfig
 */
function Persistence (cache, optConfig) {
	var self = this;

	self.config = tools.extend(defConfig, optConfig);

	self.cache = cache;

	self._bufferTimeoutId = null;
	// When there is a new Interaction in the cache layer, this layer will know by this callback.
	self.cache.listen(function (forcedSend) {
		clearTimeout(self._bufferTimeoutId);
		self._bufferTimeoutId = null;

		if (self.cache.interactions.length === 0) return;

		//Check how to proceed depending of how was configured
		//Send it instantly
		if (self.config.instantly || forcedSend) {
			self.flush();

		//Send if the buffer is full
		} else if (self.config.buffer < self.cache.interactions.length) {
			self.flush();
		
		//Send buffered Interactions in the future.
		} else {
			self._bufferTimeoutId = setTimeout(function () {
				self.flush();
			}, self.config.bfTimeout);
		}
	});
};

/**
 * Flush the interactions.
 */
Persistence.prototype.flush = function () {
	var self = this;

	if (!tools.isNetworkAvailable()) {
		console.log("Network is not available.");

		//TODO Retry by event reconnect or timeout.
		self._bufferTimeoutId = setTimeout(function () {
			self.flush();
		}, 3000);

		return;
	};

	while(self.cache.interactions.length > 0) {
		//Get "windowSize" Interactions to send.
		var toSend = self.cache.unqueue(self.config.windowSize);

		//Send them. If there was an error during sending, onError will requeue them.
		asyncSend(toSend, function onError() {
			self.cache.requeue(toSend);
		});
	}
};

function asyncSend (o, onError) {
	// doAsyncAjax(o, onError);
	doFakeSending(o, onError);
}

// function doAsyncAjax(o, onError) {
// 	// Ajax call.
// };

function doFakeSending(o, onError) {
	console.log("Interactions SENT:");
	console.table ? console.table(o) : console.log(o);

	var fakeSent = tools.getJSONCookie('fakeSent') || [];
	fakeSent = fakeSent.concat(o);
	tools.setJSONCookie('fakeSent', fakeSent);
};
