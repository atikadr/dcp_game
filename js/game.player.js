
var game_player = function(){
	//basic information
	this.game;
	this.username;
	this.uuid;
	this.socket;

	//position
	this.pos = { x:0, y:0};
}

module.exports = global.game_player = game_player;