// global variables

var gameSpritesArray = new Array();

var beatsArray = new Array();
var beatsArrayOpp = new Array();

var redSquare;
var blueSquare;
var purpleSquare;
var greenSquare;


var whitebox1Opp;
var whitebox2Opp;
var whitebox3Opp;
var whitebox4Opp;

var redSquareOpp;
var blueSquareOpp;
var purpleSquareOpp;
var greenSquareOpp;

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
var totalComboOpp = 0;
var comboLabelOpp;
var comboLabel;

var scoreLabelOpp;

var musicArray = new Array();

var gameSpeed = 7;

var socket = io.connect();

var noteCount = 0;

socket.on('game start',function(data){
	startMusicPlay();
});

socket.on('test reply',function(data){
	var beat = data.message.beat;
	totalComboOpp = data.message.totalCombo;
	scoreOpp = data.message.score;
	comboLabelOpp.setString(totalComboOpp);
	scoreLabelOpp.setString("Score: " + scoreOpp);
	comboLabelOpp.setOpacity(255);
	if(beat == "red"){
		redSquareOpp.setOpacity(200);
		hitBoxOpp1.setOpacity(255);
		for(var i = 0 ; i < beatsArrayOpp.length ; i++){
			if(cc.Rect.CCRectIntersectsRect(beatsArrayOpp[i].getBoundingBox(),whitebox1Opp.getBoundingBox()) === true){
				if(beatsArrayOpp[i].type == "red"){
					gameLayer.removeChild(beatsArrayOpp[i]);
					beatsArrayOpp.splice(i,1);
				}
			}
		}
	}
	if(beat == "blue"){
		blueSquareOpp.setOpacity(200);
		hitBoxOpp2.setOpacity(255);
		for(var i = 0 ; i < beatsArrayOpp.length ; i++){
			if(cc.Rect.CCRectIntersectsRect(beatsArrayOpp[i].getBoundingBox(),whitebox2Opp.getBoundingBox()) === true){
				if(beatsArrayOpp[i].type == "blue"){
					gameLayer.removeChild(beatsArrayOpp[i]);
					beatsArrayOpp.splice(i,1);
				}
			}
		}
	}
	if(beat == "purple"){
		purpleSquareOpp.setOpacity(200);
		hitBoxOpp3.setOpacity(255);
		for(var i = 0 ; i < beatsArrayOpp.length ; i++){
			if(cc.Rect.CCRectIntersectsRect(beatsArrayOpp[i].getBoundingBox(),whitebox3Opp.getBoundingBox()) === true){
				if(beatsArrayOpp[i].type == "purple"){
					gameLayer.removeChild(beatsArrayOpp[i]);
					beatsArrayOpp.splice(i,1);
				}
			}
		}
	}
	if(beat == "green"){
		greenSquareOpp.setOpacity(200);
		hitBoxOpp4.setOpacity(255);
		for(var i = 0 ; i < beatsArrayOpp.length ; i++){
			if(cc.Rect.CCRectIntersectsRect(beatsArrayOpp[i].getBoundingBox(),whitebox4Opp.getBoundingBox()) === true){
				if(beatsArrayOpp[i].type == "green"){
					gameLayer.removeChild(beatsArrayOpp[i]);
					beatsArrayOpp.splice(i,1);
				}
			}
		}
	}
	if(beat == "redUp"){
		redSquareOpp.setOpacity(255);
		hitBoxOpp1.setOpacity(0);
	}
	if(beat == "blueUp"){
		blueSquareOpp.setOpacity(255);
		hitBoxOpp2.setOpacity(0);
	}
	if(beat == "purpleUp"){
		purpleSquareOpp.setOpacity(255);
		hitBoxOpp3.setOpacity(0);
	}
	if(beat == "greenUp"){
		greenSquareOpp.setOpacity(255);
		hitBoxOpp4.setOpacity(0);
	}
});

socket.on('startGame',function(){
	$("#testSound").get(0).play();
});

socket.on('beat',function(data){
	if(noteCount == 0){
		$("#testSound").get(0).play();
		gameLayer.schedule(function(){
			var removeArray = new Array();
			$.each(beatsArray,function(index,value){
				value.setPosition(new cc.Point(value.getPosition().x,value.getPosition().y-gameSpeed));
				if(value.getPosition().y <= 0){
					totalCombo = 0;
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

			var removeArrayOpp = new Array();
			$.each(beatsArrayOpp,function(index,value){
				value.setPosition(new cc.Point(value.getPosition().x,value.getPosition().y-gameSpeed));
				if(value.getPosition().y <= 0){
					totalComboOpp = 0;
					comboLabelOpp.setString(totalComboOpp);
					for(var i = 0 ; i < beatsArrayOpp.length ; i++){
						if(beatsArrayOpp[i].noteIndex == value.noteIndex){
							removeArrayOpp.push(value.noteIndex);
						}
					}
					gameLayer.removeChild(value); 
				}
			});
			for(var i = 0 ; i < removeArrayOpp.length ; i++){
				for(var j = 0 ; j < beatsArrayOpp.length ; j++){
					if(beatsArrayOpp[j].noteIndex == removeArrayOpp[i]){
						beatsArrayOpp.splice(j,1);
					}
				}
			}
		});
}
var notePath = "../images/note.png";
var note = cc.Sprite.create(notePath);
var notePosition;

if(data == "red"){
	notePosition = new cc.Point(canvasWidth/2-350-150,canvasHeight);
}
if(data == "blue"){
	notePosition = new cc.Point(canvasWidth/2-350-50,canvasHeight);
}
if(data == "purple"){
	notePosition = new cc.Point(canvasWidth/2-350+50,canvasHeight);
}
if(data == "green"){
	notePosition = new cc.Point(canvasWidth/2-350+150,canvasHeight);
}
note.setPosition(notePosition);
note.type = data;
gameLayer.addChild(note);
note.noteIndex = noteCount;
beatsArray.push(note);

var noteOpp = cc.Sprite.create(notePath);
var noteOppPosition;
if(data == "red"){
	noteOppPosition = new cc.Point(canvasWidth/2+350-150,canvasHeight);
}
if(data == "blue"){
	noteOppPosition = new cc.Point(canvasWidth/2+350-50,canvasHeight);
}
if(data == "purple"){
	noteOppPosition = new cc.Point(canvasWidth/2+350+50,canvasHeight);
}
if(data == "green"){
	noteOppPosition = new cc.Point(canvasWidth/2+350+150,canvasHeight);
}
noteOpp.setPosition(noteOppPosition);
noteOpp.type = data;
gameLayer.addChild(noteOpp);
noteOpp.noteIndex = noteCount;
beatsArrayOpp.push(noteOpp);

noteCount++;
});


function makeSecondPlayer(){
	whitebox1Opp = cc.Sprite.create("../images/whitebox.png");
	whitebox1Opp.setPosition(canvasWidth/2+350-150,50);
	gameLayer.addChild(whitebox1Opp);

	whitebox2Opp = cc.Sprite.create("../images/whitebox.png");
	whitebox2Opp.setPosition(canvasWidth/2+350-50,50);
	gameLayer.addChild(whitebox2Opp);

	whitebox3Opp = cc.Sprite.create("../images/whitebox.png");
	whitebox3Opp.setPosition(canvasWidth/2+350+50,50);
	gameLayer.addChild(whitebox3Opp);

	whitebox4Opp = cc.Sprite.create("../images/whitebox.png");
	whitebox4Opp.setPosition(canvasWidth/2+350+150,50);
	gameLayer.addChild(whitebox4Opp);

	redSquareOpp = cc.Sprite.create("../images/beat.png");
	redSquareOpp.setPosition(new cc.Point(canvasWidth/2+350-150,50));
	gameLayer.addChild(redSquareOpp);

	blueSquareOpp = cc.Sprite.create("../images/beat.png");
	blueSquareOpp.setPosition(new cc.Point(canvasWidth/2+350-50,50));
	gameLayer.addChild(blueSquareOpp);

	purpleSquareOpp = cc.Sprite.create("../images/beat.png");
	purpleSquareOpp.setPosition(new cc.Point(canvasWidth/2+350+50,50));
	gameLayer.addChild(purpleSquareOpp);

	greenSquareOpp = cc.Sprite.create("../images/beat.png");
	greenSquareOpp.setPosition(new cc.Point(canvasWidth/2+350+150,50));
	gameLayer.addChild(greenSquareOpp);

	hitBoxOpp1 = cc.Sprite.create("../images/animation.png");
	hitBoxOpp1.setPosition(canvasWidth/2+350-150,240);
	gameLayer.addChild(hitBoxOpp1);
	hitBoxOpp2 = cc.Sprite.create("../images/animation.png");
	hitBoxOpp2.setPosition(canvasWidth/2+350-50,240);
	gameLayer.addChild(hitBoxOpp2);
	hitBoxOpp3 = cc.Sprite.create("../images/animation.png");
	hitBoxOpp3.setPosition(canvasWidth/2+350+50,240);
	gameLayer.addChild(hitBoxOpp3);
	hitBoxOpp4 = cc.Sprite.create("../images/animation.png");
	hitBoxOpp4.setPosition(canvasWidth/2+350+150,240);
	gameLayer.addChild(hitBoxOpp4);

	hitBoxOpp1.setOpacity(0);
	hitBoxOpp2.setOpacity(0);
	hitBoxOpp3.setOpacity(0);
	hitBoxOpp4.setOpacity(0);

	scoreLabelOpp = cc.LabelTTF.create("TEST","HelveticaNeue-UltraLight",36,cc.size(250,36),cc.kCCTextAlignmentLeft);
	scoreLabelOpp.setString("Score: " + scoreOpp);
	scoreLabelOpp.setPosition(new cc.Point(canvasWidth/2 + 280,canvasHeight-50));
	gameLayer.addChild(scoreLabelOpp);

	comboLabelOpp = cc.LabelTTF.create("combo","HelveticaNeue-Light");
	comboLabelOpp.setString(totalComboOpp);
	comboLabelOpp.setFontSize(64);
	comboLabelOpp.setPosition(new cc.Point(canvasWidth/2+350,canvasHeight/2));
	gameLayer.addChild(comboLabelOpp);

	comboLabelOpp.schedule(function(){
		if(this.getOpacity() > 0){
			this.setOpacity(this.getOpacity()-5);
		}
	});
}

function startMusicPlay(){
	$("#testSound").get(0).play();
}

function setupGamePlay(){
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
	makeSecondPlayer();
}