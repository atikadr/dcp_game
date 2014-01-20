var gamescene = cc.Scene.extend({
	onEnter:function(){
		this._super();
		var layer = new gamesceneGame();
		layer.init();
		this.addChild(layer);
	}
})

var gamesceneGame = cc.Layer.extend({
	init:function(){
		this._super();
		var circleSpeed = 5;
		var s = cc.Director.getInstance().getWinSize();
		var gameLayer = cc.LayerColor.create(new cc.Color4B(0, 0, 0, 255), 500, 500)
		for(i=0;i<20;i++){
			console.log(i);
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
	}
});