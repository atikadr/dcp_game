var 
io=require('socket.io'),
express=require('express'),
UUID=require('node-uuid'),
path=require('path'),
mysql=require('mysql'),
fs = require('fs'),
app = express();

game_server = require('./server/game.server.js');

app.use(express.bodyParser());

app.configure(function(){
	app.use(express.static(path.join(__dirname,'')));
});

var server = require('http').createServer(app).listen(8080);
sio = io.listen(server);


app.get('/', function(req, res){
	res.sendfile('/index.html', {root:__dirname});
	console.log(game_server.gameroom_array);
	//res.json(game_server.gameroom_array);
});

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
	socket.userid = UUID();

	socket.on('message', function(){
		console.log('client connected');
	});

	socket.on('login', function(data){
		console.log('client sent login');
		console.log(data.username);
		
		socket.emit('onconnected', socket.userid);

		game_server.createPlayer(socket, data.username, socket.userid);
	});

	socket.on('createGameRoom', function(data){
		game_server.createGameRoom(data.roomName, socket);
		console.log('client created new game');
	});

	socket.on('joinGameRoom', function(data){
		game_server.joinGameRoom(data.roomName, socket, sio);
		console.log('client join game room');
	});

	socket.on('requestGameRoomInfo', function(data){
		game_server.sendRoomInfo(socket, data.roomName);
	});

	socket.on('getRooms', function(){
		game_server.sendRooms(socket);
	});
});