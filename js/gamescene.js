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

var gameSpeed = 10;

function setupGameGen(){
	var playButton = cc.Sprite.create("../images/play.png");
	playButton.setPosition(new cc.Point(200,400));
	playButton.tag = "playButton";
	gameSpritesArray.push(playButton);
	gameLayer.addChild(playButton);

	redSquare = cc.Sprite.create("../images/redSquare.png");
	redSquare.setPosition(new cc.Point(50,50));
	gameLayer.addChild(redSquare);

	blueSquare = cc.Sprite.create("../images/blueSquare.png");
	blueSquare.setPosition(new cc.Point(150,50));
	gameLayer.addChild(blueSquare);

	purpleSquare = cc.Sprite.create("../images/purpleSquare.png");
	purpleSquare.setPosition(new cc.Point(250,50));
	gameLayer.addChild(purpleSquare);

	greenSquare = cc.Sprite.create("../images/greenSquare.png");
	greenSquare.setPosition(new cc.Point(350,50));
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
			notePosition = new cc.Point(50,canvasHeight+10);
		}
		if(musicArray[i].type == "blue"){
			notePosition = new cc.Point(150,canvasHeight+10);
		}
		if(musicArray[i].type == "purple"){
			notePosition = new cc.Point(250,canvasHeight+10);
		}
		if(musicArray[i].type == "green"){
			notePosition = new cc.Point(350,canvasHeight+10);
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
	playButton.setPosition(new cc.Point(200,400));
	playButton.tag = "playButton";
	gameSpritesArray.push(playButton);
	gameLayer.addChild(playButton);

	redSquare = cc.Sprite.create("../images/redSquare.png");
	redSquare.setPosition(new cc.Point(50,50));
	gameLayer.addChild(redSquare);

	blueSquare = cc.Sprite.create("../images/blueSquare.png");
	blueSquare.setPosition(new cc.Point(150,50));
	gameLayer.addChild(blueSquare);

	purpleSquare = cc.Sprite.create("../images/purpleSquare.png");
	purpleSquare.setPosition(new cc.Point(250,50));
	gameLayer.addChild(purpleSquare);

	greenSquare = cc.Sprite.create("../images/greenSquare.png");
	greenSquare.setPosition(new cc.Point(350,50));
	gameLayer.addChild(greenSquare);

	scoreLabel = cc.LabelTTF.create("TEST");
	scoreLabel.setString(score);
	scoreLabel.setFontSize(24);
	scoreLabel.setPosition(new cc.Point(canvasWidth-40,canvasHeight-25));
	gameLayer.addChild(scoreLabel);

	getMusicArray();
}

var gameMode;
var canvasWidth, canvasHeight;
var score = 0;

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
	onKeyDown:function(event){
		if(gameMode == "generator"){
			if(event == 90){ 
				var newRedSquare = cc.Sprite.create("../images/redNote.png");
				newRedSquare.setPosition(new cc.Point(50,50));
				newRedSquare.ySpeed = gameSpeed;
				newRedSquare.xSpeed = 0;
				newRedSquare.schedule(function(){
					this.setPosition(new cc.Point(this.getPosition().x+this.xSpeed,this.getPosition().y+this.ySpeed));
					if(this.getPosition().y > 800){
						gameLayer.removeChild(this);
					}
				});
				musicArray.push({type:"red",timing:counter});
				beatsArray.push(newRedSquare);
				gameLayer.addChild(newRedSquare);
			}
			if(event == 88){ 
				var newBlueSquare = cc.Sprite.create("../images/blueNote.png");
				newBlueSquare.setPosition(new cc.Point(150,50));
				newBlueSquare.ySpeed = gameSpeed;
				newBlueSquare.xSpeed = 0;
				newBlueSquare.schedule(function(){
					this.setPosition(new cc.Point(this.getPosition().x+this.xSpeed,this.getPosition().y+this.ySpeed));
					if(this.getPosition().y > 800){
						gameLayer.removeChild(this);
					}
				});
				musicArray.push({type:"blue",timing:counter});
				beatsArray.push(newBlueSquare);
				gameLayer.addChild(newBlueSquare);
			}
			if(event == 188){ 
				var newPurpleSquare = cc.Sprite.create("../images/purpleNote.png");
				newPurpleSquare.setPosition(new cc.Point(250,50));
				newPurpleSquare.ySpeed = gameSpeed;
				newPurpleSquare.xSpeed = 0;
				newPurpleSquare.schedule(function(){
					this.setPosition(new cc.Point(this.getPosition().x+this.xSpeed,this.getPosition().y+this.ySpeed));
					if(this.getPosition().y > 800){
						gameLayer.removeChild(this);
					}
				});
				musicArray.push({type:"purple",timing:counter});
				beatsArray.push(newPurpleSquare);
				gameLayer.addChild(newPurpleSquare);
			}
			if(event == 190){ 
				var newGreenSquare = cc.Sprite.create("../images/greenNote.png");
				newGreenSquare.setPosition(new cc.Point(350,50));
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
				for(var i = 0 ; i < beatsArray.length ; i++){
					if(cc.Rect.CCRectIntersectsRect(beatsArray[i].getBoundingBox(),redSquare.getBoundingBox()) === true){
						if(beatsArray[i].type == "red"){
							gameLayer.removeChild(beatsArray[i]);
							beatsArray.splice(i,1);
							score += 100;
							scoreLabel.setString(score);

						}
					}
				}
			}
			if(event == 88){
				for(var i = 0 ; i < beatsArray.length ; i++){
					if(cc.Rect.CCRectIntersectsRect(beatsArray[i].getBoundingBox(),blueSquare.getBoundingBox()) === true){
						if(beatsArray[i].type == "blue"){
							gameLayer.removeChild(beatsArray[i]);
							beatsArray.splice(i,1);
							score += 100;
							scoreLabel.setString(score);

						}
					}
				}
			}
			if(event == 188){
				for(var i = 0 ; i < beatsArray.length ; i++){
					if(cc.Rect.CCRectIntersectsRect(beatsArray[i].getBoundingBox(),purpleSquare.getBoundingBox()) === true){
						if(beatsArray[i].type == "purple"){
							gameLayer.removeChild(beatsArray[i]);
							beatsArray.splice(i,1);
							score += 100;
							scoreLabel.setString(score);

						}
					}
				}
			}
			if(event == 190){
				for(var i = 0 ; i < beatsArray.length ; i++){
					if(cc.Rect.CCRectIntersectsRect(beatsArray[i].getBoundingBox(),greenSquare.getBoundingBox()) === true){
						if(beatsArray[i].type == "green"){
							gameLayer.removeChild(beatsArray[i]);
							beatsArray.splice(i,1);
							score += 100;
							scoreLabel.setString(score);

						}
					}
				}
			}

		}
	}
});

/*****************

THE BELOW FUNCTION LOADS DESTRUCTABLE TERRAIN

*****************/

/*
var spriteArray = new Array();

function drawPoints(terrainArray){
	for(var i = 0 ; i < terrainArray.length ; i++){
		var yPoint = terrainArray[i].y;
		while(yPoint>0){
			var texSprite = cc.Sprite.create("../images/tex.jpg");
			texSprite.setPosition(new cc.Point(terrainArray[i].x,yPoint));
			gameLayer.addChild(texSprite);
			spriteArray.push(texSprite);
			yPoint -= 10;
		}
	}
}

function generatePoints(){
	var terrainKeyPoints = 60;
	var interval = 20;
	var pointX = 0;
	var pointY = 0;
	var topTerrainPoints = new Array();
	for(var i = 0 ; i < terrainKeyPoints ; i++){
		if(i>0 && i <= terrainKeyPoints/2){
			var newElevation = Math.floor(Math.random()*1000)%interval;
			topTerrainPoints[i] = {x:i*interval,y:topTerrainPoints[i-1].y + newElevation};
		}
		else if(i > terrainKeyPoints/2){
			var newElevation = Math.floor(Math.random()*1000)%interval;
			topTerrainPoints[i] = {x:i*interval,y:topTerrainPoints[i-1].y - newElevation};
			if(topTerrainPoints[i].y < 0){
				topTerrainPoints[i].y = 0;
			}
		}
		else if(i==0){
			topTerrainPoints[i] = {x:0,y:0};
		}
	}
	drawPoints(topTerrainPoints);
}

var gamesceneGame = cc.Layer.extend({
	init:function(){
		var canvasWidth = parseInt($("#gameCanvas").css("width"));
		var canvasHeight = parseInt($("#gameCanvas").css("height"));
		this._super();
		this.setMouseEnabled(true);
		this.setKeyboardEnabled(true);
		gameLayer = cc.LayerColor.create(new cc.Color4B(0, 51, 102, 255), canvasWidth, canvasHeight);
		this.addChild(gameLayer);
		generatePoints();
		return true;
	},
	onMouseDown:function(event){
		var location = event.getLocation();
		var mousePoint = new cc.Point(location.x,location.y);
		for(var i = 0 ; i < spriteArray.length ; i++){
			if(cc.Rect.CCRectContainsPoint(spriteArray[i].getBoundingBox(),mousePoint) === true){
				gameLayer.removeChild(spriteArray[i]);
			}
		}
	},
	onKeyDown:function(event){
		console.log(event);
	}
});

*/

/****************************

THE BELOW FUNCTION LOADS BALLS

****************************/

/*
var gamesceneGame = cc.Layer.extend({
	init:function(){
		var canvasWidth = parseInt($("#gameCanvas").css("width"));
		var canvasHeight = parseInt($("#gameCanvas").css("height"));
		this._super();
		this.setMouseEnabled(true);
		var circleSpeed = 5;
		var s = cc.Director.getInstance().getWinSize();
		gameLayer = cc.LayerColor.create(new cc.Color4B(0, 0, 0, 255), canvasWidth, canvasHeight)
		for(i=0;i<20;i++){
			var greenCircle = cc.Sprite.create("../images/greencircle.png");
			var randomDir = Math.random()*2*Math.PI;
			greenCircle.xSpeed=circleSpeed*Math.cos(randomDir);
			greenCircle.ySpeed=circleSpeed*Math.sin(randomDir);
			gameLayer.addChild(greenCircle);
			greenCircle.setPosition(new cc.Point(Math.random()*canvasWidth,Math.random()*canvasHeight));
			greenCircle.schedule(function(){
				this.setPosition(new cc.Point(this.getPosition().x+this.xSpeed,this.getPosition().y+this.ySpeed));
				if(this.getPosition().x>canvasWidth || this.getPosition().x<0){
					this.xSpeed = -this.xSpeed;
				}
				if(this.getPosition().y>canvasHeight || this.getPosition().y<0){
					this.ySpeed = -this.ySpeed;
				}
			})
		}
		this.addChild(gameLayer);
		return true;
	},
	onMouseDown:function(event){
		var canvasWidth = parseInt($("#gameCanvas").css("width"));
		var canvasHeight = parseInt($("#gameCanvas").css("height"));
		var location = event.getLocation();
		var redCircle = cc.Sprite.create("../images/redcircle.png");
		var i = Math.floor(Math.random()*5);
		redCircle.xSpeed = 5*Math.cos(i*Math.PI/2);
		redCircle.ySpeed = 5*Math.sin(i*Math.PI/2);
		gameLayer.addChild(redCircle);
		redCircle.setPosition(location);
		redCircle.schedule(function(){
			this.setPosition(new cc.Point(this.getPosition().x+this.xSpeed,this.getPosition().y+this.ySpeed));
			if(this.getPosition().x>canvasWidth || this.getPosition().x<0){
				this.xSpeed = -this.xSpeed;
			}
			if(this.getPosition().y>canvasHeight || this.getPosition().y<0){
				this.xSpeed = -this.xSpeed;
			}
		});
	}
});

*/