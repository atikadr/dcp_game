var 
	io=require('socket.io'),
	express=require('express'),
	UUID=require('node-uuid'),
	path=require('path'),
	mysql=require('mysql'),
	app = express();

game_server = require('./server/game.server.js');


app.configure(function(){
	app.use(express.static(path.join(__dirname,'')));
});

/*
app.get('/index.html', function(req, res){
	res.sendfile('/index.html', {root: __dirname});
	
	var file = req.params[0];
	res.sendfile(__dirname+'/'+file);
	console.log('asked for index');
});

app.get('/*', function(req, res, next){
	var file = req.params[0];
	res.sendfile(__dirname+'/'+file);
});
*/

var server = require('http').createServer(app).listen(8080);
sio = io.listen(server);

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

	socket.on('my uuid', function(){
		console.log("this client asked for uuid " + socket.userid);
	});
});