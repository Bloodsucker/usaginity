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

var cookie = require('cookie-cutter');
exports.setJSONCookie = function (name, o) {
	if (!o) {
		cookie.set(name, null);
		return;
	}

	var json = JSON.stringify(o);
	cookie.set(name, json);
};

exports.getJSONCookie = function (name) {
	var json = cookie.get(name);

	if (!json) return null;

	return JSON.parse(json);
};