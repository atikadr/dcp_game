var my_game = new game_room(location.hash);

/*
MESSAGE-HANDLING FUNCTIONS
*/

socket.on('gameroom info', function(data){
	var players = data.players;
	var string = "";
	for (var i = 0 ; i < players.length ; i++){
		string += players[i] + "<br>";
	}

	document.getElementById("statsInstructions").innerHTML = string;
});

socket.on('gameroom info 2', function(data){
	document.getElementById("debugger2").innerHTML = "Currently " + (data.game) + "players are connected";
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