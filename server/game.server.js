var game_server = module.exports;
var io=require('socket.io');
var gc = require('./game.core.js');

var player_array = [], gameArray = [];


game_server.addPlayer = function(socket, username){
	socket.username = username;

	socket.emit('get players', {players: player_array});
	
	player_array[username] = socket;
}

game_server.challenge = function(challenger, challenged){
	var socket = this.player_array[challenged];
	socket.emit('new challenger', {username: challenger});
}

game_server.acceptChallenge = function(sio, challenger, challenged, gameID){
	var socket = this.player_array[challenger];
	socket.emit('challenge accepted', {username: challenged});
	socket.emit('your game id', {game_id: game});

	newGame(sio, gameID);
}

game_server.newGame = function(gameID){
	/*
	var newGame = new gc.game_core(sio, gameID);
	gameArray[gameID] = newGame;
	*/

	var newGame = new gc.mock_game(gameID);
	gameArray[gameID] = newGame;
}

game_server.joinGame = function(sio, socket, username, gameID){
	
	socket.username = username;
	var game_instance = gameArray[gameID];
	

	/*
	if (game_instance.players.player1 == null){
		socket.set(gameID + ' player1');
		game_instance.players.player1 = socket;
	}
	else {
		socket.set(gameID + ' player2');
		game_instance.players.player2 = socket;
		sio.sockets.in(gameID).emit('players connected');
	}

	gameArray[gameID] = game_instance;
	*/

	if (game_instance.player1 == null){
		socket.set(gameID + ' player1');
		game_instance.player1 = socket;
		gameArray[gameID] = game_instance;
	}
	else {
		socket.set(gameID + ' player2');
		var newGame = new gc.game_core(sio, gameID, game_instance.player1, socket);
		delete game_instance; delete gameArray[gameID];
		gameArray[gameID] = newGame;


		sio.sockets.in(gameID).emit('players connected');
	}

}

game_server.setSong = function(socket, username, song){
	player_array[username].song = song;
}

game_server.disconnect = function(socket){
	delete player_array[socket.username];
}


