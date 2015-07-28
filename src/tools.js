/**
 * @author http://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
 * 
 * Merge defaults with user options
 * @param {Object} defaults Default settings
 * @param {Object} options User options
 * @returns {Object} Merged values of defaults and options
 */
exports.extend = function ( defaults, options ) {
    var extended = {};
    var prop;
    for (prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }
    for (prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
            extended[prop] = options[prop];
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