var playersArray;

var box1, box2, box3, box4, box5;
var playerName1,playerName2,playerName3,playerName4,playerName5;

var playerNamesArray = new Array();
var playerBoxArray = new Array();

var selectedPlayer;
var pageNumber;

var isChallenged;

function setupGameRoom(){
	gameScene = "gameRoom";
	//playerName = localStorage.displayName;
	isChallenged = false;
	playerNamesArray.splice(0,playerNamesArray.length);
	playerBoxArray.splice(0,playerBoxArray.length);
	currentPlayer = 0;
	clearScreen();
	joinRoom();
}

function joinRoom(){
	//console.log(localStorage.displayName);
	socket.emit('join room',{username:playerName});

	// populate elements
	var gameRoomBox = cc.Sprite.create("../images/gameRoomBox.png");
	gameRoomBox.setPosition(new cc.Point(canvasWidth/2,350));
	gameLayer.addChild(gameRoomBox);

	var lobbyWord = cc.LabelTTF.create("Lobby","HelveticaNeue-Light",40,cc.size(250,36),cc.kCCTextAlignmentLeft);
	lobbyWord.setPosition(new cc.Point(180,625));
	gameLayer.addChild(lobbyWord);

	box1 = cc.Sprite.create("../images/boxBackground.png");
	box1.setPosition(new cc.Point(canvasWidth/2, 525));
	gameLayer.addChild(box1);

	box2 = cc.Sprite.create("../images/boxBackground.png");
	box2.setPosition(new cc.Point(canvasWidth/2, 420));
	gameLayer.addChild(box2);

	box3 = cc.Sprite.create("../images/boxBackground.png");
	box3.setPosition(new cc.Point(canvasWidth/2, 315));
	gameLayer.addChild(box3);

	box4 = cc.Sprite.create("../images/boxBackground.png");
	box4.setPosition(new cc.Point(canvasWidth/2, 210));
	gameLayer.addChild(box4);

	box5 = cc.Sprite.create("../images/boxBackground.png");
	box5.setPosition(new cc.Point(canvasWidth/2, 105));
	gameLayer.addChild(box5);

	box1.setOpacity(100);
	box2.setOpacity(100);
	box3.setOpacity(100);
	box4.setOpacity(100);
	box5.setOpacity(100);

	playerBoxArray.push(box1);
	playerBoxArray.push(box2);
	playerBoxArray.push(box3);
	playerBoxArray.push(box4);
	playerBoxArray.push(box5);

	playerName1 = cc.LabelTTF.create("Name","HelveticaNeue-UltraLight",40,cc.size(250,36),cc.kCCTextAlignmentLeft);
	playerName1.setPosition(new cc.Point(200,530));
	gameLayer.addChild(playerName1);
	playerName2 = cc.LabelTTF.create("Name","HelveticaNeue-UltraLight",40,cc.size(250,36),cc.kCCTextAlignmentLeft);
	playerName2.setPosition(new cc.Point(200,425));
	gameLayer.addChild(playerName2);
	playerName3 = cc.LabelTTF.create("Name","HelveticaNeue-UltraLight",40,cc.size(250,36),cc.kCCTextAlignmentLeft);
	playerName3.setPosition(new cc.Point(200,320));
	gameLayer.addChild(playerName3);
	playerName4 = cc.LabelTTF.create("Name","HelveticaNeue-UltraLight",40,cc.size(250,36),cc.kCCTextAlignmentLeft);
	playerName4.setPosition(new cc.Point(200,215));
	gameLayer.addChild(playerName4);
	playerName5 = cc.LabelTTF.create("Name","HelveticaNeue-UltraLight",40,cc.size(250,36),cc.kCCTextAlignmentLeft);
	playerName5.setPosition(new cc.Point(200,110));
	gameLayer.addChild(playerName5);

	playerNamesArray.push(playerName1);
	playerNamesArray.push(playerName2);
	playerNamesArray.push(playerName3);
	playerNamesArray.push(playerName4);
	playerNamesArray.push(playerName5);

	pageNumber = cc.LabelTTF.create("Number","HelveticaNeue-UltraLight",26,cc.size(250,36),cc.kCCTextAlignmentLeft);
	pageNumber.setPosition(new cc.Point(300,608));
	gameLayer.addChild(pageNumber);
}

function updateSelectedPlayer(){
	console.log(currentPlayer);
	var selectedPosition = currentPlayer%5;
	for(var i = 0 ; i < playerNamesArray.length ; i++){
		playerNamesArray[i].setColor(new cc.Color4B(255,255,255,255));
	}
	playerNamesArray[selectedPosition].setColor(new cc.Color4B(100,100,100,255));
	console.log(playerNamesArray[selectedPosition]);
}

function updatePageNumber(currentPlayer){
	currentPlayer++;
	var totalPages = Math.ceil(playersArray.length/5);
	var currentPage = Math.ceil(currentPlayer/5);
	pageNumber.setString("Page " + currentPage + "/" + totalPages);
}

function displayPlayers(startIndex){
	updatePageNumber(startIndex);
	startIndex = 5*Math.floor(startIndex/5);
	var endIndex = startIndex+5;
	for(var i = 0 ; i < playerNamesArray.length ; i++){
		playerNamesArray[i].setOpacity(0);
	}
	for(var i = 0 ; i < playerBoxArray.length ; i++){
		playerBoxArray[i].setOpacity(0);
	}
	if(endIndex > playersArray.length){
		endIndex = playersArray.length;
	}
	var index = 0;
	for(var i = startIndex ; i < endIndex ; i++){
		playerNamesArray[index].setString(playersArray[i]);
		playerNamesArray[index].setOpacity(255);
		playerBoxArray[index].setOpacity(100);
		index++;
	}
	updateSelectedPlayer();
}

socket.on('player left room',function(data){
	console.log(data);
	for(var i = 0 ; i < playersArray.length ; i++){
		if(playersArray[i] == data.player){
			if(playersArray[currentPlayer] == data.player && playersArray.length > 1){
				currentPlayer--;
			}
			playersArray.splice(i,1);
			displayPlayers(currentPlayer);
		}
	}
});

var waitOverlay;
var waitOverlayText;

function addChallengeWaitOverlay(){
	clickEnabled = false;
	waitOverlay = cc.LayerColor.create(new cc.Color4B(0,0,0,160), canvasWidth, canvasHeight);
	waitOverlayText = cc.LabelTTF.create("","HelveticaNeue",40,cc.size(650,36),cc.TEXT_ALIGNMENT_CENTER);
	waitOverlayText.setString("Waiting for opponent response");
	waitOverlayText.setPosition(new cc.Point(canvasWidth/2,canvasHeight/2+50));
	gameLayer.addChild(waitOverlay);
	gameLayer.addChild(waitOverlayText);
}

function removeWaitOverlay(){
	gameLayer.removeChild(waitOverlay);
	gameLayer.removeChild(waitOverlayText);
}

socket.on('get players',function(data){
	playersArray = data.players;
	displayPlayers(currentPlayer);
});

socket.on('new player joined room',function(data){
	// check if new player is not me
	console.log(data);
	playersArray.push(data.player);
	displayPlayers(currentPlayer);
});

socket.on('challenge not accepted',function(data){
	console.log("You have no friends :(");
		removeWaitOverlay();
	});


socket.on('your game id',function(data){
	console.log("your game id");
	clickEnabled = true;
	gameID = data.game_id;
	setupSongSelection();
});

function challengePlayer(){
	console.log(currentPlayer);
	if(playersArray.length > 0){
		addChallengeWaitOverlay();
		socket.emit('challenge',{challenger:playerName,challenged:playersArray[currentPlayer]});
	}
}