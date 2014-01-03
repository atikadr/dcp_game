require('./game.room.js');

var game_server = module.exports = {games: {}, game_count:0};


game_server.connectClient = function(client){
	client.emit('room connection type?', {hello: 'world'});
	client.on('room connection type', function(connection_type){
		console.log("client just sent room connection type ");
	});
}

game_server.createGame = function(player) {
	var thegame = {
		player1: player,
		player2: null,
		player_count:1
	};
}

game_server.onMessage = function(client, message){
	console.log(message);
	

	//console.log("server is sending");
	//client.send("world!");
}