var game_server = module.exports; //= {gameArray: {}};
var io=require('socket.io');
var gc = require('./game.core.js');

var UUID=require('node-uuid');

var player_array = {}, gameArray = [];


game_server.addPlayer = function(sio, socket, username){
	socket.username = username;

	var toSend = [];
	for (var key in player_array){
		toSend.push(player_array[key].username);
	}
	socket.emit('get players', {players: toSend});
	
	player_array[username] = socket;

	sio.sockets.in('gameroom').emit('new player joined room', {player: username});
	socket.join('gameroom');
}

game_server.challenge = function(sio, challengerSocket, challenger, challenged){
	var challengedSocket = player_array[challenged];
	challengedSocket.emit('new challenger', {username: challenger});

	var gameID = UUID();
	var newGame = new gc.game_core(sio, gameID, challengerSocket, challengedSocket);
	gameArray[gameID] = newGame;

	//challengerSocket.set(gameID + ' player1');
	challengerSocket.player = 'player1';
	challengerSocket.game_id = gameID;
	//challengedSocket.set(gameID + ' player2');
	challengedSocket.player = 'player2';
	challengedSocket.game_id = gameID;

	challengedSocket.join(gameID);
	challengerSocket.join(gameID);
	sio.sockets.in(gameID).emit('your game id', {game_id: game});	

	console.log('new game created ' + gameID);
}

game_server.acceptChallenge = function(gameID){
	var challengerSocket = gameArray[gameID].players.player1;
	challengerSocket.emit('challenge accepted');
}

game_server.declineChallenge = function(sio, gameID){
	var challengerSocket = gameArray[gameID].players.player1;
	var challengedSocket = gameArray[gameID].players.player2;
	challengerSocket.emit('challenge not accepted');
	challengerSocket.leave(gameID);
	challengedSocket.leave(gameID);
	addPlayer(sio, challengerSocket, challengerSocket.username);
	addPlayer(sio, challengedSocket, challengedSocket.username);

	delete gameArray[gameID];
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

game_server.setSong = function(gameID, player, song){
	if (player == 'player1'){
		gameArray[gameID].songs.first_song = song;
	}
	else{
		gameArray[gameID].songs.second_song = song;
	}
}

game_server.disconnect = function(socket, username, sio){
	delete player_array[username];
	socket.leave('gameroom');
	sio.sockets.in('gameroom').emit('player left room', {player: username});
}