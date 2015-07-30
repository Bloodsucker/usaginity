var tools = require('./tools');

var defConfig = {
	windowSize: Infinity,
	instantly: true,
	buffer: 3,
	bfTimeout: 3000
};

module.exports = Persistance;
function Persistance (cache, optConfig) {
	var self = this;

	self.config = tools.extend(defConfig, optConfig);

	self.cache = cache;

	var bufferTimeoutId = null;
	self.cache.listen(function (forcedSend) {
		clearTimeout(bufferTimeoutId);
		bufferTimeoutId = null;

		if (self.config.instantly || forcedSend) {
			self.flush();
		} else if (self.config.buffer < self.cache.interactions.length) {
			self.flush();
		} else {
			bufferTimeoutId = setTimeout(function () {
				self.flush();
			}, self.config.bfTimeout);
		}
	});
};

Persistance.prototype.flush = function () {
	var self = this;

	if (!tools.isNetworkAvailable()) {
		console.log("Network is not available.");
		//TODO Retry by event reconnect or timeout.
		setTimeout(function () {
			self.flush();
		}, 3000);
		return;
	};

	while(self.cache.interactions.length > 0) {	
		var toSend = self.cache.unqueue(self.config.windowSize);

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
