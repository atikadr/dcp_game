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
	}

//	this.players.player1.on('load game', loadGame);

	//this.players.player1.socket.on('game ready', playerReady);
	//this.players.player2.socket.on('game ready', playerReady);

	this.gameBeats = [];

	fs.readFile('beats/test.txt','utf8',function(err,data){
		tempArray = data.split("\n");
		for(var i = 0 ; i < tempArray.length-1 ; i++){
				var tempObject = {type:tempArray[i].split(",")[0],timing:parseInt(tempArray[i].split(",")[1])};
				this.gameBeats.push(tempObject);
			}
	});

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