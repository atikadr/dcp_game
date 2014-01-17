var 
	io=require('socket.io'),
	express=require('express'),
	UUID=require('node-uuid'),
	path=require('path'),
	mysql=require('mysql'),
	app = express();

app.configure(function(){
	//app.use(express.logger('dev'));

	app.use(express.static(path.join(__dirname,'')));
});

var server = require('http').createServer(app).listen(8080);
sio = io.listen(server);

app.get('/', function(req, res){
	res.sendfile('/index.html', {root:__dirname});
});

game_server = require('./game.server.js');

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
		game_server.createGameRoom(data.roomname, socket.userid);
		console.log('client created new game');
	});

	socket.on('joinGameRoom', function(data){
		game_server.joinGameRoom(data.roomname, socket);
		console.log('join game room');
	});
});