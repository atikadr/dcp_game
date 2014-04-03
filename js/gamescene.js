var playerName = Math.floor(Math.random()*10); // for testing only

var gameChallengeOverlay;
var gameChallengeOverlayText;

function clearScreen(){
	var childrenArray = gameLayer.getChildren();
	while(childrenArray.length > 1){
		gameLayer.removeChild(childrenArray[1]);
	}
}


socket.on('new challenger',function(data){
	var challengerName = data.username;
	isChallenged = true;
	addChallengeOverlay(data.username);
});

var gameScene = "startScreen";
var prevScene = new Array();

var gamescene = cc.Scene.extend({
	onEnter:function(){
		this._super();
		var layer = new gamesceneGame();
		layer.init();
		this.addChild(layer);
	}
});

function addChallengeOverlay(challengerName){
	clickEnabled = false;
	gameChallengeOverlay = cc.LayerColor.create(new cc.Color4B(0,0,0,160), canvasWidth, canvasHeight);
	gameChallengeOverlayText = cc.LabelTTF.create("","HelveticaNeue",40,cc.size(650,36),cc.TEXT_ALIGNMENT_CENTER);
	gameChallengeOverlayText.setString(challengerName + " challenged you.\n Accept?(Y/N)");
	gameChallengeOverlayText.setPosition(new cc.Point(canvasWidth/2,canvasHeight/2+50));
	gameLayer.addChild(gameChallengeOverlay);
	gameLayer.addChild(gameChallengeOverlayText);
}

function removeChallengeOverlay(){
	clickEnabled = true;
	gameLayer.removeChild(gameChallengeOverlay);
	gameLayer.removeChild(gameChallengeOverlayText);
}

// global variables
var gameLayer;

var backgroundImage;

var gameID;

var clickEnabled;

var gamesceneGame = cc.Layer.extend({
	init:function(){
		// original scene init functions
		clickEnabled = true;
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
		setupStartScreen();
		//setupSongSelection();
		//setupGameRoom();
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
		//console.log(event);
		if(clickEnabled){
			if(gameScene == "multiplayer"){
				if(event == 90){
					hitBox1.setOpacity(255);
					for(var i = 0 ; i < beatsArray.length ; i++){
						if(cc.Rect.CCRectIntersectsRect(beatsArray[i].getBoundingBox(),whitebox1.getBoundingBox()) === true){
							if(beatsArray[i].type == "red"){
								gameLayer.removeChild(beatsArray[i]);
								beatsArray.splice(i,1);
								var extraPoints = parseInt(beatsArray[i].extraPoints)*100;
								score += parseInt(beatsArray[i].points + extraPoints);
								console.log("s: " + score);
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
								var extraPoints = parseInt(beatsArray[i].extraPoints)*100;
								score += parseInt(beatsArray[i].points + extraPoints);
								console.log("s: " + score);
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
								var extraPoints = parseInt(beatsArray[i].extraPoints)*100;
								score += parseInt(beatsArray[i].points + extraPoints);
								console.log("s: " + score);
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
								var extraPoints = parseInt(beatsArray[i].extraPoints)*100;
								score += parseInt(beatsArray[i].points + extraPoints);
								console.log("s: " + score);
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
			else if(gameScene == "startScreen"){
				if(event == 38){
					switch(modeSelected){
						case "multiplayer":
						modeSelected = "singleplayer";
						break;
						case "leaderboard":
						modeSelected = "multiplayer";
						break;
						case "settings":
						modeSelected = "leaderboard";
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
						modeSelected = "leaderboard";
						break;
						case "leaderboard":
						modeSelected = "settings";
						default:
						break;
					}
				}
				if(event == 32){
					if(modeSelected == "multiplayer"){
						prevScene.push(gameScene);
						gameScene = "multiplayer";
						setupGameRoom()
					}
					if(modeSelected == "singleplayer"){
						prevScene.push(gameScene);
						setupSingleSongSelection();
					}
					if(modeSelected == "leaderboard"){
						prevScene.push(gameScene);
						setupLeaderboard();
					}
				}
				repositionDot();
			}
			else if(gameScene == "songSelection"){
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
					var emitSelection = songsArray[selection].song;
					console.log(emitSelection);
					socket.emit('set song',{song:emitSelection});
				}
			}
			else if(gameScene == "singleSongSelection"){
				if(event == 40 && selected == false){
					myCurrentSelection = (myCurrentSelection+1)%singleSongsArray.length;
					singleSlot1.setString(singleSongsArray[myCurrentSelection].song+"\n"+singleSongsArray[myCurrentSelection].number_of_stars);
					singleSlot2.setString(singleSongsArray[(myCurrentSelection+1)%singleSongsArray.length].song+"\n"+singleSongsArray[(myCurrentSelection+1)%singleSongsArray.length].number_of_stars);
					singleSlot3.setString(singleSongsArray[(myCurrentSelection+2)%singleSongsArray.length].song+"\n"+singleSongsArray[(myCurrentSelection+2)%singleSongsArray.length].number_of_stars);
					singleSlot4.setString(singleSongsArray[(myCurrentSelection+3)%singleSongsArray.length].song+"\n"+singleSongsArray[(myCurrentSelection+3)%singleSongsArray.length].number_of_stars);
					singleSlot5.setString(singleSongsArray[(myCurrentSelection+4)%singleSongsArray.length].song+"\n"+singleSongsArray[(myCurrentSelection+4)%singleSongsArray.length].number_of_stars);

					socket.emit("playerSelectSong",{currentSong:myCurrentSelection,selectedSong:null});
				}
				if(event == 38 && selected == false){
					myCurrentSelection--;
					if(myCurrentSelection < 0){
						myCurrentSelection = singleSongsArray.length-1;
					}
					singleSlot1.setString(singleSongsArray[myCurrentSelection].song+"\n"+singleSongsArray[myCurrentSelection].number_of_stars);
					singleSlot2.setString(singleSongsArray[(myCurrentSelection+1)%singleSongsArray.length].song+"\n"+singleSongsArray[(myCurrentSelection+1)%singleSongsArray.length].number_of_stars);
					singleSlot3.setString(singleSongsArray[(myCurrentSelection+2)%singleSongsArray.length].song+"\n"+singleSongsArray[(myCurrentSelection+2)%singleSongsArray.length].number_of_stars);
					singleSlot4.setString(singleSongsArray[(myCurrentSelection+3)%singleSongsArray.length].song+"\n"+singleSongsArray[(myCurrentSelection+3)%singleSongsArray.length].number_of_stars);
					singleSlot5.setString(singleSongsArray[(myCurrentSelection+4)%singleSongsArray.length].song+"\n"+singleSongsArray[(myCurrentSelection+4)%singleSongsArray.length].number_of_stars);

					socket.emit("playerSelectSong",{currentSong:myCurrentSelection,selectedSong:null});
				}
				if(event == 32){
					selected = true;
					var selection = (myCurrentSelection+2)%singleSongsArray.length;
					selectedText.setString(singleSongsArray[selection].song);

					singleSlot1.setColor(new cc.Color4B(172,172,172,255));
					singleSlot2.setColor(new cc.Color4B(172,172,172,255));
					singleSlot3.setColor(new cc.Color4B(172,172,172,255));
					singleSlot4.setColor(new cc.Color4B(172,172,172,255));
					singleSlot5.setColor(new cc.Color4B(172,172,172,255));

					gameLayer.removeChild(mySelection);
					prevScene.push(gameScene);
					setupSingleGamePlay(singleSongsArray[selection].song);
				}
			}
			else if(gameScene == "gameRoom"){
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
			if(event == 32){
				challengePlayer();
			}
		}
		else if(gameScene == "singlePlayer"){
			if(event == 32){ 
				for(var i = 0 ; i < gameSpritesArray.length ; i++){
					if(gameSpritesArray[i].tag == "playButton"){
						gameLayer.removeChild(gameSpritesArray[i]);
						gameSpritesArray.splice(i,1);
						getSongNotes();
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
							var extraPoints = parseInt(beatsArray[i].extraPoints)*100;
							score += parseInt(beatsArray[i].points + extraPoints);
							console.log("s: " + score);
							totalCombo++;
							comboLabel.setString(totalCombo);
							comboLabel.setOpacity(255);
							scoreLabel.setString("Score: " + score);

						}
					}
				}
			}
			if(event == 88){
				hitBox2.setOpacity(255);
				for(var i = 0 ; i < beatsArray.length ; i++){
					if(cc.Rect.CCRectIntersectsRect(beatsArray[i].getBoundingBox(),whitebox2.getBoundingBox()) === true){
						if(beatsArray[i].type == "blue"){
							gameLayer.removeChild(beatsArray[i]);
							beatsArray.splice(i,1);
							var extraPoints = parseInt(beatsArray[i].extraPoints)*100;
							score += parseInt(beatsArray[i].points + extraPoints);
							console.log("s: " + score);
							totalCombo++;
							comboLabel.setString(totalCombo);
							comboLabel.setOpacity(255);
							scoreLabel.setString("Score: " + score);

						}
					}
				}
			}
			if(event == 188){
				hitBox3.setOpacity(255);
				for(var i = 0 ; i < beatsArray.length ; i++){
					if(cc.Rect.CCRectIntersectsRect(beatsArray[i].getBoundingBox(),whitebox3.getBoundingBox()) === true){
						if(beatsArray[i].type == "purple"){
							gameLayer.removeChild(beatsArray[i]);
							beatsArray.splice(i,1);
							var extraPoints = parseInt(beatsArray[i].extraPoints)*100;
							score += parseInt(beatsArray[i].points + extraPoints);
							console.log("s: " + score);
							totalCombo++;
							comboLabel.setString(totalCombo);
							comboLabel.setOpacity(255);
							scoreLabel.setString("Score: " + score);

						}
					}
				}
			}
			if(event == 190){
				hitBox4.setOpacity(255);
				for(var i = 0 ; i < beatsArray.length ; i++){
					if(cc.Rect.CCRectIntersectsRect(beatsArray[i].getBoundingBox(),whitebox4.getBoundingBox()) === true){
						if(beatsArray[i].type == "green"){
							gameLayer.removeChild(beatsArray[i]);
							beatsArray.splice(i,1);
							var extraPoints = parseInt(beatsArray[i].extraPoints)*100;
							score += parseInt(beatsArray[i].points + extraPoints);
							console.log("s: " + score);
							totalCombo++;
							comboLabel.setString(totalCombo);
							comboLabel.setOpacity(255);
							scoreLabel.setString("Score: " + score);

						}
					}
				}
			}
		}
		if(event == 8){
			console.log("Prev: " + prevScene[prevScene.length-1] + " This: " + gameScene);
			if(prevScene.length > 0){
				if(prevScene[prevScene.length-1] == "startScreen"){
					prevScene.pop();
					setupStartScreen();
				}
				if(prevScene[prevScene.length-1] == "singleSongSelection"){
					prevScene.pop();
					setupSingleSongSelection();
				}
				if(prevScene[prevScene.length-1] == "gameRoom"){
					prevScene.pop();
					setupGameRoom();
				}
				if(prevScene[prevScene.length-1] == "songSelection"){
					prevScene.pop();
					setupSongSelection();
				}
			}
		}
	}
		// others
		if(event == 89 && isChallenged){
			isChallenged = false;
			socket.emit('accept challenge');
			removeChallengeOverlay();
		}
		if(event == 78 && isChallenged){
			isChallenged = false;
			socket.emit('decline challenge');
			removeChallengeOverlay();
		}
	}
});