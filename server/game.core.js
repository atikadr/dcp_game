var UUID = require('node-uuid');

var io=require('socket.io');

var ready = 0;

var gameBeats;

var mock_game = function(gameID){
	this.game_id = gameID;
	this.player1 = null;
}

var game_core = function(sio, gameID, player1, player2){
	console.log(gameID);

	this.sio = sio;
	this.game_id = gameID;

	this.players = {
		player1 : player1,
		player2 : player2
	}

//	this.players.player1.on('load game', loadGame);

	this.players.player1.socket.on('game ready', playerReady);
	this.players.player2.socket.on('game ready', playerReady);

	fs.readFile('beats/test.txt','utf8',function(err,data){
		gameBeats = data.split("\n");
	});

}

function playerReady(){
	ready++;

	if (ready == 2)
		startGame();
}

function startGame(){
	this.sio.sockets.in(this.game_id).emit('game start');

}

exports.game_core = game_core;
exports.mock_game = mock_game;