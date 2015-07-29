module.exports = function Interaction (type) {
	this.type = type;
	this.now = new Date()+'';
	this.url = document.URL;
	this.title = document.title;
};