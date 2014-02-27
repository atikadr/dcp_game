var singleChooseyoursong;
var singleBlackBackground;
var singleSongsArray;

var singleSlot1;
var singleSlot2;
var singleSlot3;
var singleSlot4;
var singleSlot5;

var mySelection;

var mySelected;

var selected;

var myCurrentSelection = 0;

var selectedText;

var mySelectedSong = false;


function setupSingleSongSelection(){
	gameScene = "singleSongSelection";
	clearScreen();

	selected = false;

	singleBlackBackground = cc.LayerColor.create(new cc.Color4B(0,0,0,160),canvasWidth,canvasHeight);
	gameLayer.addChild(singleBlackBackground);

	roomTitle = cc.LabelTTF.create("Title","HelveticaNeue",48);
	roomTitle.setString("Song Selection");
	roomTitle.setPosition(new cc.Point(200,canvasHeight - 53));
	gameLayer.addChild(roomTitle);

	singleChooseyoursong = cc.LabelTTF.create("choose","HelveticaNeue-UltraLight",30,cc.size(250,30),cc.KCCTextAlignmentLeft);
	singleChooseyoursong.setString("Choose your song");
	singleChooseyoursong.setPosition(new cc.Point(170,canvasHeight - 140));
	gameLayer.addChild(singleChooseyoursong);

	mySelection = cc.LayerColor.create(new cc.Color4B(255,255,255,90),250,70);
	gameLayer.addChild(mySelection);
	mySelection.setPosition(new cc.Point(55,canvasHeight-429));

	mySelected = cc.Sprite.create("../images/playerBox.png");
	mySelected.setPosition(new cc.Point(canvasWidth/2,canvasHeight - 215));
	gameLayer.addChild(mySelected);


	var smallPlayer = cc.LabelTTF.create("Player 1","HelveticaNeue-UltraLight",14);
	smallPlayer.setPosition(new cc.Point(440, canvasHeight-188));
	gameLayer.addChild(smallPlayer);

	selectedText = cc.LabelTTF.create("","HelveticaNeue-UltraLight",32);
	selectedText.setPosition(new cc.Point(canvasWidth/2, canvasHeight - 215));
	gameLayer.addChild(selectedText);

	loadSingleSongList();
}

function loadSingleSongList(){
	$.ajax({
		url:"/songList",
		method:"GET",
		success:function(data){
			singleSongsArray = data;
			console.log(data);
			
			singleSlot1 = cc.LabelTTF.create("singleSlot1","HelveticaNeue-UltraLight",30,cc.size(250,30),cc.KCCTextAlignmentLeft);
			singleSlot1.setString(singleSongsArray[0].song+"\n"+singleSongsArray[0].number_of_stars);
			singleSlot1.setPosition(new cc.Point(200,canvasHeight-220));
			gameLayer.addChild(singleSlot1);
			singleSlot2 = cc.LabelTTF.create("singleSlot2","HelveticaNeue-UltraLight",30,cc.size(250,30),cc.KCCTextAlignmentLeft);
			singleSlot2.setString(singleSongsArray[1].song+"\n"+singleSongsArray[1].number_of_stars);
			singleSlot2.setPosition(new cc.Point(200,canvasHeight-300));
			gameLayer.addChild(singleSlot2);
			singleSlot3 = cc.LabelTTF.create("singleSlot3","HelveticaNeue-UltraLight",30,cc.size(250,30),cc.KCCTextAlignmentLeft);
			singleSlot3.setString(singleSongsArray[2].song+"\n"+singleSongsArray[2].number_of_stars);
			singleSlot3.setPosition(new cc.Point(200,canvasHeight-380));
			gameLayer.addChild(singleSlot3);
			singleSlot4 = cc.LabelTTF.create("singleSlot4","HelveticaNeue-UltraLight",30,cc.size(250,30),cc.KCCTextAlignmentLeft);
			singleSlot4.setString(singleSongsArray[3].song+"\n"+singleSongsArray[3].number_of_stars);
			singleSlot4.setPosition(new cc.Point(200,canvasHeight-460));
			gameLayer.addChild(singleSlot4);
			singleSlot5 = cc.LabelTTF.create("singleSlot5","HelveticaNeue-UltraLight",30,cc.size(250,30),cc.KCCTextAlignmentLeft);
			singleSlot5.setString(singleSongsArray[4].song+"\n"+singleSongsArray[4].number_of_stars);
			singleSlot5.setPosition(new cc.Point(200,canvasHeight-540));
			gameLayer.addChild(singleSlot5);
		}
	});
}