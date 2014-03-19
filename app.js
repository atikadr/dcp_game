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
var MYSQL_PASS = 'a';
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
	mysql.query('insert into Song (song, beats) values ("' + song + '","' + writeString + '")', 
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
	mysql.query('select beats from Song where song = "' + song + '";', 
		function(err, result, fields){
			if (err) throw err;
			else{
				for (var i in result){
					res.send(200, result[i].beats);
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
app.post('./register/:id',function(req, res){
	var fbid = req.params.id;
	var rfid = req.body;
	mysql.query('select fbid from Player WHERE fbid ="' + fbid + '";',
		function(err, result, fields){
			if (err) throw err;
			else{
				if (result[0] != null){
					mysql.query('update Player set points = 0, rfid = "' + rfid + '" where fbid="' + fbid + '";');
				}
				else{
					mysql.query('insert into Player(fbid, rfid, points) values ("' + fbid + '", "' + rfid + '" , 0);');
				}
			}
		});
});

app.post('./updatePoints/:id', function(req,res){
	var new_points = req.body;
	var rfid = req.params.id;
	mysql.query('update Player set points = points +' + new_points + ' where rfid = "' + rfid + '";');
});

app.get('./getPoints/:id', function(req, res){
	var fbid = req.params.id;
	mysql.query('select fbid from Player WHERE fbid ="' + fbid + '";',
		function(err, result, fields){
			if (err) throw err;
			else{
				if (result[0] != null){
					mysql.query('select points from Player where fbid = "' + fbid + '";', function(err2, result2, fields2){
						if (err2) throw err2;
						else
							res.send(result2[0]);
					});
				}
				else{
					mysql.query('insert into Player(fbid, rfid, points) values ("' + fbid + '", null , 0);', function(err2, result2, fields2){
						if (err2) throw err2;
						else
							res.send(0);
					});
				}
			}
		});
});

*/

/*
	Returns	0 if user is not yet registered
			1 if user has both display name and RFID
			2 if user has no display name but has RFID
			3 if user has display name but no RFID
			4 if user has none
*/

app.get('/login/:id', function(req,res){
	var fbid = req.params.id;
	var powerUpSwitch = req.body;
	mysql.query('select * from Player WHERE fbid ="' + fbid + '";', function(err,result,fields){
		if (err) throw err;
		else{
			if (result[0] == null){ 
				console.log("0");
				res.send(200,'0');
			}
			else {
				if (result[0].rfid != null){
					if (result[0].display_name != null){
						console.log("1");
						res.send(200,result[0].display_name);
					}
					else{
						console.log("2");
						res.send(200,'2');
					}
				}
				else{
					if (result[0].display_name != null){
						console.log("3");
						res.send(200,result[0].display_name);
					}
					else{
						console.log("4");
						res.send(200,'4');
					}
				}

/*
				mysql.query('select highscore from Highscore where fbid ="' + fbid + '";', function(err, result, fields){
					//call game server to add highscore to player
				});
*/
			}
		}
	});
});

// NOTE:  probably you will need to 'simulate' a table with RFID numbers given out. Cross check that table to see whether the RFID is valid or not. Then add if valid

app.post('/register_game/:id', function(req,res){
	var fbid = req.params.id;
	var display_name = req.body.display_name;
	var rfid = req.body.rfid;
	console.log("fbid: "+fbid + "rfid: " + rfid);
	mysql.query('select * from Player where display_name = "' + display_name + '";', function(err, result, fields){
		if (result[0] == null){
			mysql.query('insert into Player (fbid, display_name, rfid, points, ELO) values ("' + fbid + '", "' + display_name + '", "' + rfid + '", 0, 1000);');
			res.send(200);
		}
		else {
			res.send(200, "error");
		}
	});
	
});

app.post('/send_highscore/:id', function(req, res){
	var fbid = req.params.id;
	var song = req.body.song;
	var score = req.body.score;
	mysql.query('select highscore from Highscore where fbid = "' + fbid + '" and song ="' + song + '";', function(err, result, fields){
		if (result[0].highscore != null){
			if (result[0].highscore < score)
				mysql.query('update Highscore set highscore = ' + score + ' where fbid = "' + fbid + '" and song = "' + song + '";');
		}
		else
			mysql.query('update Highscore set highscore = ' + score + ' where fbid = "' + fbid + '" and song = "' + song + '";');
	});
	res.send(200);
});

app.get('/get_highscore/:id', function(req, res){
	var fbid = req.params.id;
	var song = req.body.song;
	mysql.query('select highscore from Highscore where fbid = "' + fbid + '" and song ="' + song + '";', function(err, result, fields){
		if (result[0].highscore != null)
			res.send(200, result[0].highscore.toString());
		else
			res.send(200, "0");
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
		game_server.addPlayer(mysql, sio, socket, data.username); //username stores fbid here
	});

	socket.on('get players', function(data){
		game_server.sendPlayers(socket);
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
		game_server.declineChallenge(mysql, sio, socket.game_id);;
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

	socket.on('test', function(data){
		socket.broadcast.emit('test reply', {message: data});
	});

	socket.on('game ready first song', function(data){
		if (game_server.readyFirstSong(socket.game_id, socket.player))
			game_server.startFirstSong(sio, socket.game_id);		
	});

	socket.on('send score', function(data){
		console.log("score: " +data.score);
		game_server.receiveScore(mysql, socket, data.score, sio);
	});

	socket.on('beat hit or miss', function(data){
		//game_server.sendBeatHit(socket.game_id, socket.player);
	});

	socket.on('my timer', function(data){
		game_server.adjustTimer(socket.player, socket.game_id, data.myTimer);
	});

	socket.on('power up', function(data){
		gameID = socket.game_id;

	});

	socket.on('playerSelectSong',function(data){
		//console.log("client selected song");
		socket.broadcast.emit('song selected',data);
	});
});

