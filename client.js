var socket = io.connect();
var my_player;
var my_game;

/*
MESSAGE-HANDLING FUNCTIONS
*/

socket.on('onconnected', function(data){
	my_player = new game_player();
	my_player.uuid = data;
	document.getElementById("debugger").innerHTML = my_player.uuid;
});

socket.on('gameroom info', function(data){
	document.getElementById("debugger").innerHTML = "joined room";

	var number_of_players = data.game;
	//my_game.players[number_of_players] = my_player;

	document.getElementById("debugger").innerHTML = "I'm player " + (number_of_players + 1);
});



/*
CLIENT SIDE FUNCTIONS
*/

window.onload = function(){
	socket.on('connect', function(){
		socket.send('connected');
	});
	loggedIn();
}

function createGameRoom(){
	my_game = new game_room("my game room");
	my_game.players[0]= my_player;
	my_game.player_count++;

	document.getElementById("debugger").innerHTML = "created a new game room<br>I'm player 1 -- the host";
	
	socket.emit('createGameRoom', {roomname : "my game room"});
}

function joinGameRoom(){
	my_game = new game_room("my game room");

	socket.emit('joinGameRoom', {roomname : "my game room"});
}

function loggedIn(){
	socket.emit('login', {username: "myusername"} ); 
}
