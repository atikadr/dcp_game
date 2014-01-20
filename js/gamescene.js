var gamescene = cc.Scene.extend({
	onEnter:function(){
		this._super();
		var layer = new gamesceneGame();
		layer.init();
		this.addChild(layer);
	}

})

var gameLayer;

var gamesceneGame = cc.Layer.extend({
	init:function(){
		this._super();
		this.setMouseEnabled(true);
		var circleSpeed = 2;
		var s = cc.Director.getInstance().getWinSize();
		gameLayer = cc.LayerColor.create(new cc.Color4B(0, 0, 0, 255), 500, 500)
		for(i=0;i<20;i++){
			var greenCircle = cc.Sprite.create("../images/greencircle.png");
			var randomDir = Math.random()*2*Math.PI;
			greenCircle.xSpeed=circleSpeed*Math.cos(randomDir);
			greenCircle.ySpeed=circleSpeed*Math.sin(randomDir);
			gameLayer.addChild(greenCircle);
			greenCircle.setPosition(new cc.Point(Math.random()*500,Math.random()*500));
			greenCircle.schedule(function(){
				this.setPosition(new cc.Point(this.getPosition().x+this.xSpeed,this.getPosition().y+this.ySpeed));
				if(this.getPosition().x>500){
					this.setPosition(new cc.Point(this.getPosition().x-500,this.getPosition().y));
				}
				if(this.getPosition().x<0){
					this.setPosition(new cc.Point(this.getPosition().x+500,this.getPosition().y));
				}
				if(this.getPosition().y>500){
					this.setPosition(new cc.Point(this.getPosition().x ,this.getPosition().y-500));
				}
				if(this.getPosition().y<0){
					this.setPosition(new cc.Point(this.getPosition().x ,this.getPosition().y+500));
				}
			})
		}
		this.addChild(gameLayer);
		return true;
	},
	onMouseDown:function(event){
		var location = event.getLocation();
		var redCircle = cc.Sprite.create("../images/redcircle.png");
		var i = Math.floor(Math.random()*5);
		redCircle.xSpeed = 5*Math.cos(i*Math.PI/2);
		redCircle.ySpeed = 5*Math.sin(i*Math.PI/2);
		gameLayer.addChild(redCircle);
		redCircle.setPosition(location);
		redCircle.schedule(function(){
			this.setPosition(new cc.Point(this.getPosition().x+this.xSpeed,this.getPosition().y+this.ySpeed));
			if(this.getPosition().x>500 || this.getPosition().y>500 || this.getPosition().x<0 || this.getPosition().y<0){
				redCircle.xSpeed = -redCircle.xSpeed;
				redCircle.ySpeed = -redCircle.ySpeed;
			}
		});
	}
});