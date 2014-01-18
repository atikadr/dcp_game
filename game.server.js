var UUID = require('node-uuid');
var game_server = module.exports = {player_array : {}, player_count : 0, gameroom_array : {}, room_count : 0};

require('./game.player.js');
require('./game.room.js');


game_server.createPlayer = function(socket, username, userid){
	this.player_array[userid] = new game_player();
	this.player_array[userid].uuid = userid;
	this.player_array[userid].socket = socket;
	this.player_array[userid].username = username;
	this.player_count++;

	console.log(this.player_count);
}

game_server.createGameRoom = function(roomname, client){
	//create a new game room and initialise this client as the first player
	var gameroom = new game_room(roomname);
	gameroom.players[0] = this.player_array[client.userid];
	gameroom.player_count++;

	//add the new gameroom to array of gamerooms
	this.gameroom_array[roomname] = gameroom;

	//add client to game room
	client.join(roomname);

	console.log(roomname);
}

game_server.joinGameRoom = function(roomname, client){
	var gameroom = this.gameroom_array[roomname];
	
	//send gameroom info to client
	client.emit('gameroom info', {game: gameroom.players.length});

	//edit gameroom to add this new client as a player
	gameroom.players[gameroom.players.length] = this.player_array[client.userid];
	this.gameroom_array[roomname] = gameroom;

	//
}