module.exports = InmediateAsyncTaskQueue;
function InmediateAsyncTaskQueue () {
	var self = this;

	self.forceSync = false;

	self._tasks = [];
};

/**
 * Enqueue a task to be executed asynchronously. All the queued task, will be executed async but in their same thread.
 * @param  {[Function]} task
 */
InmediateAsyncTaskQueue.prototype.enqueue = function (task) {
	var self = this;

	self._tasks.push(task);

	//Detects when there is already a planned execution.
	if (!self._executing) {
		self._executing = true;


		var execAllQueuedTasks = function () {
			var task;

			//All the queued task, will be executed async but in their same thread.
			while (task = self._tasks.shift()) {
				task();
			}

			self._executing = false;
		}

		//Async execution!
		if (!self.forceSync) setTimeout(execAllQueuedTasks);
		else execAllQueuedTasks();
	}
};