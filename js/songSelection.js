var roomTitle;
var chooseYourSong;
var opponentSong;
var blackBackground;
var songsArray;

var slot1;
var slot2;
var slot3;
var slot4;
var slot5;

var oppSlot1;
var oppSlot2;
var oppSlot3;
var oppSlot4;
var oppSlot5;

var mySelection;
var opponentSelection;

var mySelected;
var opponentSelected;

var selected;

var myCurrentSelection = 0;

var selectedText;
var opponentSelectedText;

socket.on('song selected',function(data){
	if(data.selectedSong == null){
		var oppSong = data.currentSong;
		oppSlot1.setString(songsArray[oppSong].song+"\n"+songsArray[oppSong].number_of_stars);
		oppSlot2.setString(songsArray[(oppSong+1)%songsArray.length].song+"\n"+songsArray[(oppSong+1)%songsArray.length].number_of_stars);
		oppSlot3.setString(songsArray[(oppSong+2)%songsArray.length].song+"\n"+songsArray[(oppSong+2)%songsArray.length].number_of_stars);
		oppSlot4.setString(songsArray[(oppSong+3)%songsArray.length].song+"\n"+songsArray[(oppSong+3)%songsArray.length].number_of_stars);
		oppSlot5.setString(songsArray[(oppSong+4)%songsArray.length].song+"\n"+songsArray[(oppSong+4)%songsArray.length].number_of_stars);
	}
	else{
		opponentSelectedText.setString(songsArray[data.selectedSong].song);

		oppSlot1.setColor(new cc.Color4B(172,172,172,255));
		oppSlot2.setColor(new cc.Color4B(172,172,172,255));
		oppSlot3.setColor(new cc.Color4B(172,172,172,255));
		oppSlot4.setColor(new cc.Color4B(172,172,172,255));
		oppSlot5.setColor(new cc.Color4B(172,172,172,255));

		gameLayer.removeChild(opponentSelection);
	}
});

function setupSongSelection(){
	gameScene = "songSelection";
	clearScreen();

	selected = false;

	blackBackground = cc.LayerColor.create(new cc.Color4B(0,0,0,160),canvasWidth,canvasHeight);
	gameLayer.addChild(blackBackground);

	roomTitle = cc.LabelTTF.create("Title","HelveticaNeue",48);
	roomTitle.setString("Song Selection");
	roomTitle.setPosition(new cc.Point(200,canvasHeight - 53));
	gameLayer.addChild(roomTitle);

	chooseYourSong = cc.LabelTTF.create("choose","HelveticaNeue-UltraLight",30,cc.size(250,30),cc.KCCTextAlignmentLeft);
	chooseYourSong.setString("Choose your song");
	chooseYourSong.setPosition(new cc.Point(170,canvasHeight - 140));
	gameLayer.addChild(chooseYourSong);

	opponentSong = cc.LabelTTF.create("opponent","HelveticaNeue-UltraLight",30);
	opponentSong.setString("Opponent song");
	opponentSong.setPosition(new cc.Point(canvasWidth-170,canvasHeight-140));
	gameLayer.addChild(opponentSong);

	mySelection = cc.LayerColor.create(new cc.Color4B(255,255,255,90),250,70);
	gameLayer.addChild(mySelection);
	mySelection.setPosition(new cc.Point(55,canvasHeight-429));

	opponentSelection = cc.LayerColor.create(new cc.Color4B(255,255,255,90),250,70);
	gameLayer.addChild(opponentSelection);
	opponentSelection.setPosition(new cc.Point(890,canvasHeight-429));

	mySelected = cc.Sprite.create("../images/playerBox.png");
	mySelected.setPosition(new cc.Point(canvasWidth/2,canvasHeight - 215));
	gameLayer.addChild(mySelected);

	opponentSelected = cc.Sprite.create("../images/playerBox.png");
	opponentSelected.setPosition(new cc.Point(canvasWidth/2,canvasHeight - 460));
	gameLayer.addChild(opponentSelected);

	var vsWord = cc.LabelTTF.create("versus","HelveticaNeue",36);
	vsWord.setPosition(new cc.Point(canvasWidth/2, canvasHeight - 337));
	gameLayer.addChild(vsWord);

	var smallPlayer = cc.LabelTTF.create("Player 1","HelveticaNeue-UltraLight",14);
	smallPlayer.setPosition(new cc.Point(440, canvasHeight-188));
	gameLayer.addChild(smallPlayer);

	var smallOpponent = cc.LabelTTF.create("Player 2","HelveticaNeue-UltraLight",14);
	smallOpponent.setPosition(new cc.Point(440, canvasHeight-433));
	gameLayer.addChild(smallOpponent);

	selectedText = cc.LabelTTF.create("","HelveticaNeue-UltraLight",32);
	selectedText.setPosition(new cc.Point(canvasWidth/2, canvasHeight - 215));
	gameLayer.addChild(selectedText);

	opponentSelectedText = cc.LabelTTF.create("","HelveticaNeue-UltraLight",32);
	opponentSelectedText.setPosition(new cc.Point(canvasWidth/2, canvasHeight - 460));
	gameLayer.addChild(opponentSelectedText);

	loadSongList();
}

socket.on('get opponent name',function(data){
	smallPlayer.setString(playerName);
	smallOpponent.setString(data.opponentName);
});

function loadSongList(){
	$.ajax({
		url:"/songList",
		method:"GET",
		success:function(data){
			songsArray = data;
			console.log(data);
			
			slot1 = cc.LabelTTF.create("slot1","HelveticaNeue-UltraLight",30,cc.size(250,30),cc.KCCTextAlignmentLeft);
			slot1.setString(songsArray[0].song+"\n"+songsArray[0].number_of_stars);
			slot1.setPosition(new cc.Point(200,canvasHeight-220));
			gameLayer.addChild(slot1);
			slot2 = cc.LabelTTF.create("slot2","HelveticaNeue-UltraLight",30,cc.size(250,30),cc.KCCTextAlignmentLeft);
			slot2.setString(songsArray[1].song+"\n"+songsArray[1].number_of_stars);
			slot2.setPosition(new cc.Point(200,canvasHeight-300));
			gameLayer.addChild(slot2);
			slot3 = cc.LabelTTF.create("slot3","HelveticaNeue-UltraLight",30,cc.size(250,30),cc.KCCTextAlignmentLeft);
			slot3.setString(songsArray[2].song+"\n"+songsArray[2].number_of_stars);
			slot3.setPosition(new cc.Point(200,canvasHeight-380));
			gameLayer.addChild(slot3);
			slot4 = cc.LabelTTF.create("slot4","HelveticaNeue-UltraLight",30,cc.size(250,30),cc.KCCTextAlignmentLeft);
			slot4.setString(songsArray[3].song+"\n"+songsArray[3].number_of_stars);
			slot4.setPosition(new cc.Point(200,canvasHeight-460));
			gameLayer.addChild(slot4);
			slot5 = cc.LabelTTF.create("slot5","HelveticaNeue-UltraLight",30,cc.size(250,30),cc.KCCTextAlignmentLeft);
			slot5.setString(songsArray[4].song+"\n"+songsArray[4].number_of_stars);
			slot5.setPosition(new cc.Point(200,canvasHeight-540));
			gameLayer.addChild(slot5);

			oppSlot1 = cc.LabelTTF.create("oppSlot1","HelveticaNeue-UltraLight",30,cc.size(250,30),cc.TEXT_ALIGNMENT_RIGHT);
			oppSlot1.setString(songsArray[0].song+"\n"+songsArray[0].number_of_stars);
			oppSlot1.setPosition(new cc.Point(canvasWidth - 200,canvasHeight-220));
			gameLayer.addChild(oppSlot1);
			oppSlot2 = cc.LabelTTF.create("oppSlot2","HelveticaNeue-UltraLight",30,cc.size(250,30),cc.TEXT_ALIGNMENT_RIGHT);
			oppSlot2.setString(songsArray[1].song+"\n"+songsArray[1].number_of_stars);
			oppSlot2.setPosition(new cc.Point(canvasWidth - 200,canvasHeight-300));
			gameLayer.addChild(oppSlot2);
			oppSlot3 = cc.LabelTTF.create("oppSlot3","HelveticaNeue-UltraLight",30,cc.size(250,30),cc.TEXT_ALIGNMENT_RIGHT);
			oppSlot3.setString(songsArray[2].song+"\n"+songsArray[2].number_of_stars);
			oppSlot3.setPosition(new cc.Point(canvasWidth - 200,canvasHeight-380));
			gameLayer.addChild(oppSlot3);
			oppSlot4 = cc.LabelTTF.create("oppSlot4","HelveticaNeue-UltraLight",30,cc.size(250,30),cc.TEXT_ALIGNMENT_RIGHT);
			oppSlot4.setString(songsArray[3].song+"\n"+songsArray[3].number_of_stars);
			oppSlot4.setPosition(new cc.Point(canvasWidth - 200,canvasHeight-460));
			gameLayer.addChild(oppSlot4);
			oppSlot5 = cc.LabelTTF.create("oppSlot5","HelveticaNeue-UltraLight",30,cc.size(250,30),cc.TEXT_ALIGNMENT_RIGHT);
			oppSlot5.setString(songsArray[4].song+"\n"+songsArray[4].number_of_stars);
			oppSlot5.setPosition(new cc.Point(canvasWidth - 200,canvasHeight-540));
			gameLayer.addChild(oppSlot5);
		}
	});
}