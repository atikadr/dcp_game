var playerName = Math.floor(Math.random()*10000);

function setupGameRoom(){
	joinRoom();
}

function joinRoom(){
	socket.emit('join room',{username:playerName});
}

socket.on('get players',function(data){
	console.log(data);
});

socket.on('new player joined room',function(data){
	// check if new player is not me
	console.log(data);
});

socket.on('challenge accepted',function(data){
	console.log(data); // game ID
});

socket.on('challenge not accepted',function(data){
	console.log("You have no friends");
});

function challengePlayer(username){
	socket.emit('challenge',{challenger:playerName,challenged:username});
}