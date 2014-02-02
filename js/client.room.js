var my_game = new game_room(location.hash);

/*
MESSAGE-HANDLING FUNCTIONS
*/

socket.on('gameroom info', function(data){
	var players = data.players;
	var string = "";
	for (var i = 0 ; i < players.length ; i++){
		string += players[i] + "<br>";
		
		var player = new game_player();
		player.username = players[i];
		my_game.players[i] = player;
	}

	document.getElementById("statsInstructions").innerHTML = string;
});

socket.on('gameroom info 2', function(){
	document.getElementById("roomName").innerHTML = "new player joined";
/*
	var new_player = data.new_player;
	var number_of_players = data.number_of_players;

	if (number_of_players > my_game.players.length){
		var player = new game_player();
		player.username = players[i];
		my_game.players.push(player);
		document.getElementById("statsInstructions").innerHTML += new_player + "<br>";
	}
	*/
});

socket.on('your uuid', function(data){
	document.getElementById("roomName").innerHTML = data.uuid;
});

/*
CLIENT SIDE FUNCTIONS
*/

window.onload = function(){
	document.getElementById("roomName").innerHTML = location.hash.split('#')[1];
	requestGameRoomInfo(location.hash.split('#')[1]);
}

function requestGameRoomInfo(roomname){
	socket.emit('requestGameRoomInfo', {roomName : roomname});
}

function getMyUUID(){
	socket.emit('my uuid');
}