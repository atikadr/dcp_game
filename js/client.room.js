var socket = io.connect();
var my_player;
var my_game;
var temp_string;

/*
MESSAGE-HANDLING FUNCTIONS
*/

socket.on('onconnected', function(data){
	my_player = new game_player();
	my_player.uuid = data;
	//document.getElementById("debugger").innerHTML = my_player.uuid;
});

socket.on('createdGameRoom', function(data){
	roomname = data.roomName;
	document.getElementById("roomName").innerHTML = roomname;
});

socket.on('gameroom info', function(data){
	document.getElementById("debugger").innerHTML = "joined room";

	var number_of_players = data.game;
	my_game.players[number_of_players] = my_player;

	document.getElementById("debugger").innerHTML = "I'm player " + (number_of_players + 1);
});

socket.on('gameroom info 2', function(data){
	document.getElementById("debugger2").innerHTML = "Currently " + (data.game) + "players are connected";
});


/*
CLIENT SIDE FUNCTIONS
*/

window.onload = function(){
	document.getElementById("roomName").innerHTML = location.hash;
}