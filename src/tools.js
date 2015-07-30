exports.extend = function (extendFirstObject) {
	var extended, from = 0;

	if (typeof extendFirstObject === "boolean") {
		if (extendFirstObject) {
			extended = arguments[1];
			from = 2;
		} else {
			from = 1;
		}
	}

	extended = extended || {};

	for (var i = from; i < arguments.length; ++i) {
		var prop, o = arguments[i];

		for (prop in o) {
			if (Object.prototype.hasOwnProperty.call(o, prop)) {
				extended[prop] = o[prop];
			}
		}
	}

	return extended;
};

exports.forcedExtend = function (extended) {
	for (var i = 1; i < arguments.length; ++i) {
		var prop, o = arguments[i];

		for (prop in o) {
			extended[prop] = o[prop];
		}
	}

	return extended;
};

exports.setJSONCookie = function (name, o) {
	if (!o) {
		localStorage.removeItem(name);
		return;
	}

	localStorage.setItem(name, JSON.stringify(o));
};

exports.getJSONCookie = function (name) {
	var json = localStorage.getItem(name);
	if (!json) return null;
	return JSON.parse(json);
};

exports.isNetworkAvailable = function () {
	if (Math.random() < 0.5) return false;
	else return true;
}

//http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript/18120932#18120932
exports.randomStr = function (stringLength) {
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	var randomString = Array.apply(null, new Array(stringLength)).map(function () {
	    return possible[Math.floor(Math.random() * possible.length)];
	}).join('');

	return randomString;
}

exports.InmediateAsyncTaskQueue = require('./tools/InmediateAsyncTaskQueue');