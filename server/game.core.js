var UUID = require('node-uuid');
var fs = require('fs');

var io=require('socket.io');

var ready = 0;

var gameBeats;
var beatIndex=0;

var startTime, currTime, timeElapsed = 0;

var mock_game = function(gameID){
	this.game_id = gameID;
	this.player1 = null;
}

var game_core = function(sio, gameID, player1x, player2x){
	console.log(gameID);

	this.sio = sio;
	this.game_id = gameID;

	this.players = {
		player1 : player1x,
		player2 : player2x
	};

	this.songs = {
		first_song : null,
		second_song : null
	};
}

function playerReady(){
	console.log('player ready connected');
	ready++;

	if (ready == 2)
		startGame();
}

function startGame(){
	this.sio.sockets.in(this.game_id).emit('game start');

	startTime = Date.now();
	setInterval(checkBeat, 1000);
}

function checkBeat(){
	currTime = Date.now();
	timeElapsed = (currTime - startTime) / 1000;

	//timer may not be exact, so need to find a way to compare
	if (this.gameBeats[beatIndex].timing == timeElapsed){
		this.sio.sockets.in(this.game_id).emit('beat', gameBeats[beatIndex]);
		beatIndex++;
	}
}

exports.game_core = game_core;
exports.mock_game = mock_game;