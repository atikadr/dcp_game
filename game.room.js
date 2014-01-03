var game_room = function(){
	this.players = {
		player1: new game_player(this),
		player2: new game_player(this),
		player3: new game_player(this)
	};


	//handle connections

	this.socket = io.connect();

	this.socket.on('connect', function(){
		this.socket.send('Hello server');
	});

	//this.socket.on('message', function(data){
		//document.getElementById("player1").innerHTML="Player 2 is here... again";
	//});

	this.socket.on('room connection type?', function(hello){
		document.getElementById("player1").innerHTML="Player 2 is here... again";
		//console.log("client received room connection type");
	});

	this.socket.on('OK', function(hello2){
		document.getElementById("player2").innerHTML="Playerzzz is here... again";
	});
}


var game_player = function(game_instance){
	this.game = game_instance;
	this.state = 'not-connected';
}


game_room.prototype.sendConnectionType = function(){
	this.socket.emit('room connection type', {connection_type: 'create room'});
}

//update function that runs
game_room.prototype.update = function(){
	//document.getElementById("player2").innerHTML="Player 2 is here... again";
	//this.socket.send("hello");
}