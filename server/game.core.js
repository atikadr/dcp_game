var UUID = require('node-uuid');

var io=require('socket.io');

var ready = 0;

var gameBeats;

var game_core = function(sio, gameID){
	this.sio = sio;
	this.game_id = gameID;

	this.players = {
		player1 : null,
		player2 : null
	}

//	this.players.player1.on('load game', loadGame);

	this.players.player1.on('game ready', playerReady);
	this.players.player2.on('game ready', playerReady);

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

var game_core = module.exports;