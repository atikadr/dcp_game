var gamescene = cc.Scene.extend({
	onEnter:function(){
		this._super();
		var layer = new gamesceneGame();
		layer.init();
		this.addChild(layer);
	}
})

// global variables
var gameLayer;

var backgroundImage;


var gamesceneGame = cc.Layer.extend({
	init:function(){
		// original scene init functions
		canvasWidth = parseInt($("#gameCanvas").css("width"));
		canvasHeight = parseInt($("#gameCanvas").css("height"));
		this._super();
		this.setMouseEnabled(true);
		this.setKeyboardEnabled(true);
		gameLayer = cc.LayerColor.create(new cc.Color4B(0, 51, 102, 255), canvasWidth, canvasHeight);
		backgroundImage = cc.Sprite.create('../images/background.jpg');
		gameLayer.addChild(backgroundImage);
		backgroundImage.setPosition(new cc.Point(canvasWidth/2,canvasHeight/2));
		this.addChild(gameLayer);
		setupGamePlay();
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
		if(event == 32){ 
			for(var i = 0 ; i < gameSpritesArray.length ; i++){
				if(gameSpritesArray[i].tag == "playButton"){
					gameLayer.removeChild(gameSpritesArray[i]);
					socket.emit('game ready');
					startMusicPlay();
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
						score += 100;
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
						score += 100;
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
						score += 100;
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
						score += 100;
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
});