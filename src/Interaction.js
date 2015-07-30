module.exports = Interaction;
function Interaction (type) {
	this.type = type;
	this.date = new Date().getTime();
};
