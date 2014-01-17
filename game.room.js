//require('./game.player.js');


var game_room = function(roomname){
	this.room_name = roomname;
	this.players = {
		player1 : null,
		player2 : null
	};
	this.player_count = 0;
}

module.exports = global.game_room = game_room;