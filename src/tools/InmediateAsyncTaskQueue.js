module.exports = InmediateAsyncTaskQueue;
function InmediateAsyncTaskQueue () {
	var self = this;

	self.forceSync = false;

	self._tasks = [];
};

InmediateAsyncTaskQueue.prototype.enqueue = function (task) {
	var self = this;

	self._tasks.push(task);

	if (!self._executing) {
		self._executing = true;

		var execAllQueuedTasks = function () {
			var task;
			while (task = self._tasks.shift()) {
				task();
			}

			self._executing = false;
		}

		if (!self.forceSync) setTimeout(execAllQueuedTasks);
		else execAllQueuedTasks();
	}
};