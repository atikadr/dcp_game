var singlePlayerImage;
var multiplayerImage;
var jamSessionImage;
var settingsImage;

var dotImage;
var modeSelected = "singleplayer";

function repositionDot(){
	if(modeSelected == "singleplayer"){
		dotImage.setPosition(new cc.Point(singlePlayerImage.getPosition().x - singlePlayerImage.getBoundingBox().size.width/2 - 20,singlePlayerImage.getPosition().y));
	}
	if(modeSelected == "multiplayer"){
		dotImage.setPosition(new cc.Point(multiplayerImage.getPosition().x - multiplayerImage.getBoundingBox().size.width/2 - 20,multiplayerImage.getPosition().y));
	}
	if(modeSelected == "jamsession"){
		dotImage.setPosition(new cc.Point(jamSessionImage.getPosition().x - jamSessionImage.getBoundingBox().size.width/2 - 20,jamSessionImage.getPosition().y));
	}
	if(modeSelected == "settings"){
		dotImage.setPosition(new cc.Point(settingsImage.getPosition().x - settingsImage.getBoundingBox().size.width/2 - 20,settingsImage.getPosition().y));
	}
}

function setupStartScreen(){
	gameScene = "startScreen";
	clearScreen();
	var titleImage = cc.Sprite.create("../images/title.png");
	titleImage.setPosition(new cc.Point(canvasWidth/2,canvasHeight - 180));
	gameLayer.addChild(titleImage);

	singlePlayerImage = cc.Sprite.create("../images/singlePlayer.png");
	singlePlayerImage.setPosition(new cc.Point(canvasWidth/2,canvasHeight - 370));
	gameLayer.addChild(singlePlayerImage);

	multiplayerImage = cc.Sprite.create("../images/multiplayer.png");
	multiplayerImage.setPosition(new cc.Point(canvasWidth/2,canvasHeight - 455));
	gameLayer.addChild(multiplayerImage);

	jamSessionImage = cc.Sprite.create("../images/jamSession.png");
	jamSessionImage.setPosition(new cc.Point(canvasWidth/2,canvasHeight - 540));
	gameLayer.addChild(jamSessionImage);

	settingsImage = cc.Sprite.create("../images/settings.png");
	settingsImage.setPosition(new cc.Point(canvasWidth/2, canvasHeight - 625));
	gameLayer.addChild(settingsImage);

	instructionsImage = cc.Sprite.create("../images/instructions.png");
	instructionsImage.setPosition(new cc.Point(canvasWidth/2, canvasHeight - 715));
	gameLayer.addChild(instructionsImage);

	dotImage = cc.Sprite.create("../images/dot.png");
	gameLayer.addChild(dotImage);
	repositionDot();
}