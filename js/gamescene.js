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

function setupGame(){
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

var musicArray = new Array();

function startMusic(){
	$("#testSound").get(0).play();
	$("#testSound").bind("ended",function(){
		console.log(musicArray);
	});
	gameLayer.schedule(function(){
		//console.log(counter);
		counter++;
	});
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
		setupGame();
		return true;
	},
	onMouseDown:function(event){
		var location = event.getLocation();
		var mousePoint = new cc.Point(location.x,location.y);
		for(var i = 0 ; i < gameSpritesArray.length ; i++){
			if(cc.Rect.CCRectContainsPoint(gameSpritesArray[i].getBoundingBox(),mousePoint) === true){
				if(gameSpritesArray[i].tag == "playButton"){
					gameLayer.removeChild(gameSpritesArray[i]);
					startMusic();
				}
			}
		}
	},
	onKeyDown:function(event){
		console.log(event);
		if(event == 90){ // z
			var newRedSquare = cc.Sprite.create("../images/redSquare.png");
			newRedSquare.setPosition(new cc.Point(50,50));
			newRedSquare.ySpeed = gameSpeed;
			newRedSquare.xSpeed = 0;
			newRedSquare.schedule(function(){
				this.setPosition(new cc.Point(this.getPosition().x+this.xSpeed,this.getPosition().y+this.ySpeed));
				if(this.getPosition().y > 800){
					musicArray.push({type:"red",timing:counter});
					gameLayer.removeChild(this);
				}
			});
			beatsArray.push(newRedSquare);
			gameLayer.addChild(newRedSquare);
		}
		if(event == 88){ // x
			var newBlueSquare = cc.Sprite.create("../images/blueSquare.png");
			newBlueSquare.setPosition(new cc.Point(150,50));
			newBlueSquare.ySpeed = gameSpeed;
			newBlueSquare.xSpeed = 0;
			newBlueSquare.schedule(function(){
				this.setPosition(new cc.Point(this.getPosition().x+this.xSpeed,this.getPosition().y+this.ySpeed));
				if(this.getPosition().y > 800){
					musicArray.push({type:"blue",timing:counter});
					gameLayer.removeChild(this);
				}
			});
			beatsArray.push(newBlueSquare);
			gameLayer.addChild(newBlueSquare);
		}
		if(event == 188){ // ,
			var newPurpleSquare = cc.Sprite.create("../images/purpleSquare.png");
			newPurpleSquare.setPosition(new cc.Point(250,50));
			newPurpleSquare.ySpeed = gameSpeed;
			newPurpleSquare.xSpeed = 0;
			newPurpleSquare.schedule(function(){
				this.setPosition(new cc.Point(this.getPosition().x+this.xSpeed,this.getPosition().y+this.ySpeed));
				if(this.getPosition().y > 800){
					musicArray.push({type:"purple",timing:counter});
					gameLayer.removeChild(this);
				}
			});
			beatsArray.push(newPurpleSquare);
			gameLayer.addChild(newPurpleSquare);
		}
		if(event == 190){ // .
			var newGreenSquare = cc.Sprite.create("../images/greenSquare.png");
			newGreenSquare.setPosition(new cc.Point(350,50));
			newGreenSquare.ySpeed = gameSpeed;
			newGreenSquare.xSpeed = 0;
			newGreenSquare.schedule(function(){
				this.setPosition(new cc.Point(this.getPosition().x+this.xSpeed,this.getPosition().y+this.ySpeed));
				if(this.getPosition().y > 800){
					musicArray.push({type:"green",timing:counter});
					gameLayer.removeChild(this);
				}
			});
			beatsArray.push(newGreenSquare);
			gameLayer.addChild(newGreenSquare);
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