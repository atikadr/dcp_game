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
var MYSQL_USER = 'root';
var MYSQL_PASS = 'bubumint';
var DATABASE = 'dcp_game';

var mysql = _mysql.createConnection({
	host: HOST,
	port: PORT,
	user: MYSQL_USER,
	password: MYSQL_PASS
});

mysql.connect();

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

app.post('/saveTrack/:id', function(req,res){
	var song = req.params.id;
	var musicArray = req.body.musicArray;
	var writeString = "";
	for(var i = 0 ; i < musicArray.length ; i++){
		writeString += musicArray[i].type+","+musicArray[i].timing+"\n";
	}
	console.log(writeString);

	var newsongid = UUID();
	mysql.query('insert into Song (songid, song, beats) values ("' + newsongid + '","' + song + '","' + writeString + '")', 
		function(err, results, fields){
			if (err) throw err;
			else res.send('song stored in database');
		});
});

app.get('/getTrack',function(req,res){
	fs.readFile('beats/test.txt','utf8',function(err,data){
		console.log(data);
		res.write(data);
		res.end();
	});
});

app.get('/getTrack/:id',function(req,res){
	var song = req.params.id;
	mysql.query('select * from Song where song = "' + song + '"', 
		function(err, result, fields){
			if (err) throw err;
			else{
				for (var i in result){
					res.send(result[i].beats);
				}
			}
		});
});

app.get('/songList', function(req,res){
	mysql.query('select song, stars from Song', 
		function(err, result, fields){
			if (err) throw err;
			else {
				var toSend = new Array();
				var songName, stars;
				for (var i in result){
					songName = result[i].song;
					stars = result[i].stars;
					toSend.push({song: songName, number_of_stars: stars});
				}
				res.send(toSend);
			}
		});
});

/*
BRUTE FORCE TESTING CODE
*/

//game_server.newGame('testingGame');


console.log("listening");


sio.sockets.on('connection', function(socket){

	//call after player loads the gameroom
	//player must emit {username: my username}
	//function emits 'get players' {players: array of player sockets} to client
	//function broadcasts 'new player joined room' {player: username}
	//not implemented with REST API becuase it is hard to detect users that disconnect?
	socket.on('join room', function(data){
		game_server.addPlayer(sio, socket, data.username);
	});

	//call when a player clicks to challenge another in the gameroom
	//player must emit {challenger: my username, challenged: the other's username}
	//function emits 'new challenger' to challenged
	socket.on('challenge', function(data){
		game_server.challenge(sio, socket, data.challenger, data.challenged);
		//challenge must be sent first before disconnection
	});

	//call when a player accepts the challenge
	//player must emit {challenger: the other's username, challenged: my username}
	//function emits 'challenge accepted' to challenger
	//function emits 'your game id' {game_id: the id} to both
	//in the future, game id will be stored in a cookie
	socket.on('accept challenge', function(){
		game_server.acceptChallenge(sio, socket.game_id);
	});

	//call when a player accepts the challenge
	//player must emit {game_id: gameID}
	//function emits 'challenge not accepted' to challenger
	socket.on('decline challenge', function(){
		game_server.declineChallenge(sio, socket.game_id);;
	});

	socket.on('get opponent name', function(){
		game_server.sendOpponentName(socket, socket.game_id, socket.username);
	});

	//call when a player chooses his song
	//player must emit {song: choice of music}
	socket.on('set song', function(data){
		game_server.setSong(sio, mysql, socket.game_id, socket.player, data.song);
		sio.sockets.in(socket.game_id).emit('player set song', {player: socket.username, song: data.song});
	});

	//
	socket.on('roulette', function(data){
		game_server.roulette(socket, data);
	});


	socket.on('disconnect', function(){
		//check if this user is part of gameroom
		game_server.disconnect(socket, socket.username, sio);
	});

/*
	socket.on('disconnect',function(){
		playerCount = 0;
		clearInterval(gameTimer);
	});


socket.on('test', function(data){
	socket.broadcast.emit('test reply', {message: data});
});

socket.on('test join', function(data){
	socket.join('testingGame');
	game_server.joinGame(socket, 'testing username', 'testingGame');
});
*/

	socket.on('game ready first song', function(data){
		//sio.sockets.emit('startGame');
		if (game_server.readyFirstSong(socket.game_id, socket.player)){
			game_server.startFirstSong(sio, socket.game_id);
		}

/*
	fs.readFile('beats/test.txt','utf8',function(err,data){
		trackData = data.split("\n");
		console.log(trackData);
	});
*/
		
	});

	socket.on('playerSelectSong',function(data){
		socket.broadcast.emit('song selected',data);
	});
});

