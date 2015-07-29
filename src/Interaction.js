module.exports = Interaction;
function Interaction (type) {
	this.type = type;
	this.now = new Date().getTime();
};
