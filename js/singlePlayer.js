// global variables

var gameSpritesArray = new Array();

var beatsArray = new Array();

var redSquare;
var blueSquare;
var purpleSquare;
var greenSquare;

var hitBox1;
var hitBox2;
var hitBox3;
var hitBox4;

var hitBoxOpp1;
var hitBoxOpp2;
var hitBoxOpp3;
var hitBoxOpp4;

var gameMode;
var canvasWidth, canvasHeight;


var score = 0;
var scoreOpp = 0;

var totalCombo = 0;

var comboLabel;

var scoreLabelOpp;

var musicArray = new Array();

var singlegameSpeed = 7;

var socket = io.connect();

var noteCount = 0;

var singleCounter = 0;

var singleSongName;

function startSingleMusicPlay(){
	singleCounter = 0;
	cc.AudioEngine.getInstance().playMusic("../sounds/"+singleSongName+".mp3");
	gameLayer.unscheduleAllCallbacks();
	gameLayer.schedule(function(){
		while(musicArray.length > 0 && musicArray[0].timing == singleCounter){ // might crash if musicarray length = 0
			var notePath;
			var extraPoints;
			if(totalCombo < 10){
				extraPoints = 0;
				notePath = "../images/note.png";
			}
			else if(totalCombo < 20){
				extraPoints = 1;
				notePath = "../images/note2.png";
			}
			else if(totalCombo < 30){
				extraPoints = 2;
				notePath = "../images/note3.png";
			}
			else if(totalCombo < 50){
				extraPoints = 3;
				notePath = "../images/note4.png";
			}
			else if(totalCombo < 100){
				extraPoints = 4;
				notePath = "../images/note5.png";
			}
			else{
				extraPoints = 5;
				notePath = "../images/note6.png";
			}
			var note = cc.Sprite.create(notePath);
			var notePosition;

			if(musicArray[0].type == "red"){
				notePosition = new cc.Point(canvasWidth/2-350-150,canvasHeight);
			}
			if(musicArray[0].type == "blue"){
				notePosition = new cc.Point(canvasWidth/2-350-50,canvasHeight);
			}
			if(musicArray[0].type == "purple"){
				notePosition = new cc.Point(canvasWidth/2-350+50,canvasHeight);
			}
			if(musicArray[0].type == "green"){
				notePosition = new cc.Point(canvasWidth/2-350+150,canvasHeight);
			}
			note.setPosition(notePosition);
			note.type = musicArray[0].type;
			note.points = parseInt(musicArray[0].points);
			note.extraPoints = extraPoints;
			gameLayer.addChild(note);
			note.noteIndex = noteCount;
			beatsArray.push(note);
			noteCount++;

			musicArray.splice(0,1);
		}
		var removeArray = new Array();
		$.each(beatsArray,function(index,value){
			value.setPosition(new cc.Point(value.getPosition().x,value.getPosition().y-singlegameSpeed));
			if(value.getPosition().y <= 0){
				totalCombo = 0;
				comboLabel.setOpacity(255);
				comboLabel.setString(totalCombo);
				for(var i = 0 ; i < beatsArray.length ; i++){
					if(beatsArray[i].noteIndex == value.noteIndex){
						removeArray.push(value.noteIndex);
					}
				}
				gameLayer.removeChild(value); 
			}
		});
		for(var i = 0 ; i < removeArray.length ; i++){
			for(var j = 0 ; j < beatsArray.length ; j++){
				if(beatsArray[j].noteIndex == removeArray[i]){
					beatsArray.splice(j,1);
				}
			}
		}
		singleCounter++;
	});
}

function getSongNotes(){
	console.log("getSongNotes");
	$.ajax({
		url: "../getTrack/"+singleSongName,
		type: "GET",
		success:function(data){
			var tempArray = data.split(";");
			for(var i = 0 ; i < tempArray.length-1 ; i++){
				var tempObject = {type:tempArray[i].split(",")[0],timing:tempArray[i].split(",")[1],points:tempArray[i].split(",")[2]};
				musicArray.push(tempObject);
			}
			startSingleMusicPlay();
		}
	});
}

function setupSingleGamePlay(singlesong){
	singleSongName = singlesong;
	prevScene = [];
	gameScene = "singlePlayer";
	clearScreen();

	var separator = cc.Sprite.create("../images/separator.png");
	separator.setPosition(new cc.Point(canvasWidth/2, 415));
	gameLayer.addChild(separator);

	var playButton = cc.Sprite.create("../images/play.png");
	playButton.setPosition(new cc.Point(canvasWidth/2,canvasHeight/2));
	playButton.tag = "playButton";
	gameSpritesArray.push(playButton);
	gameLayer.addChild(playButton);

	whitebox1 = cc.Sprite.create("../images/whitebox.png");
	whitebox1.setPosition(canvasWidth/2-350-150,50);
	gameLayer.addChild(whitebox1);

	whitebox2 = cc.Sprite.create("../images/whitebox.png");
	whitebox2.setPosition(canvasWidth/2-350-50,50);
	gameLayer.addChild(whitebox2);

	whitebox3 = cc.Sprite.create("../images/whitebox.png");
	whitebox3.setPosition(canvasWidth/2-350+50,50);
	gameLayer.addChild(whitebox3);

	whitebox4 = cc.Sprite.create("../images/whitebox.png");
	whitebox4.setPosition(canvasWidth/2-350+150,50);
	gameLayer.addChild(whitebox4);

	redSquare = cc.Sprite.create("../images/beat.png");
	redSquare.setPosition(new cc.Point(canvasWidth/2-350-150,50));
	gameLayer.addChild(redSquare);

	blueSquare = cc.Sprite.create("../images/beat.png");
	blueSquare.setPosition(new cc.Point(canvasWidth/2-350-50,50));
	gameLayer.addChild(blueSquare);

	purpleSquare = cc.Sprite.create("../images/beat.png");
	purpleSquare.setPosition(new cc.Point(canvasWidth/2-350+50,50));
	gameLayer.addChild(purpleSquare);

	greenSquare = cc.Sprite.create("../images/beat.png");
	greenSquare.setPosition(new cc.Point(canvasWidth/2-350+150,50));
	gameLayer.addChild(greenSquare);

	hitBox1 = cc.Sprite.create("../images/animation.png");
	hitBox1.setPosition(canvasWidth/2-350-150,240);
	gameLayer.addChild(hitBox1);
	hitBox2 = cc.Sprite.create("../images/animation.png");
	hitBox2.setPosition(canvasWidth/2-350-50,240);
	gameLayer.addChild(hitBox2);
	hitBox3 = cc.Sprite.create("../images/animation.png");
	hitBox3.setPosition(canvasWidth/2-350+50,240);
	gameLayer.addChild(hitBox3);
	hitBox4 = cc.Sprite.create("../images/animation.png");
	hitBox4.setPosition(canvasWidth/2-350+150,240);
	gameLayer.addChild(hitBox4);

	hitBox1.setOpacity(0);
	hitBox2.setOpacity(0);
	hitBox3.setOpacity(0);
	hitBox4.setOpacity(0);

	scoreLabel = cc.LabelTTF.create("TEST","HelveticaNeue-UltraLight",36,cc.size(250,36),cc.kCCTextAlignmentLeft);
	scoreLabel.setString("Score: " + score);
	scoreLabel.setPosition(new cc.Point(180,canvasHeight-50));
	gameLayer.addChild(scoreLabel);

	comboLabel = cc.LabelTTF.create("combo","HelveticaNeue-Light");
	comboLabel.setString(totalCombo);
	comboLabel.setFontSize(64);
	comboLabel.setPosition(new cc.Point(canvasWidth/2-350,canvasHeight/2));
	gameLayer.addChild(comboLabel);

	comboLabel.schedule(function(){
		if(this.getOpacity() > 0){
			this.setOpacity(this.getOpacity()-5);
		}
	});
}