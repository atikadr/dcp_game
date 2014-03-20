function setupLeaderboard(){
	gameScene = "leaderboard";
	clearScreen();

	var leaderboardTitle = cc.LabelTTF.create("leaderboard","HelveticaNeue-Light",40, cc.size(250,40),cc.TEXT_ALIGNMENT_CENTER);
	leaderboardTitle.setString("Leaderboard");
	leaderboardTitle.setPosition(new cc.Point(canvasWidth/2,canvasHeight-100));
	gameLayer.addChild(leaderboardTitle);

	getRankings();
}

function getRankings(){
	var rankHeight = canvasHeight-250;
	$.ajax({
		url:"../leaderboard",
		success:function(data){
			console.log(data);

			var rankHeader = cc.LabelTTF.create("rank","HelveticaNeue-UltraLight",30,cc.size(250,50),cc.TEXT_ALIGNMENT_CENTER);
			rankHeader.setPosition(new cc.Point(300,canvasHeight-200));
			rankHeader.setString("Rank");

			var nameHeader = cc.LabelTTF.create("name","HelveticaNeue-UltraLight",30,cc.size(250,50),cc.TEXT_ALIGNMENT_CENTER);
			nameHeader.setPosition(new cc.Point(600, canvasHeight-200));
			nameHeader.setString("Username");

			var eloHeader = cc.LabelTTF.create("elo","HelveticaNeue-UltraLight",30,cc.size(250,50),cc.TEXT_ALIGNMENT_CENTER);
			eloHeader.setPosition(new cc.Point(900, canvasHeight-200));
			eloHeader.setString("ELO points");

			gameLayer.addChild(rankHeader);
			gameLayer.addChild(nameHeader);
			gameLayer.addChild(eloHeader);

			for(var i = 0 ; i < data.length ; i++){
				var rankingTitle = cc.LabelTTF.create("rank","HelveticaNeue-UltraLight",30,cc.size(250,50),cc.TEXT_ALIGNMENT_CENTER);
				rankingTitle.setPosition(new cc.Point(300,rankHeight));
				rankingTitle.setString(parseInt(i+1));

				var rankingName = cc.LabelTTF.create("name","HelveticaNeue-UltraLight",30,cc.size(250,50),cc.TEXT_ALIGNMENT_CENTER);
				rankingName.setPosition(new cc.Point(600, rankHeight));
				rankingName.setString(data[i].username);

				var rankingELO = cc.LabelTTF.create("elo","HelveticaNeue-UltraLight",30,cc.size(250,50),cc.TEXT_ALIGNMENT_CENTER);
				rankingELO.setPosition(new cc.Point(900, rankHeight));
				rankingELO.setString(data[i].elo);

				gameLayer.addChild(rankingTitle);
				gameLayer.addChild(rankingName);
				gameLayer.addChild(rankingELO);

				rankHeight -= 55;
			}
		}
	});
}