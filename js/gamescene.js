var gamescene = cc.Scene.extend({
	onEnter:function(){
		this._super();
		var layer = new gamesceneGame();
		layer.init();
		this.addChild(layer);
	}
})

var gameLayer;

var gameSpritesArray = new Array();

var beatsArray = new Array();

var redSquare;
var blueSquare;
var purpleSquare;
var greenSquare;

var gameSpeed = 7;

var socket = io.connect();

socket.on('test reply',function(data){
	console.log(data.message.beat);
});

function setupGameGen(){
	var playButton = cc.Sprite.create("../images/play.png");
	playButton.setPosition(new cc.Point(canvasWidth/2,canvasHeight/2));
	playButton.tag = "playButton";
	gameSpritesArray.push(playButton);
	gameLayer.addChild(playButton);

	redSquare = cc.Sprite.create("../images/redSquare.png");
	redSquare.setPosition(new cc.Point(canvasWidth/2-150,50));
	gameLayer.addChild(redSquare);

	blueSquare = cc.Sprite.create("../images/blueSquare.png");
	blueSquare.setPosition(new cc.Point(canvasWidth/2-50,50));
	gameLayer.addChild(blueSquare);

	purpleSquare = cc.Sprite.create("../images/purpleSquare.png");
	purpleSquare.setPosition(new cc.Point(canvasWidth/2+50,50));
	gameLayer.addChild(purpleSquare);

	greenSquare = cc.Sprite.create("../images/greenSquare.png");
	greenSquare.setPosition(new cc.Point(canvasWidth/2+150,50));
	gameLayer.addChild(greenSquare);
}

var counter = 0;

var scoreLabel;

var musicArray = new Array();

function saveTrack(){
	musicArray = {musicArray:musicArray};
	$.ajax({
		url: "/saveTrack",
		data: musicArray,
		type: "POST",
		success:function(data){
			console.log(data);
		}
	});
}

function startMusicGen(){
	$("#testSound").get(0).play();
	$("#testSound").bind("ended",function(){
		saveTrack();
	});
	gameLayer.schedule(function(){
		counter++;
	});
}

function startMusicPlay(){
	console.log(musicArray);
	$("#testSound").bind("ended",function(){
		console.log(beatsArray);
	});	
	$("#testSound").get(0).play();
	gameLayer.schedule(function(){
		counter++;
	});
	for(var i = 0 ; i < musicArray.length ; i++){
		var notePath = "../images/"+musicArray[i].type+"Note.png";
		var note = cc.Sprite.create(notePath);
		var notePosition;
		if(musicArray[i].type == "red"){
			notePosition = new cc.Point(canvasWidth/2-150,canvasHeight);
		}
		if(musicArray[i].type == "blue"){
			notePosition = new cc.Point(canvasWidth/2-50,canvasHeight);
		}
		if(musicArray[i].type == "purple"){
			notePosition = new cc.Point(canvasWidth/2+50,canvasHeight);
		}
		if(musicArray[i].type == "green"){
			notePosition = new cc.Point(canvasWidth/2+150,canvasHeight);
		}
		note.setPosition(notePosition);
		note.counterTiming = musicArray[i].timing;
		note.type = musicArray[i].type;
		gameLayer.addChild(note);
		note.noteIndex = i;
		beatsArray.push(note);
		note.schedule(function(){
			if(this.counterTiming <= counter){
				this.setPosition(new cc.Point(this.getPosition().x,this.getPosition().y-gameSpeed));
			}
			if(this.getPosition().y <= 0){
				totalCombo = 0;
				comboLabel.setString(totalCombo);
				for(var i = 0 ; i < beatsArray.length ; i++){
					if(beatsArray[i].noteIndex == this.noteIndex){
						beatsArray.splice(i,1);
					}
				}
				gameLayer.removeChild(this);
			}
		});
	}
}

var totalCombo = 0;
var comboLabel;

function getMusicArray(){
	$.ajax({
		url: "/getTrack",
		type: "GET",
		success:function(data){
			var tempArray = data.split("\n");
			for(var i = 0 ; i < tempArray.length-1 ; i++){
				var tempObject = {type:tempArray[i].split(",")[0],timing:tempArray[i].split(",")[1]};
				musicArray.push(tempObject);
			}
		}
	});
}

function setupGamePlay(){
	var playButton = cc.Sprite.create("../images/play.png");
	playButton.setPosition(new cc.Point(canvasWidth/2,canvasHeight/2));
	playButton.tag = "playButton";
	gameSpritesArray.push(playButton);
	gameLayer.addChild(playButton);

	whitebox1 = cc.Sprite.create("../images/whitebox.png");
	whitebox1.setPosition(canvasWidth/2-150,50);
	gameLayer.addChild(whitebox1);
	whitebox1.setOpacity(0);

	whitebox2 = cc.Sprite.create("../images/whitebox.png");
	whitebox2.setPosition(canvasWidth/2-50,50);
	whitebox2.setOpacity(0);
	gameLayer.addChild(whitebox2);

	whitebox3 = cc.Sprite.create("../images/whitebox.png");
	whitebox3.setPosition(canvasWidth/2+50,50);
	whitebox3.setOpacity(0);
	gameLayer.addChild(whitebox3);

	whitebox4 = cc.Sprite.create("../images/whitebox.png");
	whitebox4.setPosition(canvasWidth/2+150,50);
	whitebox4.setOpacity(0);
	gameLayer.addChild(whitebox4);

	redSquare = cc.Sprite.create("../images/redSquare.png");
	redSquare.setPosition(new cc.Point(canvasWidth/2-150,50));
	gameLayer.addChild(redSquare);

	blueSquare = cc.Sprite.create("../images/blueSquare.png");
	blueSquare.setPosition(new cc.Point(canvasWidth/2-50,50));
	gameLayer.addChild(blueSquare);

	purpleSquare = cc.Sprite.create("../images/purpleSquare.png");
	purpleSquare.setPosition(new cc.Point(canvasWidth/2+50,50));
	gameLayer.addChild(purpleSquare);

	greenSquare = cc.Sprite.create("../images/greenSquare.png");
	greenSquare.setPosition(new cc.Point(canvasWidth/2+150,50));
	gameLayer.addChild(greenSquare);

	scoreLabel = cc.LabelTTF.create("TEST","HelveticaNeue-Light");
	scoreLabel.setString(score);
	scoreLabel.setFontSize(24);
	scoreLabel.setPosition(new cc.Point(canvasWidth-40,canvasHeight-25));
	gameLayer.addChild(scoreLabel);

	comboLabel = cc.LabelTTF.create("combo","HelveticaNeue-Light");
	comboLabel.setString(totalCombo);
	comboLabel.setFontSize(50);
	comboLabel.setPosition(new cc.Point(canvasWidth/2,canvasHeight/2));
	gameLayer.addChild(comboLabel);

	comboLabel.schedule(function(){
		if(this.getOpacity() > 0){
			this.setOpacity(this.getOpacity()-5);
		}
	});

	getMusicArray();
}

var gameMode;
var canvasWidth, canvasHeight;
var score = 0;

var whitebox1;
var whitebox2;
var whitebox3;
var whitebox4;

var gamesceneGame = cc.Layer.extend({
	init:function(){
		console.log(window.location.href);
		if(window.location.href.indexOf("gameGen")!=-1){ // is gameGen
			gameMode = "generator";
		}
		else{ // is gamePlay
			gameMode = "play";
		}
		canvasWidth = parseInt($("#gameCanvas").css("width"));
		canvasHeight = parseInt($("#gameCanvas").css("height"));
		this._super();
		this.setMouseEnabled(true);
		this.setKeyboardEnabled(true);
		gameLayer = cc.LayerColor.create(new cc.Color4B(0, 51, 102, 255), canvasWidth, canvasHeight);
		this.addChild(gameLayer);
		if(gameMode == "generator"){
			setupGameGen();
		}
		else{
			setupGamePlay();
		}
		return true;
	},
	onMouseDown:function(event){
		var location = event.getLocation();
		var mousePoint = new cc.Point(location.x,location.y);
		if(gameMode == "generator"){
			for(var i = 0 ; i < gameSpritesArray.length ; i++){
				if(cc.Rect.CCRectContainsPoint(gameSpritesArray[i].getBoundingBox(),mousePoint) === true){
					if(gameSpritesArray[i].tag == "playButton"){
						gameLayer.removeChild(gameSpritesArray[i]);
						startMusicGen();
					}
				}
			}
		}
		else{
			for(var i = 0 ; i < gameSpritesArray.length ; i++){
				if(cc.Rect.CCRectContainsPoint(gameSpritesArray[i].getBoundingBox(),mousePoint) === true){
					if(gameSpritesArray[i].tag == "playButton"){
						gameLayer.removeChild(gameSpritesArray[i]);
						startMusicPlay();
					}
				}
			}
		}
	},
	onKeyUp:function(event){
		if(event == 90){
			redSquare.setOpacity(255);
			whitebox1.setOpacity(0);
		}
		if(event == 88){
			blueSquare.setOpacity(255);
			whitebox2.setOpacity(0);
		}
		if(event == 188){
			purpleSquare.setOpacity(255);
			whitebox3.setOpacity(0);
		}
		if(event == 190){
			greenSquare.setOpacity(255);
			whitebox4.setOpacity(0);
		}
	},
	onKeyDown:function(event){
		if(gameMode == "generator"){
			if(event == 90){ 
				var newRedSquare = cc.Sprite.create("../images/redNote.png");
				newRedSquare.setPosition(new cc.Point(canvasWidth/2-150,50));
				newRedSquare.ySpeed = gameSpeed;
				newRedSquare.xSpeed = 0;
				newRedSquare.schedule(function(){
					this.setPosition(new cc.Point(this.getPosition().x+this.xSpeed,this.getPosition().y+this.ySpeed));
					if(this.getPosition().y > canvasHeight){
						gameLayer.removeChild(this);
					}
				});
				musicArray.push({type:"red",timing:counter});
				beatsArray.push(newRedSquare);
				gameLayer.addChild(newRedSquare);
			}
			if(event == 88){ 
				var newBlueSquare = cc.Sprite.create("../images/blueNote.png");
				newBlueSquare.setPosition(new cc.Point(canvasWidth/2-50,50));
				newBlueSquare.ySpeed = gameSpeed;
				newBlueSquare.xSpeed = 0;
				newBlueSquare.schedule(function(){
					this.setPosition(new cc.Point(this.getPosition().x+this.xSpeed,this.getPosition().y+this.ySpeed));
					if(this.getPosition().y > canvasHeight){
						gameLayer.removeChild(this);
					}
				});
				musicArray.push({type:"blue",timing:counter});
				beatsArray.push(newBlueSquare);
				gameLayer.addChild(newBlueSquare);
			}
			if(event == 188){ 
				var newPurpleSquare = cc.Sprite.create("../images/purpleNote.png");
				newPurpleSquare.setPosition(new cc.Point(canvasWidth/2+50,50));
				newPurpleSquare.ySpeed = gameSpeed;
				newPurpleSquare.xSpeed = 0;
				newPurpleSquare.schedule(function(){
					this.setPosition(new cc.Point(this.getPosition().x+this.xSpeed,this.getPosition().y+this.ySpeed));
					if(this.getPosition().y > canvasHeight){
						gameLayer.removeChild(this);
					}
				});
				musicArray.push({type:"purple",timing:counter});
				beatsArray.push(newPurpleSquare);
				gameLayer.addChild(newPurpleSquare);
			}
			if(event == 190){ 
				var newGreenSquare = cc.Sprite.create("../images/greenNote.png");
				newGreenSquare.setPosition(new cc.Point(canvasWidth/2+150,50));
				newGreenSquare.ySpeed = gameSpeed;
				newGreenSquare.xSpeed = 0;
				newGreenSquare.schedule(function(){
					this.setPosition(new cc.Point(this.getPosition().x+this.xSpeed,this.getPosition().y+this.ySpeed));
					if(this.getPosition().y > 800){
						gameLayer.removeChild(this);
					}
				});
				musicArray.push({type:"green",timing:counter});
				beatsArray.push(newGreenSquare);
				gameLayer.addChild(newGreenSquare);
			}
		}
		else{
			if(event == 90){
				socket.emit('test',{beat:"red"});
				redSquare.setOpacity(200);
				whitebox1.setOpacity(255);
				for(var i = 0 ; i < beatsArray.length ; i++){
					if(cc.Rect.CCRectIntersectsRect(beatsArray[i].getBoundingBox(),whitebox1.getBoundingBox()) === true){
						if(beatsArray[i].type == "red"){
							gameLayer.removeChild(beatsArray[i]);
							beatsArray.splice(i,1);
							score += 100;
							totalCombo++;
							comboLabel.setString(totalCombo);
							comboLabel.setOpacity(255);
							scoreLabel.setString(score);

						}
					}
				}
			}
			if(event == 88){
				socket.emit('test',{beat:"blue"});
				blueSquare.setOpacity(200);
				whitebox2.setOpacity(255);
				for(var i = 0 ; i < beatsArray.length ; i++){
					if(cc.Rect.CCRectIntersectsRect(beatsArray[i].getBoundingBox(),whitebox2.getBoundingBox()) === true){
						if(beatsArray[i].type == "blue"){
							gameLayer.removeChild(beatsArray[i]);
							beatsArray.splice(i,1);
							score += 100;
							totalCombo++;
							comboLabel.setString(totalCombo);
							comboLabel.setOpacity(255);
							scoreLabel.setString(score);

						}
					}
				}
			}
			if(event == 188){
				socket.emit('test',{beat:"purple"});
				purpleSquare.setOpacity(200);
				whitebox3.setOpacity(255);
				for(var i = 0 ; i < beatsArray.length ; i++){
					if(cc.Rect.CCRectIntersectsRect(beatsArray[i].getBoundingBox(),whitebox3.getBoundingBox()) === true){
						if(beatsArray[i].type == "purple"){
							gameLayer.removeChild(beatsArray[i]);
							beatsArray.splice(i,1);
							score += 100;
							totalCombo++;
							comboLabel.setString(totalCombo);
							comboLabel.setOpacity(255);
							scoreLabel.setString(score);

						}
					}
				}
			}
			if(event == 190){
				socket.emit('test',{beat:"green"});
				greenSquare.setOpacity(200);
				whitebox4.setOpacity(255);
				for(var i = 0 ; i < beatsArray.length ; i++){
					if(cc.Rect.CCRectIntersectsRect(beatsArray[i].getBoundingBox(),whitebox4.getBoundingBox()) === true){
						if(beatsArray[i].type == "green"){
							gameLayer.removeChild(beatsArray[i]);
							beatsArray.splice(i,1);
							score += 100;
							totalCombo++;
							comboLabel.setString(totalCombo);
							comboLabel.setOpacity(255);
							scoreLabel.setString(score);

						}
					}
				}
			}

		}
	}
});