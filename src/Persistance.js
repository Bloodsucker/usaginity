var tools = require('./tools');

var defConfig = {
	windowSize: Infinity,
	instantly: true,
	buffer: 3,
	bfTimeout: 3000
};

function Persistance (cache, optConfig) {
	var self = this;

	self.config = tools.extend(defConfig, optConfig);

	self.cache = cache;

	var bufferTimeoutId = null;
	self.cache.listen(function () {
		clearTimeout(bufferTimeoutId);
		bufferTimeoutId = null;

		if (self.config.instantly) {
			self.flush();
		} else if (self.config.buffer >= self.cache.interactions.length) {
			self.flush();
		} else {
			bufferTimeoutId = setTimeout(function () {
				self.flush();
			}, self.config.bfTimeout);
		}
	});
};

module.exports = Persistance;

Persistance.prototype.flush = function () {
	var self = this;

	if (self.cache.interactions.length > 0) {
		var toSend = self.cache.interactions.splice(0, self.config.windowSize);
		asyncSend(toSend);
	}
};

function asyncSend (o) {
	// doAsyncAjax(o);
	doFakeSending(o);
}

// function doAsyncAjax(o) {
// 	// Ajax call.
// }

function doFakeSending(o) {
	console.log("Sending", o);

	var fakeSent = tools.getJSONCookie('fakeSent') || [];
	fakeSent = fakeSent.concat(o);
	tools.setJSONCookie('fakeSent', fakeSent);
};
