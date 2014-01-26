var my_player;
var my_game;

/*
MESSAGE-HANDLING FUNCTIONS
*/

socket.on('onconnected', function(data){
	my_player = new game_player();
	my_player.uuid = data;
	document.getElementById("roomInstructions").innerHTML = my_player.uuid;
});

socket.on('getRooms', function(data){
	var string = "";
	var rooms = data.rooms;

	for (var i = 0 ; i < rooms.length ; i++){
		string += rooms[i] + "<br>";
	}

	document.getElementById("roomList").innerHTML = string;
});


/*
CLIENT SIDE FUNCTIONS
*/

window.onload = function(){
	socket.on('connect', function(){
		socket.send('connected');
	});
	loggedIn();
	getRooms();
}

function loggedIn(){
	socket.emit('login', {username: "myusername"} ); 
}

function createGameRoom(){
	var roomname = document.getElementById("gameroomName").value;
	socket.emit('createGameRoom', {roomName : roomname});
	location.href= '/html/gameroom.html#' + roomname;
}

function joinGameRoom(){
	var roomname = document.getElementById("gameroomName").value;
	socket.emit('joinGameRoom', {roomName : roomname});
	location.href= '/html/gameroom.html#' + roomname;
}

function getRooms(){
	socket.emit('getRooms');
}
