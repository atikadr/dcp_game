var playerName = Math.floor(Math.random()*10000); // for testing only

socket.on('new challenger',function(data){
	console.log(data);
	socket.emit('accept challenge'); // if accept
	//socket.emit('decline challenge') // if decline
});

function clearScreen(){
	var childrenArray = gameLayer.getChildren();
	while(childrenArray.length > 1){
		console.log(childrenArray[1]);
		gameLayer.removeChild(childrenArray[1]);
	}
	console.log(childrenArray);
}

var gameScene = "gameRoom";

var gamescene = cc.Scene.extend({
	onEnter:function(){
		this._super();
		var layer = new gamesceneGame();
		layer.init();
		this.addChild(layer);
	}
})

// global variables
var gameLayer;

var backgroundImage;

var gameID;

var gamesceneGame = cc.Layer.extend({
	init:function(){
		// original scene init functions
		canvasWidth = parseInt($("#gameCanvas").css("width"));
		canvasHeight = parseInt($("#gameCanvas").css("height"));
		this._super();
		this.setMouseEnabled(true);
		this.setKeyboardEnabled(true);
		gameLayer = cc.LayerColor.create(new cc.Color4B(0, 51, 102, 255), canvasWidth, canvasHeight);
		backgroundImage = cc.Sprite.create('../images/background.png');
		backgroundImage.tag = "backgroundImage";
		gameLayer.addChild(backgroundImage);
		backgroundImage.setPosition(new cc.Point(canvasWidth/2,canvasHeight/2));
		this.addChild(gameLayer);
		//setupGamePlay();
		//setupStartScreen();
		//setupSongSelection();
		setupGameRoom();
		return true;
	},
	onKeyUp:function(event){
		if(event == 90){
			socket.emit('test',{beat:"redUp",totalCombo:totalCombo,score:score});
			hitBox1.setOpacity(0);
		}
		if(event == 88){
			socket.emit('test',{beat:"blueUp",totalCombo:totalCombo,score:score});
			hitBox2.setOpacity(0);
		}
		if(event == 188){
			socket.emit('test',{beat:"purpleUp",totalCombo:totalCombo,score:score});
			hitBox3.setOpacity(0);
		}
		if(event == 190){
			socket.emit('test',{beat:"greenUp",totalCombo:totalCombo,score:score});
			hitBox4.setOpacity(0);
		}
	},
	onKeyDown:function(event){
		console.log(event);
		if(gameScene == "multiplayer"){
			if(event == 32){ 
				for(var i = 0 ; i < gameSpritesArray.length ; i++){
					if(gameSpritesArray[i].tag == "playButton"){
						gameLayer.removeChild(gameSpritesArray[i]);
						socket.emit('game ready');
						startMusicPlay();
					}
				}
			}
			if(event == 90){
				hitBox1.setOpacity(255);
				for(var i = 0 ; i < beatsArray.length ; i++){
					if(cc.Rect.CCRectIntersectsRect(beatsArray[i].getBoundingBox(),whitebox1.getBoundingBox()) === true){
						if(beatsArray[i].type == "red"){
							gameLayer.removeChild(beatsArray[i]);
							beatsArray.splice(i,1);
							score += 100;
							totalCombo++;
							comboLabel.setString(totalCombo);
							comboLabel.setOpacity(255);
							scoreLabel.setString("Score: " + score);

						}
					}
				}
				socket.emit('test',{beat:"red",totalCombo:totalCombo,score:score});
			}
			if(event == 88){
				hitBox2.setOpacity(255);
				for(var i = 0 ; i < beatsArray.length ; i++){
					if(cc.Rect.CCRectIntersectsRect(beatsArray[i].getBoundingBox(),whitebox2.getBoundingBox()) === true){
						if(beatsArray[i].type == "blue"){
							gameLayer.removeChild(beatsArray[i]);
							beatsArray.splice(i,1);
							score += 100;
							totalCombo++;
							comboLabel.setString(totalCombo);
							comboLabel.setOpacity(255);
							scoreLabel.setString("Score: " + score);

						}
					}
				}
				socket.emit('test',{beat:"blue",totalCombo:totalCombo,score:score});
			}
			if(event == 188){
				hitBox3.setOpacity(255);
				for(var i = 0 ; i < beatsArray.length ; i++){
					if(cc.Rect.CCRectIntersectsRect(beatsArray[i].getBoundingBox(),whitebox3.getBoundingBox()) === true){
						if(beatsArray[i].type == "purple"){
							gameLayer.removeChild(beatsArray[i]);
							beatsArray.splice(i,1);
							score += 100;
							totalCombo++;
							comboLabel.setString(totalCombo);
							comboLabel.setOpacity(255);
							scoreLabel.setString("Score: " + score);

						}
					}
				}
				socket.emit('test',{beat:"purple",totalCombo:totalCombo,score:score});
			}
			if(event == 190){
				hitBox4.setOpacity(255);
				for(var i = 0 ; i < beatsArray.length ; i++){
					if(cc.Rect.CCRectIntersectsRect(beatsArray[i].getBoundingBox(),whitebox4.getBoundingBox()) === true){
						if(beatsArray[i].type == "green"){
							gameLayer.removeChild(beatsArray[i]);
							beatsArray.splice(i,1);
							score += 100;
							totalCombo++;
							comboLabel.setString(totalCombo);
							comboLabel.setOpacity(255);
							scoreLabel.setString("Score: " + score);

						}
					}
				}
				socket.emit('test',{beat:"green",totalCombo:totalCombo,score:score});
			}
		}
		if(gameScene == "startScreen"){
			console.log(event);
			if(event == 38){
				switch(modeSelected){
					case "multiplayer":
					modeSelected = "singleplayer";
					break;
					case "jamsession":
					modeSelected = "multiplayer";
					break;
					case "settings":
					modeSelected = "jamsession";
					default:
					break;
				}
			}
			if(event == 40){
				switch(modeSelected){
					case "singleplayer":
					modeSelected = "multiplayer";
					break;
					case "multiplayer":
					modeSelected = "jamsession";
					break;
					case "jamsession":
					modeSelected = "settings";
					default:
					break;
				}
			}
			if(event == 32){
				if(modeSelected == "multiplayer"){
					gameScene = "multiplayer";
					setupGameRoom()
				}
			}
			repositionDot();
		}
		if(gameScene == "songSelection"){
			if(event == 40 && selected == false){
				myCurrentSelection = (myCurrentSelection+1)%songsArray.length;
				slot1.setString(songsArray[myCurrentSelection].song+"\n"+songsArray[myCurrentSelection].number_of_stars);
				slot2.setString(songsArray[(myCurrentSelection+1)%songsArray.length].song+"\n"+songsArray[(myCurrentSelection+1)%songsArray.length].number_of_stars);
				slot3.setString(songsArray[(myCurrentSelection+2)%songsArray.length].song+"\n"+songsArray[(myCurrentSelection+2)%songsArray.length].number_of_stars);
				slot4.setString(songsArray[(myCurrentSelection+3)%songsArray.length].song+"\n"+songsArray[(myCurrentSelection+3)%songsArray.length].number_of_stars);
				slot5.setString(songsArray[(myCurrentSelection+4)%songsArray.length].song+"\n"+songsArray[(myCurrentSelection+4)%songsArray.length].number_of_stars);

				socket.emit("playerSelectSong",{currentSong:myCurrentSelection,selectedSong:null});
			}
			if(event == 38 && selected == false){
				myCurrentSelection--;
				if(myCurrentSelection < 0){
					myCurrentSelection = songsArray.length-1;
				}
				slot1.setString(songsArray[myCurrentSelection].song+"\n"+songsArray[myCurrentSelection].number_of_stars);
				slot2.setString(songsArray[(myCurrentSelection+1)%songsArray.length].song+"\n"+songsArray[(myCurrentSelection+1)%songsArray.length].number_of_stars);
				slot3.setString(songsArray[(myCurrentSelection+2)%songsArray.length].song+"\n"+songsArray[(myCurrentSelection+2)%songsArray.length].number_of_stars);
				slot4.setString(songsArray[(myCurrentSelection+3)%songsArray.length].song+"\n"+songsArray[(myCurrentSelection+3)%songsArray.length].number_of_stars);
				slot5.setString(songsArray[(myCurrentSelection+4)%songsArray.length].song+"\n"+songsArray[(myCurrentSelection+4)%songsArray.length].number_of_stars);

				socket.emit("playerSelectSong",{currentSong:myCurrentSelection,selectedSong:null});
			}
			if(event == 32){
				selected = true;
				var selection = (myCurrentSelection+2)%songsArray.length;
				selectedText.setString(songsArray[selection].song);

				slot1.setColor(new cc.Color4B(172,172,172,255));
				slot2.setColor(new cc.Color4B(172,172,172,255));
				slot3.setColor(new cc.Color4B(172,172,172,255));
				slot4.setColor(new cc.Color4B(172,172,172,255));
				slot5.setColor(new cc.Color4B(172,172,172,255));

				gameLayer.removeChild(mySelection);

				socket.emit("playerSelectSong",{currentSong:myCurrentSelection,selectedSong:selection});
			}
		}
		if(gameScene == "gameRoom"){
			if(event == 39){ // right
				currentPlayer += 5;
				if(currentPlayer >= playersArray.length){
					currentPlayer = playersArray.length - 1;
				}
				displayPlayers(currentPlayer);
			}
			if(event == 37){ // left
				currentPlayer -= 5;
				if(currentPlayer < 0){
					currentPlayer = 0;
				}
				displayPlayers(currentPlayer);
			}
			if(event == 38){ // up
				if(currentPlayer > 0){
					currentPlayer--;
				}
				displayPlayers(currentPlayer);
			}
			if(event == 40){ // down
				if(currentPlayer < (playersArray.length-1)){
					currentPlayer++;
				}
				displayPlayers(currentPlayer);
			}
			if(event == 89 && isChallenged){
				isChallenged = false;
				socket.emit('accept challenge');
			}
			if(event == 32){
				challengePlayer();
			}
		}
	}
});