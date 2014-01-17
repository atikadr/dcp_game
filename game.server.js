var UUID = require('node-uuid');
var game_server = module.exports = {player_array : {}, player_count : 0, gameroom_array : {}, room_count : 0};

//var player_count = 0;
//var player_array = {};

require('./game.player.js');
require('./game.room.js');

game_server.createPlayer = function(socket, username, userid){
	this.player_array[userid] = new game_player();
	this.player_array[userid].uuid = userid;
	this.player_array[userid].socket = socket;
	this.player_array[userid].username = username;
	this.player_count++;

	console.log(this.player_count);

	//console.log(this.player_array[userid].uuid);
}

game_server.createGameRoom = function(roomname, userid){
	var gameroom = new game_room(roomname);
	gameroom.players.player1 = this.player_array[userid];
	gameroom.player_count++;
	
	this.gameroom_array[roomname] = gameroom;

	console.log(roomname);
}

game_server.joinGameRoom = function(roomname, client){
	var gameroom = this.gameroom_array[roomname];

	if (gameroom.player_count == 1) {
		gameroom.players.player2 = this.player_array[client.userid];
		gameroom.player_count++;

		client.emit('player type', {player_type: 2});
		console.log(gameroom.player_count);
	}
}