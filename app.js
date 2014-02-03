var 
io=require('socket.io'),
express=require('express'),
UUID=require('node-uuid'),
path=require('path'),
_mysql=require('mysql'),
fs = require('fs'),
app = express();

var HOST = 'localhost';
var PORT = 3306;
var MYSQL_USER = 'nodehacker';
var MYSQL_PASS = 'lulwut';
var DATABASE = 'nodedb';
var TABLE = 'gadgets';

var mysql = _mysql.createClient({
    host: HOST,
    port: PORT,
    user: MYSQL_USER,
    password: MYSQL_PASS
});

mysql.query('use ' + DATABASE);

var game_server = require('./server/game.server.js');
//var game_core = require('./game.core.js');
//var room_players = require('./routes/players');

app.use(express.bodyParser());

app.configure(function(){
	app.use(express.static(path.join(__dirname,'')));
});

var server = require('http').createServer(app).listen(8080);
sio = io.listen(server);

app.post('/saveTrack',function(req,res){
	var musicArray = req.body.musicArray;
	var writeString = "";
	for(var i = 0 ; i < musicArray.length ; i++){
		writeString += musicArray[i].type+","+musicArray[i].timing+"\n";
	}
	console.log(writeString);
	fs.writeFile('beats/test.txt', writeString, function (err) {
		if (err) return console.log(err);
	});
});

app.get('/getTrack',function(req,res){
	fs.readFile('beats/test.txt','utf8',function(err,data){
		console.log(data);
		res.write(data);
		res.end();
	});
});

console.log("listening");

sio.sockets.on('connection', function(socket){

	//call after player loads the gameroom
	//player must emit {username: my username}
	//function emits 'get players' {players: array of player sockets} to client
	//function broadcasts 'new player joined room' {player: username}
	//not implemented with REST API becuase it is hard to detect users that disconnect?
	socket.on('join room', function(data){
		socket.join('gameroom');
		game_server.addPlayer(socket, data.username);
		sio.sockets.in('gameroom').emit('new player joined room', {player: data.username});
	});

	//call when a player clicks to challenge another in the gameroom
	//player must emit {challenger: my username, challenged: the other's username}
	//function emits 'new challenger' to challenged
	socket.on('challenge', function(data){
		game_server.challenge(data.challenger, data.challenged);
	});

	//call when a player accepts the challenge
	//player must emit {challenger: the other's username, challenged: my username}
	//function emits 'challenge accepted' to challenger
	//function emits 'your game id' {game_id: the id} to both
	//in the future, game id will be stored in a cookie
	socket.on('accept challenge', function(data){
		var gameID = UUID();
		game_server.acceptChallenge(data.challenger, data.challenged, gameID);
		socket.emit('your game id', {game_id: game});
	});

	//call after player loads the game page
	//player must emit {username: my username, game_id: the given game id}
	//function broadcasts 'players connected' when both players are connected
	socket.on('setup game', function(data){
		socket.join(data.game_id);
		game_server.joinGame(socket, data.username, data.game_id);
	});

	socket.on('disconnect', function(){
		//check if this user is part of gameroom
		game_server.disconnect(socket);
	});
});