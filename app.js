var 
	io=require('socket.io'),
	express=require('express'),
	UUID=require('node-uuid'),
	path=require('path'),
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
		console.log('client just sent something');
		game_server.onMessage(socket, m);
	});

	//initialise the game room
	game_server.connectClient(socket);

	
	socket.on('room connection type', function(connection_type){
		socket.emit('OK', {hello2: 'world2'});
	});
});