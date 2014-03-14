var UUID = require('node-uuid');
var fs = require('fs');

var io=require('socket.io');

var ready = 0;

var gameBeats;
var beatIndex=0;

var startTime, currTime, timeElapsed = 0;

var game_core = function(sio, gameID, player1x, player2x){
	console.log(gameID);

	this.sio = sio;
	this.game_id = gameID;
	this.counter = 0;
	this.track;

	this.players = {
		player1 : player1x,
		player2 : player2x
	};

	this.offset = {
		player1 : null,
		player2 : null
	};

	this.firstTimer = {
		player : null,
		timer : null,
		serverCounter:null
	};

	this.songs = {
		first_song : null,
		second_song : null
	};

	this.tracks = {
		first_song : null,
		second_song : null
	};


	//below for playing two songs
	this.ready_first_song = {
		player1 : false,
		player2 : false
	};

	this.ready_second_song = {
		player1 : false,
		player2 : false
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