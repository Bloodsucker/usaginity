module.exports = InmediateAsyncTaskQueue;
function InmediateAsyncTaskQueue () {
	var self = this;

	self._tasks = [];
};

InmediateAsyncTaskQueue.prototype.enqueue = function (task) {
	var self = this;

	self._tasks.push(task);

	if (!self._executing) {
		self._executing = true;
		setTimeout(function () {
			var task;
			while (task = self._tasks.shift()) {
				task();
			}

			self._executing = false;
		});
	}
};