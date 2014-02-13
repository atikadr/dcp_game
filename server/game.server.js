var game_server = module.exports; //= {gameArray: {}};
var io=require('socket.io');
var gc = require('./game.core.js');

var player_array = {}, gameArray = [];


game_server.addPlayer = function(socket, username){
	var toSend = [];
	for (var key in player_array){
		toSend.push(player_array[key].username);
	}
	socket.emit('get players', {players: toSend});
	
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

game_server.declineChallenge = function(challenger, challenged){
	var socket = this.player_array[challenger];
	socket.emit('challenge not accepted', {username: challenged});
}

game_server.newGame = function(gameID){
	/*
	var newGame = new gc.game_core(sio, gameID);
	gameArray[gameID] = newGame;
	*/



	var newGame = new gc.mock_game(gameID);
	gameArray[gameID] = newGame;

	console.log('new game created');
}

game_server.joinGame = function(socket, username, gameID){
	
	socket.username = username;
	var game_instance = gameArray[gameID];

	if (game_instance.player1 == null){
		socket.set(gameID + ' player1');
		socket.player = 'player1';
		game_instance.player1 = socket;
		gameArray[gameID] = game_instance;
	}
	else {
		socket.set(gameID + ' player2');
		socket.player = 'player2';
		var newGame = new gc.game_core(sio, gameID, game_instance.player1, socket);
		delete game_instance; delete gameArray[gameID];
		gameArray[gameID] = newGame;

		console.log(newGame);


		sio.sockets.in(gameID).emit('players connected');
	}

}

game_server.setSong = function(gameID, song){
	var game_instance = gameArray[gameID];	
	if (game_instance.songs.first_song == null){
		game_instance.songs.first_song = song;
	}
	else{
		game_instance.songs.second_song = song;
	}
}

game_server.disconnect = function(socket){
	delete player_array[socket.username];
}


