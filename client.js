var socket = io.connect();
var player;

/*
MESSAGE-HANDLING FUNCTIONS
*/

socket.on('onconnected', function(data){
	player = new game_player();
	player.uuid = data;
	document.getElementById("debugger").innerHTML = player.uuid;
});

socket.on('player type', function(data){
	document.getElementById("debugger").innerHTML = "joined room";
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
	var game = new game_room("my game room");
	game.players.player1= player;
	game.player_count++;

	document.getElementById("debugger").innerHTML = "created a new game room<br>player1:" + player.uuid;
	
	socket.emit('createGameRoom', {roomname : "my game room"});
}

function joinGameRoom(){
	var game = new game_room("my game room");

	socket.emit('joinGameRoom', {roomname : "my game room"});
}

function loggedIn(){
	socket.emit('login', {username: "myusername"} ); 
}
