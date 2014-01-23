var UUID = require('node-uuid');
var game_server = module.exports = {player_array : {}, player_count : 0, gameroom_array : {}, room_count : 0};

require('../js/game.player.js');
require('../js/game.room.js');
var io=require('socket.io');


game_server.createPlayer = function(socket, username, userid){
	this.player_array[userid] = new game_player();
	this.player_array[userid].uuid = userid;
	this.player_array[userid].socket = socket;
	this.player_array[userid].username = username;
	this.player_count++;

	console.log(this.player_array);
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
	
	console.log(this.gameroom_array);
}

game_server.joinGameRoom = function(roomname, client, sio){
	var gameroom = this.gameroom_array[roomname];
	
	//edit gameroom to add this new client as a player
	gameroom.players[gameroom.players.length] = this.player_array[client.userid];
	this.gameroom_array[roomname] = gameroom;

	//add client to game room
	client.join(roomname);
	console.log(this.gameroom_array);

	//sio.sockets.in(roomname).emit('gameroom info 2', {game: gameroom.players.length});
}

game_server.sendRoomInfo = function(socket, roomname){
	var gameroom = this.gameroom_array[roomname];
	var array = new Array();
	for(var i = 0 ; i < gameroom.players.length ; i++){
		array[i] = gameroom.players[i].username;
	}
	socket.emit('gameroom info', {players: array})

}

game_server.sendRooms = function(socket){
	var array = new Array();

	for (var key in this.gameroom_array){
		console.log(this.gameroom_array[key]);
		array.push(this.gameroom_array[key].room_name);
	}
	
/*
	this.gameroom_array.forEach(function(entry){
		console.log(entry.roomname);
		array.push(entry.roomname);
	});
*/
	socket.emit('getRooms', {rooms: array});
}