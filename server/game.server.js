var game_server = module.exports; //= {gameArray: {}};
var io=require('socket.io');
var gc = require('./game.core.js');
var power_up = require('./power.up.js');

var UUID=require('node-uuid');

var player_array = {}, gameArray = [], gameTimer = [];
var gameCounter = 0;


setInterval(function(){game_server.updateCounter();}, 50/3);

game_server.updateCounter = function(){
	gameCounter++;
}

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


game_server.addPlayerFinal = function(fbid, highscore){
}

game_server.sendPlayer = function(socket){
	var toSend = [];
	for (var key in player_array){
		toSend.push(player_array[key].username);
	}
	socket.emit('get players', {players: toSend});
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

	game_server.disconnect(challengerSocket, challenger, sio);
	game_server.disconnect(challengedSocket, challenged, sio);

	console.log('new game created ' + gameID);
}

game_server.acceptChallenge = function(sio, gameID){
	//var challengerSocket = gameArray[gameID].players.player1;
	//challengerSocket.emit('challenge accepted');
	sio.sockets.in(gameID).emit('your game id', {game_id: gameID});
}

game_server.declineChallenge = function(sio, gameID){
	var challengerSocket = gameArray[gameID].players.player1;
	var challengedSocket = gameArray[gameID].players.player2;
	challengerSocket.emit('challenge not accepted');
	//challengerSocket.leave(gameID);
	//challengedSocket.leave(gameID);
	game_server.addPlayer(sio, challengerSocket, challengerSocket.username);
	game_server.addPlayer(sio, challengedSocket, challengedSocket.username);

	delete gameArray[gameID];
}

game_server.sendOpponentName = function(socket, gameID, thisPlayer){
	if (thisPlayer == 'player1'){
		socket.emit('get opponent name', {opponentName: gameArray[gameID].players.player2.username});	
	}
	else{
		socket.emit('get opponent name', {opponentName: gameArray[gameID].players.player1.username});
	}
	
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

game_server.setSong = function(sio, mysql, gameID, player, song){
	/*
	console.log("client set song " + song);
	mysql.query('select * from Song where song = "' + song + '";', 
		function(err, result, fields){
			if (err) throw err;
			else{
				if (player == 'player1'){
					gameArray[gameID].songs.first_song = song;
					gameArray[gameID].tracks.first_song = result[0].beats;

					console.log("hey there this is player 1 " + gameArray[gameID].tracks.first_song);

				}
				else {
					gameArray[gameID].songs.second_song = song;
					gameArray[gameID].tracks.second_song = result[0].beats;

					console.log("hey there this is player 2 " + gameArray[gameID].tracks.second_song);
				}
					//if both songs are done, tell both players
				if (gameArray[gameID].tracks.first_song != null && gameArray[gameID].tracks.second_song != null){
					//do a random choice here
					if (Math.random() > 0.5){
						//first song
					}
					else{
						//second song
					}

					sio.sockets.in(gameID).emit('game ready');
				}
			}
	});
	*/

	if (player == 'player1')
		gameArray[gameID].songs.first_song = song;
	else
		gameArray[gameID].songs.second_song = song;
				
					//if both songs are done, tell both players
	if (gameArray[gameID].songs.first_song != null && gameArray[gameID].songs.second_song != null){
		var songName;
		if (Math.random() > 0.5)
			songName = gameArray[gameID].songs.first_song;
		else
			songName = gameArray[gameID].songs.second_song;

		mysql.query('select * from Song where song = "' + songName + '";', function(err, result, fields){
			if (err) throw err;
			else {
				gameArray[gameID].track = result[0].beats;
				sio.sockets.in(gameID).emit('game ready', {song: songName}); //THIS MUST BE DONE IN THE INNERMOST MYSQL QUERY
				//compute the song powerup

				mysql.query('select points from Player WHERE fbid ="' + gameArray[gameID].players.player1.username + '";', function(err, result, fields){
					if (err) throw err;
					else{
						if (result[0] != null){
							gameArray[gameID].tracks.player1 = power_up.computeTrack(gameArray[gameID].track, result[0]);
						}
					}
				});

				mysql.query('select points from Player WHERE fbid ="' + gameArray[gameID].players.player2.username + '";', function(err, result, fields){
					if (err) throw err;
					else{
						if (result[0] != null){
							gameArray[gameID].tracks.player2 = power_up.computeTrack(gameArray[gameID].track, result[0]);
						}
					}
				});
			}	
		});
	}
}


game_server.readyFirstSong = function(gameID, player){
	if (player == 'player1')
		gameArray[gameID].ready_first_song.player1 = true;
	else
		gameArray[gameID].ready_first_song.player2 = true;

	if (gameArray[gameID].ready_first_song.player1 == true && gameArray[gameID].ready_first_song.player2 == true)
		return true;
	else
		return false;
}


game_server.startFirstSong = function(sio, gameID){
	//sio.sockets.in(gameID).emit('song beats', {beats: gameArray[gameID].tracks});
	if (gameArray[gameID].tracks.player1 != null && gameArray[gameID].tracks.player2 != null)
		sio.sockets.in(gameID).emit('song beats', {beats: gameArray[gameID].tracks.player1 + '#' + gameArray[gameID].tracks.player2});

	console.log(gameArray[gameID].tracks);
}

game_server.adjustTimer = function(player, gameID, timer){
	if (gameArray[gameID].firstTimer.player == null){
		gameArray[gameID].firstTimer.timer = timer;
		gameArray[gameID].firstTimer.serverCounter = gameCounter;
		if (player == 'player1'){
			gameArray[gameID].firstTimer.player = 'player1';
		}
		else{
			gameArray[gameID].firstTimer.player = 'player2';
		}	
	}
	else {
		var currentCounter = gameCounter;
		var timeLapse = currentCounter - gameArray[gameID].firstTimer.serverCounter;
		var realTimer = timer - timeLapse;
		var average = (realTimer + gameArray[gameID].firstTimer.timer)/2;

		console.log("time lapse " + timeLapse + " this.gameCounter: " + gameCounter + " timer: " + gameArray[gameID].firstTimer.timer);

		if (gameArray[gameID].firstTimer.player == 'player1'){
			gameArray[gameID].offset.player1 = gameArray[gameID].firstTimer.timer - average;
			gameArray[gameID].offset.player2 = realTimer - average;
			
		}
		else {
			gameArray[gameID].offset.player2 = gameArray[gameID].firstTimer.timer - average;
			gameArray[gameID].offset.player1 = realTimer - average;
		}

		gameArray[gameID].players.player1.emit('delta', {delta: gameArray[gameID].offset.player2});
		gameArray[gameID].players.player2.emit('delta', {delta: gameArray[gameID].offset.player1});

		gameArray[gameID].firstTimer.player = null;

	}
		
}

game_server.sendBeat1 = function(sio, gameID){
	var beat = gameArray[gameID].tracks.first_song[0].split(",")[1];
	while(parseInt(beat) == counter){
		//sio.sockets.in(gameID).emit('beat',gameArray[gameID].tracks.first_song[0].split(",")[0]);
		sio.sockets.in(gameID).emit('beat', {colour: gameArray[gameID].tracks.first_song[0].split(",")[0], time: gameArray[gameID].tracks.first_song[0].split(",")[1]});
		gameArray[gameID].tracks.first_song.splice(0,1);
		beat = gameArray[gameID].tracks.first_song[0].split(",")[1];
	}

	//if (beat == null)
	//	clearInterval(gameTimer[gameID]);
	
}


game_server.disconnect = function(socket, username, sio){
	delete player_array[username];
	//socket.leave('gameroom');
	sio.sockets.in('gameroom').emit('player left room', {player: username});
}
